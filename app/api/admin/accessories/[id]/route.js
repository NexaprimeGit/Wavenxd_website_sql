// import connectDB from '@/app/lib/mongodb';
// import Accessory from './../../../../models/Acessory';
// /**
//  * @typedef {import('next/server').NextRequest} NextRequest
//  */

// const ensureObject = (value) =>
//   typeof value === 'object' && value !== null ? value : {};

// export async function GET(req, context) {
//   try {
//     await connectDB();
//     const { id } = await context.params;

//     const accessory = await Accessory.findById(id).lean();
//     if (!accessory) {
//       return Response.json({ error: 'Accessory not found' }, { status: 404 });
//     }

//     return Response.json(accessory);
//   } catch (err) {
//     return Response.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function PUT(req, context) {
//   try {
//     await connectDB();
//     const { id } = await context.params;
//     const rawBody = await req.json();
//     const body = ensureObject(rawBody);

//     const updated = await Accessory.findByIdAndUpdate(id, body, {
//       new: true,
//     }).lean();

//     if (!updated) {
//       return Response.json({ error: 'Accessory not found' }, { status: 404 });
//     }

//     return Response.json({ success: true, data: updated });
//   } catch (err) {
//     return Response.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function DELETE(req, context) {
//   try {
//     await connectDB();
//     const { id } = await context.params;

//     const deleted = await Accessory.findByIdAndDelete(id);
//     if (!deleted) {
//       return Response.json({ error: 'Accessory not found' }, { status: 404 });
//     }

//     return Response.json({ success: true });
//   } catch (err) {
//     return Response.json({ error: err.message }, { status: 500 });
//   }
// }

// app/api/accessories/[id]/route.js
import pool from '@/app/lib/db';

export async function GET(req, context) {
  try {
    const { id } = await context.params;

    // Fetch accessory by id
    const [rows] = await pool.query(
      'SELECT * FROM accessories WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return Response.json({ error: 'Accessory not found' }, { status: 404 });
    }

    const accessory = rows[0];

    // Fetch its specifications
    const [specs] = await pool.query(
      'SELECT label, value FROM accessory_specifications WHERE accessory_id = ?',
      [id]
    );

    return Response.json({ ...accessory, specifications: specs });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    // Check accessory exists
    const [rows] = await pool.query(
      'SELECT id FROM accessories WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      return Response.json({ error: 'Accessory not found' }, { status: 404 });
    }

    const {
      title,
      slug,
      image,
      description,
      price,
      is_active,
      specifications,
    } = body;

    // Update main accessory row
    await pool.query(
      `UPDATE accessories 
       SET title = ?, slug = ?, image = ?, description = ?, price = ?, is_active = ?
       WHERE id = ?`,
      [title, slug, image, description, price, is_active ?? 1, id]
    );

    // If specifications provided, replace them
    if (Array.isArray(specifications)) {
      // Delete old specs
      await pool.query(
        'DELETE FROM accessory_specifications WHERE accessory_id = ?',
        [id]
      );

      // Insert new specs
      if (specifications.length > 0) {
        const specValues = specifications.map((s) => [id, s.label, s.value]);
        await pool.query(
          'INSERT INTO accessory_specifications (accessory_id, label, value) VALUES ?',
          [specValues]
        );
      }
    }

        // Return updated accessory with specs
        const [updatedRows] = await pool.query(
          'SELECT * FROM accessories WHERE id = ?',
          [id]
        );
    
        const [updatedSpecs] = await pool.query(
          'SELECT label, value FROM accessory_specifications WHERE accessory_id = ?',
          [id]
        );
    
        return Response.json({
          success: true,
          data: { ...updatedRows[0], specifications: updatedSpecs },
        });
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    }
    
    export async function DELETE(req, context) {
      try {
        const { id } = await context.params;
    
        const [rows] = await pool.query(
          'SELECT id FROM accessories WHERE id = ?',
          [id]
        );
        if (rows.length === 0) {
          return Response.json({ error: 'Accessory not found' }, { status: 404 });
        }
    
        // Delete specifications first
        await pool.query(
          'DELETE FROM accessory_specifications WHERE accessory_id = ?',
          [id]
        );
    
        // Delete accessory
        await pool.query('DELETE FROM accessories WHERE id = ?', [id]);
    
        return Response.json({ success: true });
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    }