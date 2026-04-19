// import connectDB from '../../../lib/mongodb';
// import Product from '../../../models/Product';
// /**
//  * @typedef {import('next/server').NextRequest} NextRequest
//  */

// import { NextResponse } from 'next/server';

// export async function GET(req, { params }) {
//   try {
//     await connectDB();
//     const product = await Product.findOne({
//       slug: params.slug,
//       isActive: true,
//     });

//     if (!product) {
//       return NextResponse.json(
//         { message: 'Product not found' },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(product);
//   } catch {
//     return NextResponse.json(
//       { error: 'Failed to fetch product' },
//       { status: 500 },
//     );
//   }
// }

// SQL

import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

/**
 * @typedef {import('next/server').NextRequest} NextRequest
 */

export async function GET(req, { params }) {
  try {
    const { slug } = params;

    // 1️⃣ Get product
    const [products] = await pool.query(
      `SELECT * FROM products 
       WHERE slug = ? AND is_active = TRUE`,
      [slug]
    );

    if (products.length === 0) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    const product = products[0];

    // 2️⃣ Fetch related data
    const [specs] = await pool.query(
      `SELECT label, value FROM product_specs WHERE product_id = ?`,
      [product.id]
    );

    const [documents] = await pool.query(
      `SELECT label, link FROM product_documents WHERE product_id = ?`,
      [product.id]
    );

    const [details] = await pool.query(
      `SELECT label, value FROM product_details WHERE product_id = ?`,
      [product.id]
    );

    const [applications] = await pool.query(
      `SELECT category, value FROM product_applications WHERE product_id = ?`,
      [product.id]
    );

    // 3️⃣ Convert applications → map structure
    const appMap = {};
    for (const app of applications) {
      if (!appMap[app.category]) {
        appMap[app.category] = [];
      }
      appMap[app.category].push(app.value);
    }

    // 4️⃣ Final response (Mongo-like)
    return NextResponse.json({
      ...product,
      specs,
      documents,
      details,
      applications: appMap
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}