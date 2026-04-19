// import { NextResponse } from 'next/server';
// import connectDB from './../../../lib/mongodb';
// import Enquiry from './../../../models/enquiry';
// import { verifyAdminToken } from './../../../middleware/adminAuth';
// /**
//  * @typedef {import('next/server').NextRequest} NextRequest
//  */

// export async function GET(req) {
//   const auth = req.headers.get('authorization');
//   const token = auth?.split(' ')[1];

//   const admin = verifyAdminToken(token);
//   if (!admin) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   await connectDB();

//   const enquiries = await Enquiry.find().sort({ createdAt: -1 });

//   return NextResponse.json({ success: true, enquiries });
// }

import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { verifyAdminToken } from './../../../middleware/adminAuth';

/**
 * @typedef {import('next/server').NextRequest} NextRequest
 */

export async function GET(req) {
  try {
    // 🔐 Auth check
    const auth = req.headers.get('authorization');
    const token = auth?.split(' ')[1];

    const admin = verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 📦 Fetch enquiries (latest first)
    const [enquiries] = await pool.query(
      `SELECT * FROM enquiries ORDER BY created_at DESC`
    );

    return NextResponse.json({
      success: true,
      enquiries
    });

  } catch (error) {
    console.error('Fetch enquiries error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}