// /**
//  * @typedef {import('next/server').NextRequest} NextRequest
//  */

// // app/api/accessories/route.js
// import { NextResponse } from 'next/server';
// import connectDB from '@/app/lib/mongodb';
// import Accessory from './../../models/Acessory';

// export async function GET() {
//   await connectDB();
//   const accessories = await Accessory.find({ isActive: true });
//   return NextResponse.json(accessories);
// }

// app/api/accessories/route.js
import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET() {
  try {
    // Fetch all active accessories
    const [accessories] = await pool.query(
      'SELECT * FROM accessories WHERE is_active = 1'
    );

    // For each accessory, fetch its specifications
    const accessoriesWithSpecs = await Promise.all(
      accessories.map(async (accessory) => {
        const [specs] = await pool.query(
          'SELECT label, value FROM accessory_specifications WHERE accessory_id = ?',
          [accessory.id]
        );
        return {
          ...accessory,
          specifications: specs,
        };
      })
    );

    return NextResponse.json(accessoriesWithSpecs);
  } catch (error) {
    console.error('Error fetching accessories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accessories' },
      { status: 500 }
    );
  }
}