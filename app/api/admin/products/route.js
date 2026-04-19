// // app/api/admin/products/route.js
// import { NextResponse } from 'next/server';
// import connectDB from '@/app/lib/mongodb';
// import Product from '@/app/models/Product';
// import { verifyAdminToken } from '@/app/middleware/adminAuth';

// /**
//  * @typedef {import('next/server').NextRequest} NextRequest
//  * @typedef {import('next/server').NextResponse} NextResponse
//  */

// const getBearerToken = (req) => {
//   const authorization = req.headers.get('authorization');
//   if (typeof authorization !== 'string' || !authorization.startsWith('Bearer '))
//     return null;
//   return authorization.split(' ')[1];
// };

// const ensureObject = (value) =>
//   typeof value === 'object' && value !== null ? value : {};

// // POST: add new product
// export const POST = /** @param {NextRequest} req */ async (req) => {
//   try {
//     const token = getBearerToken(req);
//     const admin = verifyAdminToken(token);

//     if (!admin) {
//       return NextResponse.json(
//         { success: false, error: 'Unauthorized' },
//         { status: 401 },
//       );
//     }

//     const rawBody = await req.json();
//     const body = ensureObject(rawBody);

//     const {
//       slug,
//       title,
//       subtitle,
//       description,
//       image,
//       isActive = true,
//       documents = [],
//       specs = [],
//       details = [],
//       applications = {},
//     } = body;

//     if (!slug || !title || !subtitle || !description || !image) {
//       return NextResponse.json(
//         { success: false, error: 'Missing required fields' },
//         { status: 400 },
//       );
//     }

//     await connectDB();

//     const product = new Product({
//       slug,
//       title,
//       subtitle,
//       description,
//       image,
//       isActive,
//       documents,
//       specs,
//       details,
//       applications,
//     });

//     await product.save();

//     return NextResponse.json({ success: true, product });
//   } catch (err) {
//     console.error('Add Product Error:', err);

//     let errorMsg = 'Failed to add product';

//     if (
//       err &&
//       typeof err === 'object' &&
//       'code' in err &&
//       err.code === 11000 &&
//       'keyPattern' in err &&
//       err.keyPattern &&
//       'slug' in err.keyPattern
//     ) {
//       errorMsg = 'Slug must be unique';
//     }

//     return NextResponse.json(
//       { success: false, error: errorMsg },
//       { status: 500 },
//     );
//   }
// };

// // GET: fetch all products
// export const GET = /** @param {NextRequest} req */ async (req) => {
//   try {
//     const token = getBearerToken(req);
//     const admin = verifyAdminToken(token);

//     if (!admin) {
//       return NextResponse.json(
//         { success: false, error: 'Unauthorized' },
//         { status: 401 },
//       );
//     }

//     await connectDB();

//     const products = await Product.find().sort({ createdAt: -1 });

//     return NextResponse.json(products); // valid JSON
//   } catch (err) {
//     console.error('Fetch Products Error:', err);
//     return NextResponse.json(
//       { success: false, error: 'Failed to fetch products' },
//       { status: 500 },
//     );
//   }
// };
// // PUT: update product
// export const PUT = /** @param {NextRequest} req */ async (req, { params }) => {
//   try {
//     const { id } = params;
//     const token = getBearerToken(req);
//     const admin = verifyAdminToken(token);

//     if (!admin) {
//       return NextResponse.json(
//         { success: false, error: 'Unauthorized' },
//         { status: 401 },
//       );
//     }

//     const rawBody = await req.json();
//     const body = ensureObject(rawBody);
//     await connectDB();

//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       body,
//       { new: true }, // return the updated document
//     );

//     if (!updatedProduct) {
//       return NextResponse.json(
//         { success: false, error: 'Product not found' },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json({ success: true, product: updatedProduct });
//   } catch (err) {
//     console.error('Update Product Error:', err);
//     return NextResponse.json(
//       { success: false, error: 'Failed to update product' },
//       { status: 500 },
//     );
//   }
// };

// SQL

import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { verifyAdminToken } from '@/app/middleware/adminAuth';

const getBearerToken = (req) => {
  const authorization = req.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return null;
  return authorization.split(' ')[1];
};

export const POST = async (req) => {
  const conn = await pool.getConnection();

  try {
    const token = getBearerToken(req);
    const admin = verifyAdminToken(token);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      slug,
      title,
      subtitle,
      description,
      image,
      isActive = true,
      documents = [],
      specs = [],
      details = [],
      applications = {},
    } = body;

    if (!slug || !title || !subtitle || !description || !image) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await conn.beginTransaction();

    // 1️⃣ Insert product
    const [result] = await conn.query(
      `INSERT INTO products 
      (slug, title, subtitle, description, image, is_active)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [slug, title, subtitle, description, image, isActive]
    );

    const productId = result.insertId;

    // 2️⃣ Insert specs
    for (const s of specs) {
      await conn.query(
        `INSERT INTO product_specs (product_id, label, value)
         VALUES (?, ?, ?)`,
        [productId, s.label, s.value]
      );
    }

    // 3️⃣ Insert documents
    for (const d of documents) {
      await conn.query(
        `INSERT INTO product_documents (product_id, label, link)
         VALUES (?, ?, ?)`,
        [productId, d.label, d.link]
      );
    }

    // 4️⃣ Insert details
    for (const d of details) {
      await conn.query(
        `INSERT INTO product_details (product_id, label, value)
         VALUES (?, ?, ?)`,
        [productId, d.label, d.value]
      );
    }

    // 5️⃣ Insert applications (map → rows)
    for (const category in applications) {
      for (const value of applications[category]) {
        await conn.query(
          `INSERT INTO product_applications (product_id, category, value)
           VALUES (?, ?, ?)`,
          [productId, category, value]
        );
      }
    }

    await conn.commit();

    return NextResponse.json({ success: true, productId });

  } catch (err) {
    await conn.rollback();
    console.error('Add Product Error:', err);

    let errorMsg = 'Failed to add product';

    if (err.code === 'ER_DUP_ENTRY') {
      errorMsg = 'Slug must be unique';
    }

    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );

  } finally {
    conn.release();
  }
};

export const GET = async (req) => {
  try {
    const token = getBearerToken(req);
    const admin = verifyAdminToken(token);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const [products] = await pool.query(
      `SELECT * FROM products ORDER BY created_at DESC`
    );

    return NextResponse.json(products);

  } catch (err) {
    console.error('Fetch Products Error:', err);

    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
};

export const PUT = async (req, { params }) => {
  const conn = await pool.getConnection();

  try {
    const { id } = params;

    const token = getBearerToken(req);
    const admin = verifyAdminToken(token);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      slug,
      title,
      subtitle,
      description,
      image,
      isActive = true,
      documents = [],
      specs = [],
      details = [],
      applications = {},
    } = body;

    await conn.beginTransaction();

    // 1️⃣ Update main
    const [result] = await conn.query(
      `UPDATE products 
       SET slug=?, title=?, subtitle=?, description=?, image=?, is_active=?
       WHERE id=?`,
      [slug, title, subtitle, description, image, isActive, id]
    );

    if (result.affectedRows === 0) {
      await conn.rollback();
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // 2️⃣ Delete old relations
    await conn.query(`DELETE FROM product_specs WHERE product_id=?`, [id]);
    await conn.query(`DELETE FROM product_documents WHERE product_id=?`, [id]);
    await conn.query(`DELETE FROM product_details WHERE product_id=?`, [id]);
    await conn.query(`DELETE FROM product_applications WHERE product_id=?`, [id]);

    // 3️⃣ Reinsert
    for (const s of specs) {
      await conn.query(
        `INSERT INTO product_specs (product_id, label, value)
         VALUES (?, ?, ?)`,
        [id, s.label, s.value]
      );
    }

    for (const d of documents) {
      await conn.query(
        `INSERT INTO product_documents (product_id, label, link)
         VALUES (?, ?, ?)`,
        [id, d.label, d.link]
      );
    }

    for (const d of details) {
      await conn.query(
        `INSERT INTO product_details (product_id, label, value)
         VALUES (?, ?, ?)`,
        [id, d.label, d.value]
      );
    }

    for (const category in applications) {
      for (const value of applications[category]) {
        await conn.query(
          `INSERT INTO product_applications (product_id, category, value)
           VALUES (?, ?, ?)`,
          [id, category, value]
        );
      }
    }

    await conn.commit();

    return NextResponse.json({ success: true });

  } catch (err) {
    await conn.rollback();
    console.error('Update Product Error:', err);

    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );

  } finally {
    conn.release();
  }
};