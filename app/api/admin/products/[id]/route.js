// import { NextResponse } from 'next/server';
// import connectDB from '@/app/lib/mongodb';
// import Product from '@/app/models/Product';
// import { verifyAdminToken } from '@/app/middleware/adminAuth';
// /**
//  * @typedef {import('next/server').NextRequest} NextRequest
//  */

// const getBearerToken = (req) => {
//   const authorization =
//     typeof req.headers?.get === 'function'
//       ? req.headers.get('authorization')
//       : undefined;
//   if (typeof authorization !== 'string' || !authorization.startsWith('Bearer '))
//     return null;
//   return authorization.split(' ')[1];
// };

// const ensureObject = (value) =>
//   typeof value === 'object' && value !== null ? value : {};

// // DELETE product
// export async function DELETE(req, context) {
//   const token = getBearerToken(req);
//   const admin = verifyAdminToken(token);

//   if (!admin) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   await connectDB();

//   // ✅ Unwrap params properly
//   const { id } = await context.params;

//   const deleted = await Product.findByIdAndDelete(id);
//   if (!deleted) {
//     return NextResponse.json(
//       { success: false, error: 'Product not found' },
//       { status: 404 },
//     );
//   }

//   return NextResponse.json({ success: true });
// }

// // PUT product (EDIT)
// export async function PUT(req, context) {
//   const token = getBearerToken(req);
//   const admin = verifyAdminToken(token);

//   if (!admin) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   await connectDB();

//   const { id } = await context.params;
//   const rawBody = await req.json();
//   const body = ensureObject(rawBody);

//   const updated = await Product.findByIdAndUpdate(id, body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!updated) {
//     return NextResponse.json(
//       { success: false, error: 'Product not found' },
//       { status: 404 },
//     );
//   }

//   return NextResponse.json({ success: true, product: updated });
// }

// // GET single product (for edit form)
// export async function GET(req, context) {
//   const token = getBearerToken(req);
//   const admin = verifyAdminToken(token);

//   if (!admin) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   await connectDB();

//   const { id } = await context.params;

//   const product = await Product.findById(id);
//   if (!product) {
//     return NextResponse.json({ error: 'Product not found' }, { status: 404 });
//   }

//   return NextResponse.json(product);
// }

// SQL

import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { verifyAdminToken } from '@/app/middleware/adminAuth';

const getBearerToken = (req) => {
  const authorization = req.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return null;
  return authorization.split(' ')[1];
};

export async function DELETE(req, context) {
  try {
    const token = getBearerToken(req);
    const admin = verifyAdminToken(token);

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = context.params;

    const [result] = await pool.query(
      `DELETE FROM products WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

export async function GET(req, context) {
  try {
    const token = getBearerToken(req);
    const admin = verifyAdminToken(token);

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = context.params;

    // 1️⃣ Product
    const [products] = await pool.query(
      `SELECT * FROM products WHERE id = ?`,
      [id]
    );

    if (products.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = products[0];

    // 2️⃣ Related data
    const [specs] = await pool.query(
      `SELECT id, label, value FROM product_specs WHERE product_id = ?`,
      [id]
    );

    const [documents] = await pool.query(
      `SELECT id, label, link FROM product_documents WHERE product_id = ?`,
      [id]
    );

    const [details] = await pool.query(
      `SELECT id, label, value FROM product_details WHERE product_id = ?`,
      [id]
    );

    const [applications] = await pool.query(
      `SELECT id, category, value FROM product_applications WHERE product_id = ?`,
      [id]
    );

    // 3️⃣ Convert applications (Map structure 🔥)
    const appMap = {};
    for (const app of applications) {
      if (!appMap[app.category]) {
        appMap[app.category] = [];
      }
      appMap[app.category].push(app.value);
    }

    return NextResponse.json({
      ...product,
      specs,
      documents,
      details,
      applications: appMap
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}

export async function PUT(req, context) {
  const conn = await pool.getConnection();

  try {
    const token = getBearerToken(req);
    const admin = verifyAdminToken(token);

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = context.params;
    const body = await req.json();

    const {
      slug,
      title,
      subtitle,
      description,
      image,
      is_active = true,
      specs = [],
      documents = [],
      details = [],
      applications = {}
    } = body;

    await conn.beginTransaction();

    // 1️⃣ Update main product
    const [result] = await conn.query(
      `UPDATE products 
       SET slug=?, title=?, subtitle=?, description=?, image=?, is_active=?
       WHERE id=?`,
      [slug, title, subtitle, description, image, is_active, id]
    );

    if (result.affectedRows === 0) {
      await conn.rollback();
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // 2️⃣ Clear old relations
    await conn.query(`DELETE FROM product_specs WHERE product_id=?`, [id]);
    await conn.query(`DELETE FROM product_documents WHERE product_id=?`, [id]);
    await conn.query(`DELETE FROM product_details WHERE product_id=?`, [id]);
    await conn.query(`DELETE FROM product_applications WHERE product_id=?`, [id]);

    // 3️⃣ Reinsert specs
    for (const spec of specs) {
      await conn.query(
        `INSERT INTO product_specs (product_id, label, value)
         VALUES (?, ?, ?)`,
        [id, spec.label, spec.value]
      );
    }

    // 4️⃣ Documents
    for (const doc of documents) {
      await conn.query(
        `INSERT INTO product_documents (product_id, label, link)
         VALUES (?, ?, ?)`,
        [id, doc.label, doc.link]
      );
    }

    // 5️⃣ Details
    for (const d of details) {
      await conn.query(
        `INSERT INTO product_details (product_id, label, value)
         VALUES (?, ?, ?)`,
        [id, d.label, d.value]
      );
    }

    // 6️⃣ Applications (Map → rows)
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
    console.error(err);

    return NextResponse.json(
      { error: 'Update failed' },
      { status: 500 }
    );

  } finally {
    conn.release();
  }
}