// import connectDB from '@/app/lib/mongodb';
// import Admin from '@/app/models/admin';
// /**
//  * @typedef {import('next/server').NextRequest} NextRequest
//  */


// export async function POST(req) {
//   try {
//     await connectDB();
//     const { username, password } = await req.json();

//     const exists = await Admin.findOne({ username });
//     if (exists)
//       return Response.json(
//         { success: false, error: 'Admin already exists' },
//         { status: 400 },
//       );

//     await Admin.create({ username, password });

//     return Response.json(
//       { success: true, message: 'Admin registered' },
//       { status: 201 },
//     );
//   } catch (error) {
//     console.error(error);
//     return Response.json(
//       { success: false, error: 'Registration failed' },
//       { status: 500 },
//     );
//   }
// }

// SQL

import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

/**
 * @typedef {import('next/server').NextRequest} NextRequest
 */

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return Response.json(
        { success: false, error: 'Username and password required' },
        { status: 400 }
      );
    }

    // 🔍 Check if admin exists
    const [rows] = await pool.query(
      `SELECT id FROM admins WHERE username = ?`,
      [username]
    );

    if (rows.length > 0) {
      return Response.json(
        { success: false, error: 'Admin already exists' },
        { status: 400 }
      );
    }

    // 🔐 Hash password (IMPORTANT)
    const hashedPassword = await bcrypt.hash(password, 10);

    // ➕ Insert admin
    await pool.query(
      `INSERT INTO admins (username, password)
       VALUES (?, ?)`,
      [username, hashedPassword]
    );

    return Response.json(
      { success: true, message: 'Admin registered' },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}