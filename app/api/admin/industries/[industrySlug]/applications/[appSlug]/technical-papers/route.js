// import { NextResponse } from 'next/server';
// import connectDB from '@/app/lib/mongodb';
// import Industry from '@/app/models/Industry';
// /**
//  * @typedef {import('next/server').NextRequest} NextRequest
//  */


// /* ================= GET ================= */
// export async function GET(req, { params }) {
//   const { industrySlug, appSlug } = await params; // ✅

//   await connectDB();

//   const industry = await Industry.findOne({ slug: industrySlug });
//   if (!industry) {
//     return new Response('Industry not found', { status: 404 });
//   }

//   const application = industry.applications.find((a) => a.slug === appSlug);

//   if (!application) {
//     return new Response('Application not found', { status: 404 });
//   }

//   return Response.json(application.technicalPapers || []);
// }

// /* ================= POST ================= */
// export async function POST(req, { params }) {
//   try {
//     await connectDB();

//     const { industrySlug, appSlug } = await params;
//     const { title, link } = await req.json();

//     const industry = await Industry.findOne({ slug: industrySlug });
//     const app = industry?.applications.find((a) => a.slug === appSlug);

//     if (!industry || !app) {
//       return NextResponse.json({ message: 'Invalid route' }, { status: 404 });
//     }

//     app.technicalPapers.push({ title, link });
//     await industry.save();

//     return NextResponse.json({
//       success: true,
//       technicalPapers: app.technicalPapers,
//     });
//   } catch (err) {
//     console.error('POST ERROR:', err);
//     return NextResponse.json({ message: 'Add failed' }, { status: 500 });
//   }
// }

// /* ================= PUT ================= */
// export async function PUT(req, { params }) {
//   try {
//     await connectDB();

//     const { industrySlug, appSlug } = await params;
//     const { index, title, link } = await req.json();

//     const industry = await Industry.findOne({ slug: industrySlug });
//     const app = industry?.applications.find((a) => a.slug === appSlug);

//     if (!app || !app.technicalPapers[index]) {
//       return NextResponse.json({ message: 'Paper not found' }, { status: 404 });
//     }

//     app.technicalPapers[index] = { title, link };
//     await industry.save();

//     return NextResponse.json({
//       success: true,
//       technicalPapers: app.technicalPapers,
//     });
//   } catch (err) {
//     console.error('PUT ERROR:', err);
//     return NextResponse.json({ message: 'Update failed' }, { status: 500 });
//   }
// }

// /* ================= DELETE ================= */
// export async function DELETE(req, { params }) {
//   try {
//     await connectDB();

//     const { industrySlug, appSlug } = await params;
//     const { index } = await req.json();

//     const industry = await Industry.findOne({ slug: industrySlug });
//     const app = industry?.applications.find((a) => a.slug === appSlug);

//     if (!app || !app.technicalPapers[index]) {
//       return NextResponse.json({ message: 'Paper not found' }, { status: 404 });
//     }

//     app.technicalPapers.splice(index, 1);
//     await industry.save();

//     return NextResponse.json({
//       success: true,
//       technicalPapers: app.technicalPapers,
//     });
//   } catch (err) {
//     console.error('DELETE ERROR:', err);
//     return NextResponse.json({ message: 'Delete failed' }, { status: 500 });
//   }
// }

// SQL
import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET(req, { params }) {
  try {
    const { industrySlug, appSlug } = params;

    // 1. Get industry
    const [industryRows] = await pool.query(
      `SELECT id FROM industries WHERE slug = ?`,
      [industrySlug]
    );

    if (industryRows.length === 0) {
      return NextResponse.json(
        { message: 'Industry not found' },
        { status: 404 }
      );
    }

    // 2. Get application
    const [appRows] = await pool.query(
      `SELECT id FROM industry_applications 
       WHERE slug = ? AND industry_id = ?`,
      [appSlug, industryRows[0].id]
    );

    if (appRows.length === 0) {
      return NextResponse.json(
        { message: 'Application not found' },
        { status: 404 }
      );
    }

    // 3. Get papers
    const [papers] = await pool.query(
      `SELECT id, title, link 
       FROM industry_application_papers 
       WHERE application_id = ?`,
      [appRows[0].id]
    );

    return NextResponse.json(papers);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to fetch papers' },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    const { industrySlug, appSlug } = params;
    const { title, link } = await req.json();

    // Get application ID directly using JOIN 🔥
    const [rows] = await pool.query(
      `SELECT ia.id 
       FROM industry_applications ia
       JOIN industries i ON ia.industry_id = i.id
       WHERE i.slug = ? AND ia.slug = ?`,
      [industrySlug, appSlug]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Invalid route' }, { status: 404 });
    }

    const appId = rows[0].id;

    await pool.query(
      `INSERT INTO industry_application_papers 
       (application_id, title, link)
       VALUES (?, ?, ?)`,
      [appId, title, link]
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('POST ERROR:', err);
    return NextResponse.json({ message: 'Add failed' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { paperId, title, link } = await req.json();

    const [result] = await pool.query(
      `UPDATE industry_application_papers
       SET title = ?, link = ?
       WHERE id = ?`,
      [title, link, paperId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Paper not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('PUT ERROR:', err);
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { paperId } = await req.json();

    const [result] = await pool.query(
      `DELETE FROM industry_application_papers WHERE id = ?`,
      [paperId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Paper not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('DELETE ERROR:', err);
    return NextResponse.json({ message: 'Delete failed' }, { status: 500 });
  }
}