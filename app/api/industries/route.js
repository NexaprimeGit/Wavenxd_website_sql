// import connectDB from '../../lib/mongodb';
// import Industry from '../../models/Industry';
// import { NextResponse } from 'next/server';
// /**
//  * @typedef {import('next/server').NextRequest} NextRequest
//  */

// export async function GET() {
//   await connectDB();

//   const industries = await Industry.find({ isActive: true }).lean();
//   return NextResponse.json(industries);
// }

// SQL

import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

/**
 * @typedef {import('next/server').NextRequest} NextRequest
 */

export async function GET() {
  try {
    const [industries] = await pool.query(
      `SELECT * FROM industries
       WHERE is_active = TRUE
       ORDER BY created_at DESC`
    );

    return NextResponse.json(industries);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: 'Failed to fetch industries' },
      { status: 500 }
    );
  }
}