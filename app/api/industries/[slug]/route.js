// import { NextResponse } from 'next/server';
// import connectDB from './../../../lib/mongodb';
// import Industry from './../../../models/Industry';
// /**
//  * @typedef {import('next/server').NextRequest} NextRequest
//  */

// export async function GET(req, context) {
//   try {
//     await connectDB();

//     const params = await context.params; // ✅ FIX
//     const { slug } = params;

//     const industry = await Industry.findOne({
//       slug,
//       isActive: true,
//     });

//     if (!industry) {
//       return NextResponse.json(
//         { message: 'Industry not found' },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(industry);
//   } catch (error) {
//     console.error('Industry slug API error:', error);
//     return NextResponse.json({ message: 'Server error' }, { status: 500 });
//   }
// }

// SQL

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

/**
 * @typedef {import('next/server').NextRequest} NextRequest
 */

export async function GET(req, context) {
  try {
    const { slug } = context.params;

    // 1️⃣ Get industry
    const [industries] = await pool.query(
      `SELECT * FROM industries 
       WHERE slug = ? AND is_active = TRUE`,
      [slug]
    );

    if (industries.length === 0) {
      return NextResponse.json(
        { message: 'Industry not found' },
        { status: 404 }
      );
    }

    const industry = industries[0];

    // 2️⃣ Get applications
    const [applications] = await pool.query(
      `SELECT * FROM industry_applications 
       WHERE industry_id = ?`,
      [industry.id]
    );

    // 3️⃣ Get all papers (for all applications)
    const [papers] = await pool.query(
      `SELECT * FROM industry_application_papers 
       WHERE application_id IN (
         SELECT id FROM industry_applications WHERE industry_id = ?
       )`,
      [industry.id]
    );

    // 4️⃣ Map papers → applications
    const appsWithPapers = applications.map(app => {
      const appPapers = papers.filter(
        p => p.application_id === app.id
      );

      return {
        ...app,
        technicalPapers: appPapers.map(p => ({
          title: p.title,
          link: p.link
        }))
      };
    });

    // 5️⃣ Final response (Mongo-like structure)
    return NextResponse.json({
      ...industry,
      applications: appsWithPapers
    });

  } catch (error) {
    console.error('Industry slug API error:', error);

    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}