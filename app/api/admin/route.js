// import connectDB from '@/app/lib/mongodb';
// import Admin from '@/app/models/admin';
// /**
//  * @typedef {import('next/server').NextRequest} NextRequest
//  */


// export async function GET() {
//   try {
//     await connectDB();
//     const exists = await Admin.findOne();
//     return Response.json({ exists: !!exists }, { status: 200 });
//   } catch (error) {
//     console.error('Admin check error:', error);
//     return Response.json(
//       { exists: false, error: 'Failed to check admin' },
//       { status: 500 },
//     );
//   }
// }

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { username, password } = await req.json();

//     const exists = await Admin.findOne();
//     if (exists)
//       return Response.json(
//         { success: false, error: 'Admin already exists' },
//         { status: 400 },
//       );

//     // Hash password before saving
//     const bcrypt = require('bcryptjs');
//     const hashedPassword = await bcrypt.hash(password, 10);

//     await Admin.create({ username, password: hashedPassword });

//     return Response.json(
//       { success: true, message: 'Admin registered' },
//       { status: 201 },
//     );
//   } catch (error) {
//     console.error('Admin registration error:', error);
//     return Response.json(
//       { success: false, error: 'Registration failed' },
//       { status: 500 },
//     );
//   }
// }

// app/api/admin/route.js

import pool from '@/app/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT id FROM admins LIMIT 1');
    return Response.json({ exists: rows.length > 0 }, { status: 200 });
  } catch (error) {
    console.error('Admin check error:', error);
    return Response.json(
      { exists: false, error: 'Failed to check admin' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // Check if admin already exists
    const [rows] = await pool.query('SELECT id FROM admins LIMIT 1');
    if (rows.length > 0) {
      return Response.json(
        { success: false, error: 'Admin already exists' },
        { status: 400 }
      );
    }

    // Hash password — bcrypt works exactly the same ✅
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new admin
    await pool.query(
      'INSERT INTO admins (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    return Response.json(
      { success: true, message: 'Admin registered' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin registration error:', error);
    return Response.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}