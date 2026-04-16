// import { NextResponse } from 'next/server';
// import connectDB from '@/app/lib/mongodb';
// import Product from '@/app/models/Product';
// /**
//  * @typedef {import('next/server').NextRequest} NextRequest
//  */

// export async function GET() {
//   try {
//     await connectDB();
//     const products = await Product.find({ isActive: true }).sort({
//       createdAt: -1,
//     });
//     return NextResponse.json(products);
//   } catch {
//     return NextResponse.json(
//       { message: 'Failed to fetch products' },
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
    const [products] = await pool.query(
      `SELECT * FROM products
       WHERE is_active = TRUE
       ORDER BY created_at DESC`
    );

    return NextResponse.json(products);

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}