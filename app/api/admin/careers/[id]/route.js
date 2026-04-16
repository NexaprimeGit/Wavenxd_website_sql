// import connectDB from '@/app/lib/mongodb';
// import Career from '@/app/models/Career';
// import { NextResponse } from 'next/server';
// /**
//  * @typedef {import('next/server').NextRequest} NextRequest
//  */

// const ensureObject = (value) =>
//   typeof value === 'object' && value !== null ? value : {};

// export async function GET(req, context) {
//   try {
//     await connectDB();
//     const { id } = await context.params;

//     const career = await Career.findById(id).lean();
//     if (!career) {
//       return NextResponse.json({ error: 'Career not found' }, { status: 404 });
//     }

//     return NextResponse.json(career);
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function PUT(req, context) {
//   try {
//     await connectDB();
//     const { id } = await context.params;
//     const rawBody = await req.json();
//     const body = ensureObject(rawBody);

//     const updated = await Career.findByIdAndUpdate(id, body, {
//       new: true,
//     }).lean();

//     if (!updated) {
//       return NextResponse.json({ error: 'Career not found' }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, data: updated });
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function DELETE(req, context) {
//   try {
//     await connectDB();
//     const { id } = await context.params;

//     const deleted = await Career.findByIdAndDelete(id);
//     if (!deleted) {
//       return NextResponse.json({ error: 'Career not found' }, { status: 404 });
//     }

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// app/api/admin/careers/[id]/route.js
import pool from '@/app/lib/db';

// Helper to fetch a full career with all its related arrays
async function getCareerById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM careers WHERE id = ?', [id]
  );
  if (rows.length === 0) return null;

  const career = rows[0];

  const [[responsibilities], [eligibility], [skills], [benefits]] =
    await Promise.all([
      pool.query('SELECT value FROM career_responsibilities WHERE career_id = ?', [id]),
      pool.query('SELECT value FROM career_eligibility WHERE career_id = ?', [id]),
      pool.query('SELECT value FROM career_skills WHERE career_id = ?', [id]),
      pool.query('SELECT value FROM career_benefits WHERE career_id = ?', [id]),
    ]);

  return {
    ...career,
    responsibilities: responsibilities.map((r) => r.value),
    eligibility: eligibility.map((e) => e.value),
    skills: skills.map((s) => s.value),
    benefits: benefits.map((b) => b.value),
  };
}

// Helper to replace all array fields for a career
async function replaceCareerArrays(id, { responsibilities, eligibility, skills, benefits }) {
  const tables = [
    { table: 'career_responsibilities', values: responsibilities },
    { table: 'career_eligibility',      values: eligibility },
    { table: 'career_skills',           values: skills },
    { table: 'career_benefits',         values: benefits },
  ];

  await Promise.all(
    tables.map(async ({ table, values }) => {
      await pool.query(`DELETE FROM ${table} WHERE career_id = ?`, [id]);
      if (Array.isArray(values) && values.length > 0) {
        const rows = values.map((v) => [id, v]);
        await pool.query(
          `INSERT INTO ${table} (career_id, value) VALUES ?`,
          [rows]
        );
      }
    })
  );
}

export async function GET(req, context) {
  try {
    const { id } = await context.params;

    const career = await getCareerById(id);
    if (!career) {
      return Response.json({ error: 'Career not found' }, { status: 404 });
    }

    return Response.json(career);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    // Check career exists
    const [rows] = await pool.query(
      'SELECT id FROM careers WHERE id = ?', [id]
    );
    if (rows.length === 0) {
      return Response.json({ error: 'Career not found' }, { status: 404 });
    }

    const {
      title, location, experience, duration,
      description, is_open, type,
      responsibilities, eligibility, skills, benefits,
    } = body;

    // Update main career row
    await pool.query(
      `UPDATE careers
       SET title = ?, location = ?, experience = ?, duration = ?,
           description = ?, is_open = ?, type = ?
       WHERE id = ?`,
      [title, location, experience, duration, description, is_open ?? 1, type ?? 'job', id]
    );

    // Replace all array fields
    await replaceCareerArrays(id, { responsibilities, eligibility, skills, benefits });

    // Return updated career
    const updated = await getCareerById(id);
    return Response.json({ success: true, data: updated });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const { id } = await context.params;

    const [rows] = await pool.query(
      'SELECT id FROM careers WHERE id = ?', [id]
    );
    if (rows.length === 0) {
      return Response.json({ error: 'Career not found' }, { status: 404 });
    }

    // All related arrays deleted automatically via ON DELETE CASCADE
    await pool.query('DELETE FROM careers WHERE id = ?', [id]);

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}