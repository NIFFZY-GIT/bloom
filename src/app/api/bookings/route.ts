import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    // Get authenticated user ID if available
    let userId: number | null = null;
    
    // Check NextAuth session first
    const session = await auth();
    if (session?.user?.id) {
      userId = parseInt(session.user.id, 10);
      console.log('[Bookings API] User authenticated via NextAuth:', userId);
    } else {
      // Check legacy JWT token
      const cookieStore = await cookies();
      const token = cookieStore.get('auth_token')?.value;
      if (token) {
        try {
          const secret = process.env.JWT_SECRET || 'dev-secret';
          const payload = jwt.verify(token, secret) as { sub?: string | number };
          if (payload.sub) {
            userId = typeof payload.sub === 'number' ? payload.sub : parseInt(String(payload.sub), 10);
            console.log('[Bookings API] User authenticated via JWT:', userId);
          }
        } catch (error) {
          console.log('[Bookings API] JWT verification failed, proceeding as guest');
        }
      }
    }
    
    const body = await request.json();
    const {
      packageId,
      name,
      email,
      phone,
      date,
      startDate,
      endDate,
      guests,
      message,
      countryCode,
      foodAndSpecialRequests,
    } = body;

    const preferredStartRaw: string | null = typeof startDate === 'string' && startDate
      ? startDate
      : typeof date === 'string'
        ? date
        : null;

    const preferredEndRaw: string | null = typeof endDate === 'string' && endDate
      ? endDate
      : preferredStartRaw;

    if (!packageId || !name || !email || !preferredStartRaw || !guests) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const preferredStart = new Date(preferredStartRaw);
    const preferredEnd = preferredEndRaw ? new Date(preferredEndRaw) : null;

    if (Number.isNaN(preferredStart.valueOf())) {
      return NextResponse.json({ message: 'Invalid preferred start date' }, { status: 400 });
    }

    if (preferredEnd && Number.isNaN(preferredEnd.valueOf())) {
      return NextResponse.json({ message: 'Invalid preferred end date' }, { status: 400 });
    }

    if (preferredEnd && preferredEnd < preferredStart) {
      return NextResponse.json({ message: 'Preferred end date cannot be before start date' }, { status: 400 });
    }

    const preferredStartIso = preferredStartRaw;
    const preferredEndIso = preferredEndRaw ?? preferredStartRaw;

    // Include user_id in the INSERT if user is authenticated
    const insertWithEndQuery = userId
      ? `INSERT INTO bookings (package_id, user_id, customer_name, customer_email, customer_phone, preferred_date, preferred_end_date, number_of_guests, special_requests, food_and_special_requests)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *;`
      : `INSERT INTO bookings (package_id, customer_name, customer_email, customer_phone, preferred_date, preferred_end_date, number_of_guests, special_requests, food_and_special_requests)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *;`;

    const insertLegacyQuery = userId
      ? `INSERT INTO bookings (package_id, user_id, customer_name, customer_email, customer_phone, preferred_date, number_of_guests, special_requests, food_and_special_requests)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *;`
      : `INSERT INTO bookings (package_id, customer_name, customer_email, customer_phone, preferred_date, number_of_guests, special_requests, food_and_special_requests)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *;`;

    const trimmedPhone = typeof phone === 'string' ? phone.trim() : null;
    const trimmedCountryCode = typeof countryCode === 'string' ? countryCode.trim() : '';
    const normalizedCountryCode = trimmedCountryCode
      ? (trimmedCountryCode.startsWith('+') ? trimmedCountryCode : `+${trimmedCountryCode.replace(/^\+/, '')}`)
      : '';

    let phoneWithCountry = trimmedPhone;

    if (phoneWithCountry) {
      if (normalizedCountryCode && !phoneWithCountry.startsWith('+')) {
        phoneWithCountry = `${normalizedCountryCode} ${phoneWithCountry}`;
      }
    } else if (normalizedCountryCode) {
      phoneWithCountry = normalizedCountryCode;
    }

    const sanitizedPhone = phoneWithCountry ? phoneWithCountry.replace(/\s+/g, ' ').trim() : null;

    // Prepare values array based on whether user is authenticated
    const valuesWithEnd = userId
      ? [packageId, userId, name, email, sanitizedPhone, preferredStartIso, preferredEndIso, guests, message || null, foodAndSpecialRequests || null]
      : [packageId, name, email, sanitizedPhone, preferredStartIso, preferredEndIso, guests, message || null, foodAndSpecialRequests || null];

    let result;

    try {
      result = await query(insertWithEndQuery, valuesWithEnd);
    } catch (error) {
      const pgCode = typeof error === 'object' && error && 'code' in error ? (error as { code?: string }).code : undefined;
      if (pgCode === '42703' || error instanceof Error && error.message.includes('preferred_end_date')) {
        const legacyValues = userId
          ? [packageId, userId, name, email, sanitizedPhone, preferredStartIso, guests, message || null, foodAndSpecialRequests || null]
          : [packageId, name, email, sanitizedPhone, preferredStartIso, guests, message || null, foodAndSpecialRequests || null];
        result = await query(insertLegacyQuery, legacyValues);
      } else {
        throw error;
      }
    }

    const createdBooking = result.rows[0];
    if (createdBooking && !createdBooking.preferred_end_date) {
      createdBooking.preferred_end_date = preferredEndIso;
    }

    // Emails will be sent when user uploads receipt on confirmation page
    // No emails sent at this stage

    return NextResponse.json({ success: true, booking: createdBooking }, { status: 201 });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let selectQuery: string;
    let values: (string | number)[] = [];

    if (userId) {
      // Get bookings for a specific user (if you track user_id in bookings table)
      selectQuery = `
        SELECT 
          b.id,
          b.package_id,
          b.customer_name,
          b.customer_email,
          b.customer_phone,
          b.preferred_date,
          b.preferred_end_date,
          b.number_of_guests,
          b.special_requests,
          b.food_and_special_requests,
          b.created_at,
          b.status,
          tp.title AS package_title,
          tp.price
        FROM bookings b
        LEFT JOIN tour_packages tp ON b.package_id = tp.id
        WHERE b.user_id = $1
        ORDER BY b.created_at DESC NULLS LAST, b.id DESC;
      `;
      values = [userId];
    } else {
      // Get all bookings (admin view)
      selectQuery = `
        SELECT 
          b.id,
          b.package_id,
          b.customer_name,
          b.customer_email,
          b.customer_phone,
          b.preferred_date,
          b.preferred_end_date,
          b.number_of_guests,
          b.special_requests,
          b.food_and_special_requests,
          b.payment_status,
          b.receipt_url,
          b.receipt_uploaded_at,
          b.created_at,
          b.status,
          tp.title AS package_title,
          tp.price
        FROM bookings b
        LEFT JOIN tour_packages tp ON b.package_id = tp.id
        ORDER BY b.created_at DESC NULLS LAST, b.id DESC;
      `;
    }

    const result = await query(selectQuery, values);

    return NextResponse.json({ success: true, bookings: result.rows }, { status: 200 });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
