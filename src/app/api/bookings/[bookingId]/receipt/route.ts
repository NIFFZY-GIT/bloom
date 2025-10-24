import { NextResponse } from 'next/server';

import { query } from '@/lib/db';

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

  return NextResponse.json({ success: true });
}
