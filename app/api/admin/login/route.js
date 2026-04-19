import pool from '@/app/lib/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/**
 * @typedef {import('next/server').NextRequest} NextRequest
 */

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

function stripWrappingBrackets(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/^\[(.*)\]$/, '$1').trim();
}

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const normalizedUsername = stripWrappingBrackets(username);
    const normalizedPassword = typeof password === 'string' ? password.trim() : '';

    if (!normalizedUsername || !normalizedPassword) {
      return Response.json(
        { success: false, error: 'Username and password required' },
        { status: 400 }
      );
    }

    // Support legacy rows that were saved with surrounding square brackets.
    const [rows] = await pool.query(
      `SELECT * FROM admins WHERE username = ? OR username = ?`,
      [normalizedUsername, `[${normalizedUsername}]`]
    );

    if (rows.length === 0) {
      return Response.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const admin = rows[0];
    const storedPassword = stripWrappingBrackets(admin.password);
    const isMatch = await bcrypt.compare(normalizedPassword, storedPassword);

    if (!isMatch) {
      return Response.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: admin.id, username: stripWrappingBrackets(admin.username) },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    return Response.json(
      { success: true, token },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
