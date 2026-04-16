// import connectDB from '@/app/lib/mongodb';
// import Accessory from './../../../models/Acessory';
// /**
//  * @typedef {import('next/server').NextRequest} NextRequest
//  */

// const ensureObject = (value) =>
//   typeof value === 'object' && value !== null ? value : {};

// export async function GET() {
//   try {
//     await connectDB();
//     const accessories = await Accessory.find({}).sort({ createdAt: -1 }).lean(); // 🔴 IMPORTANT

//     return Response.json(accessories);
//   } catch (err) {
//     return Response.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   try {
//     await connectDB();
//     const rawBody = await req.json();
//     const body = ensureObject(rawBody);

//     const accessory = await Accessory.create(body);

//     return Response.json({
//       success: true,
//       data: accessory.toObject(), // 🔴 convert to plain object
//     });
//   } catch (err) {
//     return Response.json({ error: err.message }, { status: 500 });
//   }
// }


// app/api/admin/accessories/route.js
import pool from '@/app/lib/db';

export async function GET() {
  try {
    // Fetch all accessories sorted by newest first
    const [accessories] = await pool.query(
      'SELECT * FROM accessories ORDER BY created_at DESC'
    );

    // Fetch specs for each accessory
    const accessoriesWithSpecs = await Promise.all(
      accessories.map(async (accessory) => {
        const [specs] = await pool.query(
          'SELECT label, value FROM accessory_specifications WHERE accessory_id = ?',
          [accessory.id]
        );
        return { ...accessory, specifications: specs };
      })
    );

    return Response.json(accessoriesWithSpecs);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      title,
      slug,
      image,
      description,
      price,
      is_active,
      specifications,
    } = body;

    // Insert main accessory row
    const [result] = await pool.query(
      `INSERT INTO accessories (title, slug, image, description, price, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, slug, image, description, price, is_active ?? 1]
    );

    const newId = result.insertId;

    // Insert specifications if provided
    if (Array.isArray(specifications) && specifications.length > 0) {
      const specValues = specifications.map((s) => [newId, s.label, s.value]);
      await pool.query(
        'INSERT INTO accessory_specifications (accessory_id, label, value) VALUES ?',
        [specValues]
      );
    }

    // Return the newly created accessory with specs
    const [newAccessory] = await pool.query(
      'SELECT * FROM accessories WHERE id = ?',
      [newId]
    );
    const [newSpecs] = await pool.query(
      'SELECT label, value FROM accessory_specifications WHERE accessory_id = ?',
      [newId]
    );

    return Response.json({
      success: true,
      data: { ...newAccessory[0], specifications: newSpecs },
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}