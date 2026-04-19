// import { NextResponse } from 'next/server';
// import connectDB from '@/app/lib/mongodb';
// import Career from '@/app/models/Career';
// /**
//  * @typedef {import('next/server').NextRequest} NextRequest
//  */

// export async function GET(request, context) {
//   try {
//     await connectDB();

//     const { id } = await context.params;

//     const career = await Career.findById(id).lean();

//     if (!career) {
//       return NextResponse.json(
//         { message: 'Career not found' },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(career);
//   } catch (error) {
//     console.error('Career API error:', error);
//     return NextResponse.json(
//       { message: 'Failed to fetch career' },
//       { status: 500 },
//     );
//   }
// }

// SQL

import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

/**
 * @typedef {import('next/server').NextRequest} NextRequest
 */

export async function GET(request, context) {
  try {
    const { id } = context.params;

    // 1️⃣ Fetch main career
    const [careers] = await pool.query(
      `SELECT * FROM careers WHERE id = ?`,
      [id]
    );

    if (careers.length === 0) {
      return NextResponse.json(
        { message: 'Career not found' },
        { status: 404 }
      );
    }

    const career = careers[0];

    // 2️⃣ Fetch related arrays
    const [responsibilities] = await pool.query(
      `SELECT value FROM career_responsibilities WHERE career_id = ?`,
      [id]
    );

    const [eligibility] = await pool.query(
      `SELECT value FROM career_eligibility WHERE career_id = ?`,
      [id]
    );

    const [skills] = await pool.query(
      `SELECT value FROM career_skills WHERE career_id = ?`,
      [id]
    );

    const [benefits] = await pool.query(
      `SELECT value FROM career_benefits WHERE career_id = ?`,
      [id]
    );

    // 3️⃣ Attach arrays (Mongo-like response)
    career.responsibilities = responsibilities.map(r => r.value);
    career.eligibility = eligibility.map(e => e.value);
    career.skills = skills.map(s => s.value);
    career.benefits = benefits.map(b => b.value);

    return NextResponse.json(career);

  } catch (error) {
    console.error('Career API error:', error);

    return NextResponse.json(
      { message: 'Failed to fetch career' },
      { status: 500 }
    );
  }
}