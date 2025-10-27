import { NextResponse } from 'next/server';

import { query } from '@/lib/db';
import { sendBookingConfirmationToUser, notifyAdminNewBooking } from '@/lib/email';

type RouteParams = {
  bookingId: string;
};

function isUndefinedColumnError(error: unknown) {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const code = 'code' in error ? (error as { code?: string }).code : undefined;
  if (code === '42703') {
    return true;
  }

  if (error instanceof Error && error.message.includes('column')) {
    return true;
  }

  return false;
}

export async function POST(request: Request, context: { params: Promise<RouteParams> }) {
  const { bookingId: bookingIdParam } = await context.params;
  const bookingId = Number(bookingIdParam);

  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    return NextResponse.json({ message: 'Invalid booking id' }, { status: 400 });
  }

  const body = await request.json().catch(() => null) as { receiptUrl?: string; mimeType?: string } | null;

  if (!body?.receiptUrl || typeof body.receiptUrl !== 'string') {
    return NextResponse.json({ message: 'Missing receipt URL' }, { status: 400 });
  }

  const trimmedUrl = body.receiptUrl.trim();
  if (!trimmedUrl) {
    return NextResponse.json({ message: 'Receipt URL is empty' }, { status: 400 });
  }

  let updated = false;

  const idColumns: Array<'id' | 'booking_id'> = ['id', 'booking_id'];
  const receiptColumns: Array<'receipt_url' | 'receipturl'> = ['receipt_url', 'receipturl'];
  const uploadedColumns: Array<'receipt_uploaded_at' | 'receiptuploadedat' | null> = ['receipt_uploaded_at', 'receiptuploadedat', null];
  const paymentStatusColumns: Array<'payment_status' | 'paymentstatus' | 'payment_state' | null> = ['payment_status', 'paymentstatus', 'payment_state', null];

  for (const idColumn of idColumns) {
    for (const receiptColumn of receiptColumns) {
      for (const uploadedColumn of uploadedColumns) {
        for (const paymentStatusColumn of paymentStatusColumns) {
          const assignments: string[] = [];
          const values: Array<string | number | Date> = [trimmedUrl];

          assignments.push(`${receiptColumn} = $${values.length}`);

          if (uploadedColumn) {
            assignments.push(`${uploadedColumn} = NOW()`);
          }

          if (paymentStatusColumn) {
            values.push('UNDER_REVIEW');
            assignments.push(`${paymentStatusColumn} = $${values.length}`);
          }

          values.push(bookingId);
          const sql = `UPDATE bookings SET ${assignments.join(', ')} WHERE ${idColumn} = $${values.length}`;

          try {
            const result = await query(sql, values);
            if ((result.rowCount ?? 0) > 0) {
              updated = true;
              break;
            }
          } catch (error) {
            if (isUndefinedColumnError(error)) {
              continue;
            }
            console.error('Failed to update booking receipt columns:', error);
            return NextResponse.json({ message: 'Failed to save receipt' }, { status: 500 });
          }
        }
        if (updated) {
          break;
        }
      }
      if (updated) {
        break;
      }
    }
    if (updated) {
      break;
    }
  }

  if (!updated) {
    console.warn('No booking rows updated for receipt upload.');
  }

  try {
    await query(
      `INSERT INTO booking_receipts (booking_id, file_url, mime_type)
       VALUES ($1, $2, $3)`,
      [bookingId, trimmedUrl, body?.mimeType ?? null],
    );
  } catch (error) {
    if (!isUndefinedColumnError(error)) {
      console.error('Failed to insert booking receipt audit record:', error);
    }
  }

  // Send email notifications after successful receipt upload
  try {
    // Get booking details with package information
    const bookingResult = await query(
      `SELECT 
        b.id,
        b.customer_name,
        b.customer_email,
        b.customer_phone,
        b.preferred_date,
        b.number_of_guests,
        b.special_requests,
        tp.title as package_title,
        tp.price as price_per_person
      FROM bookings b
      LEFT JOIN tour_packages tp ON b.package_id = tp.id
      WHERE b.id = $1`,
      [bookingId]
    );

    if (bookingResult.rows.length > 0) {
      const booking = bookingResult.rows[0];
      
      // Convert database values to numbers (PostgreSQL returns NUMERIC as string)
      const pricePerPerson = Number(booking.price_per_person) || 0;
      const numberOfGuests = Number(booking.number_of_guests) || 1;
      const totalAmount = pricePerPerson * numberOfGuests;

      const emailData = {
        bookingId: String(bookingId),
        customerName: booking.customer_name,
        customerEmail: booking.customer_email,
        customerPhone: booking.customer_phone,
        packageName: booking.package_title || 'Tour Package',
        preferredDate: booking.preferred_date,
        preferredStartDate: booking.preferred_date,
        preferredEndDate: booking.preferred_date, // Same as start date since column doesn't exist
        numberOfGuests: numberOfGuests,
        totalAmount: totalAmount,
        pricePerPerson: pricePerPerson,
        specialRequests: booking.special_requests,
      };

      // Send confirmation email to customer
      console.log(`Sending booking confirmation to customer: ${booking.customer_email}`);
      console.log(`Email data:`, { totalAmount, pricePerPerson, numberOfGuests });
      await sendBookingConfirmationToUser(emailData);

      // Get all admin users from database (role = 'ADMIN' in uppercase per schema)
      const adminResult = await query(
        `SELECT email FROM users WHERE role = $1`,
        ['ADMIN']
      );

      console.log(`Found ${adminResult.rows.length} admin(s) to notify`);

      // Send notification to each admin user in database
      for (const admin of adminResult.rows) {
        console.log(`Sending booking notification to admin: ${admin.email}`);
        await notifyAdminNewBooking({
          ...emailData,
          toEmail: admin.email, // Send to this specific admin
        });
      }

      console.log('All booking confirmation emails sent successfully');
    } else {
      console.warn(`Booking #${bookingId} not found for email notification`);
    }
  } catch (emailError) {
    console.error('Failed to send booking confirmation emails:', emailError);
    // Don't fail the request if emails fail - receipt was already saved
  }

  return NextResponse.json({ success: true });
}
