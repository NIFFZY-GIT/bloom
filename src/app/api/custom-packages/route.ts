import { NextResponse } from 'next/server';
import db, { query } from '@/lib/db';
import { notifyAdminCustomPackage, sendCustomPackageAcknowledgment } from '@/lib/email';

interface PlacePayload {
  id: number | null;
  name: string;
  description: string | null;
  imagePath: string | null;
  category: string | null;
  duration: string;
  durationMinutes: number;
  price: number;
  location: string | null;
  highlights: string[];
  order: number;
}

const durationStringToMinutes = (value: string) => {
  if (!value) {
    return 0;
  }
  const parts = value.trim().split(/\s+/);
  if (parts.length === 0) {
    return 0;
  }
  const numeric = Number.parseFloat(parts[0]);
  if (!Number.isFinite(numeric)) {
    return 0;
  }
  const unit = parts[1]?.toLowerCase() ?? 'hours';
  if (unit.startsWith('min')) {
    return Math.round(numeric);
  }
  return Math.round(numeric * 60);
};

const normalizeString = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

const normalizeOptionalString = (value: unknown) => {
  const trimmed = normalizeString(value);
  return trimmed.length > 0 ? trimmed : null;
};

const coerceNumber = (value: unknown, fallback: number) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : fallback;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
  }

  const name = normalizeString(body?.name);
  const description = normalizeOptionalString(body?.description);

  if (!name) {
    return NextResponse.json({ message: 'Package name is required' }, { status: 400 });
  }

  const placesInput = Array.isArray(body?.places) ? body.places : [];
  if (placesInput.length === 0) {
    return NextResponse.json({ message: 'Select at least one place for your tour' }, { status: 400 });
  }

  const places: PlacePayload[] = placesInput.map((place: Record<string, unknown>, index: number) => {
    const highlightsArray = Array.isArray(place?.highlights)
      ? place.highlights.filter((item: unknown) => typeof item === 'string' && item.trim().length > 0)
      : [];

    const price = coerceNumber(place?.price, 0);
    const durationString = normalizeString(place?.duration) || '0 hours';
    const durationMinutes = durationStringToMinutes(durationString);

    return {
      id: typeof place?.id === 'number' ? place.id : null,
      name: normalizeString(place?.name) || `Selected Place ${index + 1}`,
      description: normalizeOptionalString(place?.description),
      imagePath: normalizeOptionalString(place?.imagePath),
      category: normalizeOptionalString(place?.category),
      duration: durationString,
      durationMinutes,
      price: Number.isFinite(price) ? Number(price.toFixed(2)) : 0,
      location: normalizeOptionalString(place?.location),
      highlights: highlightsArray,
      order: index + 1,
    };
  });

  const totals = (body?.totals ?? {}) as Record<string, unknown>;
  const totalDurationMinutes = coerceNumber(totals?.durationMinutes, 0);
  const totalDurationLabel = normalizeOptionalString(totals?.durationLabel) || '0 hours';

  const contact = (body?.contact ?? {}) as Record<string, unknown>;
  const contactEmail = normalizeString(contact?.email);
  const contactPhone = normalizeOptionalString(contact?.phone);
  const startDate = normalizeOptionalString(contact?.startDate);
  const endDate = normalizeOptionalString(contact?.endDate);
  const guestsRaw = coerceNumber(contact?.guests, 1);
  const guests = Number.isInteger(guestsRaw) && guestsRaw > 0 ? Math.min(guestsRaw, 100) : 1;
  const foodAndSpecialRequests = normalizeOptionalString(contact?.foodAndSpecialRequests);
  const additionalInfo = normalizeOptionalString(contact?.additionalInfo);

  if (!contactEmail) {
    return NextResponse.json({ message: 'Contact email is required' }, { status: 400 });
  }

  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    // Insert or get places from the places table
    const placeIds: number[] = [];
    
    for (const place of places) {
      // Check if place exists in places table
      let placeId: number;
      
      if (place.id) {
        // Check if this ID exists
        const existingPlace = await client.query(
          'SELECT id FROM places WHERE id = $1',
          [place.id]
        );
        
        if (existingPlace.rows.length > 0) {
          placeId = place.id;
        } else {
          // Insert new place
          const insertResult = await client.query(
            `INSERT INTO places (name, description, image_path, category, duration, location, highlights, price)
             VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8)
             RETURNING id`,
            [
              place.name,
              place.description,
              place.imagePath,
              place.category,
              place.duration,
              place.location,
              JSON.stringify(place.highlights),
              place.price,
            ]
          );
          placeId = insertResult.rows[0].id;
        }
      } else {
        // Insert new place
        const insertResult = await client.query(
          `INSERT INTO places (name, description, image_path, category, duration, location, highlights, price)
           VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8)
           RETURNING id`,
          [
            place.name,
            place.description,
            place.imagePath,
            place.category,
            place.duration,
            place.location,
            JSON.stringify(place.highlights),
            place.price,
          ]
        );
        placeId = insertResult.rows[0].id;
      }
      
      placeIds.push(placeId);
    }

    // Insert custom package
    const packageResult = await client.query(
      `INSERT INTO custom_packages (
         name,
         description,
         total_duration_minutes,
         total_duration_label,
         guests,
         contact_email,
         contact_phone,
         start_date,
         end_date,
         food_and_special_requests,
         additional_info,
         status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [
        name,
        description,
        totalDurationMinutes,
        totalDurationLabel,
        guests,
        contactEmail,
        contactPhone,
        startDate,
        endDate,
        foodAndSpecialRequests,
        additionalInfo,
        'pending',
      ],
    );

    const packageId = packageResult.rows[0].id;

    // Link places to custom package
    for (let i = 0; i < placeIds.length; i++) {
      await client.query(
        `INSERT INTO custom_package_places (custom_package_id, place_id, display_order)
         VALUES ($1, $2, $3)`,
        [packageId, placeIds[i], i + 1]
      );
    }

    await client.query('COMMIT');

    // Send email notifications to customer and all admins
    try {
      const placeNames = places.map((p) => p.name);
      const dateRange = startDate && endDate 
        ? `${startDate} to ${endDate}`
        : startDate 
          ? `From ${startDate}` 
          : endDate 
            ? `Until ${endDate}` 
            : 'Not specified';

      // Send acknowledgment to customer
      console.log(`Sending custom package acknowledgment to customer: ${contactEmail}`);
      await sendCustomPackageAcknowledgment({
        customerName: name, // Using package name as customer name (could be improved)
        customerEmail: contactEmail,
        packageName: name,
        packageId: String(packageId),
        places: placeNames,
        guests,
        dateRange,
      });

      // Get all admin users from database (role = 'ADMIN' in uppercase per schema)
      const adminResult = await client.query(
        `SELECT email FROM users WHERE role = $1`,
        ['ADMIN']
      );

      console.log(`Found ${adminResult.rows.length} admin(s) to notify about custom package`);

      // Send notification to each admin user in database
      for (const admin of adminResult.rows) {
        console.log(`Sending custom package notification to admin: ${admin.email}`);
        await notifyAdminCustomPackage({
          packageId: String(packageId),
          packageName: name,
          customerEmail: contactEmail,
          customerPhone: contactPhone,
          guests,
          duration: totalDurationLabel,
          places: placeNames,
          dateRange,
          toEmail: admin.email, // Send to this specific admin
        });
      }

      console.log('All custom package notification emails sent successfully');
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Failed to send custom package notification emails:', emailError);
    }

    return NextResponse.json({ success: true, packageId }, { status: 201 });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to save custom package:', error);
    return NextResponse.json({ message: 'Failed to submit custom package' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function GET() {
  try {
    const result = await query(
      `SELECT
         cp.id,
         cp.name,
         cp.description,
         cp.total_duration_minutes,
         cp.total_duration_label,
         cp.guests,
         cp.contact_email,
         cp.contact_phone,
         cp.start_date,
         cp.end_date,
         cp.food_and_special_requests,
         cp.additional_info,
         cp.status,
         cp.created_at,
         cp.updated_at,
         COALESCE(
           json_agg(
             json_build_object(
               'id', p.id,
               'name', p.name,
               'description', p.description,
               'imagePath', p.image_path,
               'category', p.category,
               'duration', p.duration,
               'location', p.location,
               'highlights', p.highlights,
               'price', p.price,
               'displayOrder', cpp.display_order
             )
             ORDER BY cpp.display_order
           )
           FILTER (WHERE p.id IS NOT NULL),
           '[]'
         ) AS places
       FROM custom_packages cp
       LEFT JOIN custom_package_places cpp ON cpp.custom_package_id = cp.id
       LEFT JOIN places p ON p.id = cpp.place_id
       GROUP BY cp.id
       ORDER BY cp.created_at DESC`
    );

    return NextResponse.json({ success: true, packages: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Failed to load custom packages:', error);
    return NextResponse.json({ message: 'Failed to load custom packages' }, { status: 500 });
  }
}
