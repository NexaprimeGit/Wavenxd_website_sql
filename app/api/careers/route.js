// import { NextResponse } from 'next/server';
// import connectDB from '@/app/lib/mongodb';
// import Career from '@/app/models/Career';
// /**
//  * @typedef {import('next/server').NextRequest} NextRequest
//  */

// export async function GET() {
//   try {
//     await connectDB();

//     const careers = await Career.find({ isOpen: true })
//       .sort({ createdAt: -1 })
//       .lean();

//     return NextResponse.json(careers);
//   } catch {
//     return NextResponse.json(
//       { message: 'Failed to fetch careers' },
//       { status: 500 },
//     );
//   }
// }

// SQL

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

/**
 * @typedef {import('next/server').NextRequest} NextRequest
 */

export async function GET() {
  try {
    const [careers] = await pool.query(
      `SELECT * FROM careers 
       WHERE is_open = TRUE
       ORDER BY created_at DESC`
    );

    return NextResponse.json(careers);

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: 'Failed to fetch careers' },
      { status: 500 }
    );
  }
}