// import { NextResponse } from 'next/server';
// import connectDB from '@/app/lib/mongodb';
// import Career from '@/app/models/Career';
// /**
//  * @typedef {import('next/server').NextRequest} NextRequest
//  */

// const ensureObject = (value) =>
//   typeof value === 'object' && value !== null ? value : {};

// export async function GET() {
//   try {
//     await connectDB();
//     const careers = await Career.find().sort({ createdAt: -1 }).lean();
//     return NextResponse.json(careers);
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   try {
//     await connectDB();
//     const rawBody = await req.json();
//     const body = ensureObject(rawBody);

//     const career = await Career.create(body);
//     return NextResponse.json({ success: true, career });
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 400 });
//   }
// }
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

/**
 * @typedef {import('next/server').NextRequest} NextRequest
 */

const ensureObject = (value) =>
  typeof value === 'object' && value !== null ? value : {};


// ✅ GET all careers
export async function GET() {
  try {
    const [careers] = await pool.query(
      `SELECT * FROM careers ORDER BY created_at DESC`
    );

    // Fetch related data for each career
    for (let career of careers) {
      const [responsibilities] = await pool.query(
        `SELECT value FROM career_responsibilities WHERE career_id = ?`,
        [career.id]
      );

      const [eligibility] = await pool.query(
        `SELECT value FROM career_eligibility WHERE career_id = ?`,
        [career.id]
      );

      const [skills] = await pool.query(
        `SELECT value FROM career_skills WHERE career_id = ?`,
        [career.id]
      );

      const [benefits] = await pool.query(
        `SELECT value FROM career_benefits WHERE career_id = ?`,
        [career.id]
      );

      career.responsibilities = responsibilities.map(r => r.value);
      career.eligibility = eligibility.map(e => e.value);
      career.skills = skills.map(s => s.value);
      career.benefits = benefits.map(b => b.value);
    }

    return NextResponse.json(careers);

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// ✅ CREATE career
export async function POST(req) {
  const conn = await pool.getConnection();

  try {
    const rawBody = await req.json();
    const body = ensureObject(rawBody);

    const {
      title,
      location,
      experience,
      duration,
      description,
      is_open = true,
      type = 'job',
      responsibilities = [],
      eligibility = [],
      skills = [],
      benefits = []
    } = body;

    await conn.beginTransaction();

    // Insert main career
    const [result] = await conn.query(
      `INSERT INTO careers 
      (title, location, experience, duration, description, is_open, type)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, location, experience, duration, description, is_open, type]
    );

    const careerId = result.insertId;

    // Insert arrays
    for (const item of responsibilities) {
      await conn.query(
        `INSERT INTO career_responsibilities (career_id, value)
         VALUES (?, ?)`,
        [careerId, item]
      );
    }

    for (const item of eligibility) {
      await conn.query(
        `INSERT INTO career_eligibility (career_id, value)
         VALUES (?, ?)`,
        [careerId, item]
      );
    }

    for (const item of skills) {
      await conn.query(
        `INSERT INTO career_skills (career_id, value)
         VALUES (?, ?)`,
        [careerId, item]
      );
    }

    for (const item of benefits) {
      await conn.query(
        `INSERT INTO career_benefits (career_id, value)
         VALUES (?, ?)`,
        [careerId, item]
      );
    }

    await conn.commit();

    return NextResponse.json({
      success: true,
      careerId
    });

  } catch (err) {
    await conn.rollback();
    return NextResponse.json({ error: err.message }, { status: 400 });

  } finally {
    conn.release();
  }
}