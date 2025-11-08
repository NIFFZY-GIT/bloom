import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { notifyUserQuotationUploaded, notifyAdminCustomPackage } from '@/lib/email';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return false;
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret) as { role?: string };
    return payload.role === 'ADMIN';
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Check admin authentication
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const packageId = formData.get('packageId') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    if (!packageId) {
      return NextResponse.json(
        { success: false, message: 'Package ID is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, message: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (15MB max)
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds 15MB limit' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'quotations');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `quotation_pkg${packageId}_${timestamp}_${sanitizedFilename}`;
    const filepath = join(uploadsDir, filename);
    const publicPath = `/uploads/quotations/${filename}`;

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Update database with quotation path
    await query(
      `UPDATE custom_packages 
       SET quotation_pdf_path = $1, updated_at = NOW() 
       WHERE id = $2`,
      [publicPath, packageId]
    );

    // Send notification emails to customer and all admins
    try {
      const packageResult = await query(
        `SELECT 
          cp.id,
          cp.name,
          cp.contact_email,
          cp.contact_phone,
          cp.guests,
          cp.total_duration_label,
          cp.start_date,
          cp.end_date,
          COALESCE(
            json_agg(p.name ORDER BY cpp.display_order)
            FILTER (WHERE p.id IS NOT NULL),
            '[]'
          ) AS places
        FROM custom_packages cp
        LEFT JOIN custom_package_places cpp ON cpp.custom_package_id = cp.id
        LEFT JOIN places p ON p.id = cpp.place_id
        WHERE cp.id = $1
        GROUP BY cp.id`,
        [packageId]
      );

      if (packageResult.rows.length > 0) {
        const packageData = packageResult.rows[0];
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const placeNames = Array.isArray(packageData.places) ? packageData.places : [];
        
        const startDate = packageData.start_date;
        const endDate = packageData.end_date;
        const dateRange = startDate && endDate 
          ? `${startDate} to ${endDate}`
          : startDate 
            ? `From ${startDate}` 
            : endDate 
              ? `Until ${endDate}` 
              : 'Not specified';

        // Send notification to customer
        console.log(`Sending quotation notification to customer: ${packageData.contact_email}`);
        await notifyUserQuotationUploaded({
          email: packageData.contact_email,
          packageName: packageData.name,
          quotationUrl: `${baseUrl}${publicPath}`,
        });

        // Get all admin users from database (role = 'ADMIN' in uppercase per schema)
        const adminResult = await query(
          `SELECT email FROM users WHERE role = $1`,
          ['ADMIN']
        );

        console.log(`Found ${adminResult.rows.length} admin(s) to notify`);

        // Send notification to each admin user in database
        for (const admin of adminResult.rows) {
          console.log(`Sending custom package notification to admin: ${admin.email}`);
          await notifyAdminCustomPackage({
            packageId: String(packageId),
            packageName: packageData.name,
            customerEmail: packageData.contact_email,
            customerPhone: packageData.contact_phone,
            guests: packageData.guests,
            duration: packageData.total_duration_label,
            places: placeNames,
            dateRange,
            toEmail: admin.email, // Send to this specific admin
          });
        }

        console.log('All custom package emails sent successfully');
      }
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Failed to send quotation notification emails:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Quotation uploaded successfully',
      pdfPath: publicPath,
    });
  } catch (error) {
    console.error('Failed to upload quotation:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload quotation' },
      { status: 500 }
    );
  }
}
