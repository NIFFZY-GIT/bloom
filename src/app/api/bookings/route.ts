import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      packageId,
      name,
      email,
      phone,
      date,
      guests,
      message,
    } = body;

    if (!packageId || !name || !email || !date || !guests) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const insertQuery = `
      INSERT INTO bookings (package_id, customer_name, customer_email, customer_phone, preferred_date, number_of_guests, special_requests)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [packageId, name, email, phone, date, guests, message || null];

    const result = await query(insertQuery, values);

    return NextResponse.json({ success: true, booking: result.rows[0] }, { status: 201 });

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
    let values: any[] = [];

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
          b.number_of_guests,
          b.special_requests,
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
          b.number_of_guests,
          b.special_requests,
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
