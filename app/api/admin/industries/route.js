// import { NextResponse } from 'next/server';
// import connectDB from '@/app/lib/mongodb';
// import Industry from '@/app/models/Industry';
// /**
//  * @typedef {import('next/server').NextRequest} NextRequest
//  */


// const ensureObject = (value) =>
//   typeof value === 'object' && value !== null ? value : {};

// export async function GET() {
//   try {
//     await connectDB();
//     const industries = await Industry.find().sort({ title: 1 });
//     return NextResponse.json(industries);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: 'Failed to fetch industries' },
//       { status: 500 },
//     );
//   }
// }

// export async function POST(req) {
//   try {
//     await connectDB();
//     const rawBody = await req.json();
//     const body = ensureObject(rawBody);
//     const industry = await Industry.create(body);
//     return NextResponse.json(industry, { status: 201 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: 'Failed to create industry' },
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
    const [industries] = await pool.query(
      `SELECT * FROM industries ORDER BY name ASC`
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

export async function POST(req) {
  const conn = await pool.getConnection();

  try {
    const rawBody = await req.json();
    const body =
      typeof rawBody === 'object' && rawBody !== null ? rawBody : {};

    const {
      name,
      slug,
      applications = []
    } = body;

    await conn.beginTransaction();

    // 1️⃣ Insert industry
    const [industryResult] = await conn.query(
      `INSERT INTO industries (name, slug)
       VALUES (?, ?)`,
      [name, slug]
    );

    const industryId = industryResult.insertId;

    // 2️⃣ Insert applications
    for (const app of applications) {
      const [appResult] = await conn.query(
        `INSERT INTO industry_applications 
        (industry_id, title, slug, description, image)
        VALUES (?, ?, ?, ?, ?)`,
        [
          industryId,
          app.title,
          app.slug,
          app.description,
          app.image
        ]
      );

      const appId = appResult.insertId;

      // 3️⃣ Insert technical papers (nested)
      if (app.technicalPapers?.length) {
        for (const paper of app.technicalPapers) {
          await conn.query(
            `INSERT INTO industry_application_papers
             (application_id, title, link)
             VALUES (?, ?, ?)`,
            [appId, paper.title, paper.link]
          );
        }
      }
    }

    await conn.commit();

    return NextResponse.json(
      { success: true, industryId },
      { status: 201 }
    );

  } catch (error) {
    await conn.rollback();
    console.error(error);

    return NextResponse.json(
      { message: 'Failed to create industry' },
      { status: 500 }
    );

  } finally {
    conn.release();
  }
}