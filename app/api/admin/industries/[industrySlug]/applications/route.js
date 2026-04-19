import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

/**
 * @typedef {import('next/server').NextRequest} NextRequest
 */

export async function GET(req, context) {
  try {
    const { industrySlug } = await context.params;

    // Get industry by slug
    const [industries] = await pool.query(
      'SELECT id FROM industries WHERE slug = ?',
      [industrySlug]
    );

    if (industries.length === 0) {
      return NextResponse.json(
        { message: 'Industry not found' },
        { status: 404 }
      );
    }

    const industryId = industries[0].id;

    // Get applications for this industry
    const [applications] = await pool.query(
      'SELECT id, industry_id, title, slug, description, image FROM industry_applications WHERE industry_id = ? ORDER BY title ASC',
      [industryId]
    );

    return NextResponse.json(applications || []);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
