import { NextResponse } from 'next/server';
import db, { query } from '@/lib/db';

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

const coerceBoolean = (value: unknown, fallback: boolean) => {
  if (typeof value === 'boolean') {
    return value;
  }
  return fallback;
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
  let body: any;
  try {
    body = await request.json();
  } catch (error) {
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

  const places: PlacePayload[] = placesInput.map((place: any, index: number) => {
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

  const totalDurationMinutes = places.reduce((total, place) => total + place.durationMinutes, 0);
  const totalPrice = places.reduce((total, place) => total + place.price, 0);

  const preferences = body?.preferences ?? {};
  const pace = normalizeString(preferences?.pace) || 'moderate';
  const transport = normalizeString(preferences?.transport) || 'walking';
  const includeGuide = coerceBoolean(preferences?.guide, true);
  const includeMeals = coerceBoolean(preferences?.meals, false);
  const includePhotography = coerceBoolean(preferences?.photography, false);

  const contact = body?.contact ?? {};
  const contactName = normalizeString(contact?.name);
  const contactEmail = normalizeString(contact?.email);
  const contactPhone = normalizeString(contact?.phone);
  const preferredDate = normalizeOptionalString(contact?.date);
  const guestsRaw = coerceNumber(contact?.guests, 1);
  const guests = Number.isInteger(guestsRaw) && guestsRaw > 0 ? Math.min(guestsRaw, 100) : 1;
  const specialRequests = normalizeOptionalString(contact?.specialRequests);

  if (!contactName || !contactEmail || !contactPhone) {
    return NextResponse.json({ message: 'Contact name, email, and phone are required' }, { status: 400 });
  }

  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    const packageResult = await client.query(
      `INSERT INTO custom_package_requests (
         package_name,
         package_description,
         total_duration_minutes,
         total_price,
         pace,
         transport,
         include_guide,
         include_meals,
         include_photography,
         contact_name,
         contact_email,
         contact_phone,
         preferred_date,
         guests,
         special_requests
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING id`,
      [
        name,
        description,
        totalDurationMinutes,
        Number(totalPrice.toFixed(2)),
        pace,
        transport,
        includeGuide,
        includeMeals,
        includePhotography,
        contactName,
        contactEmail,
        contactPhone,
        preferredDate,
        guests,
        specialRequests,
      ],
    );

    const requestId = packageResult.rows[0].id as number;

    for (const place of places) {
      await client.query(
        `INSERT INTO custom_package_request_places (
           custom_package_id,
           place_external_id,
           place_name,
           place_description,
           image_path,
           category,
           duration_minutes,
           price,
           location,
           highlights,
           sequence
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::text[], $11)`,
        [
          requestId,
          place.id,
          place.name,
          place.description,
          place.imagePath,
          place.category,
          place.durationMinutes,
          place.price,
          place.location,
          place.highlights,
          place.order,
        ],
      );
    }

    await client.query('COMMIT');

    return NextResponse.json({ success: true, requestId }, { status: 201 });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to save custom package request:', error);
    return NextResponse.json({ message: 'Failed to submit custom package' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function GET() {
  try {
    const result = await query(
      `SELECT
         r.id,
         r.package_name,
         r.package_description,
         r.total_duration_minutes,
         r.total_price,
         r.pace,
         r.transport,
         r.include_guide,
         r.include_meals,
         r.include_photography,
         r.contact_name,
         r.contact_email,
         r.contact_phone,
         r.preferred_date,
         r.guests,
         r.special_requests,
         r.created_at,
         COALESCE(
           json_agg(
             json_build_object(
               'id', p.id,
               'externalId', p.place_external_id,
               'name', p.place_name,
               'description', p.place_description,
               'imagePath', p.image_path,
               'category', p.category,
               'durationMinutes', p.duration_minutes,
               'price', p.price,
               'location', p.location,
               'highlights', p.highlights,
               'sequence', p.sequence
             )
             ORDER BY p.sequence, p.id
           )
           FILTER (WHERE p.id IS NOT NULL),
           '[]'
         ) AS places
       FROM custom_package_requests r
       LEFT JOIN custom_package_request_places p ON p.custom_package_id = r.id
       GROUP BY r.id
       ORDER BY r.created_at DESC`
    );

    return NextResponse.json({ success: true, requests: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Failed to load custom package requests:', error);
    return NextResponse.json({ message: 'Failed to load custom packages' }, { status: 500 });
  }
}
