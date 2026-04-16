import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Industry from '@/app/models/Industry';
/**
 * @typedef {import('next/server').NextRequest} NextRequest
 */


export async function GET(req, context) {
  try {
    await connectDB();
    const { industrySlug } = await context.params;

    const industry = await Industry.findOne({ slug: industrySlug });
    if (!industry)
      return NextResponse.json(
        { message: 'Industry not found' },
        { status: 404 },
      );

    return NextResponse.json(industry.applications || []);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to fetch applications' },
      { status: 500 },
    );
  }
}
