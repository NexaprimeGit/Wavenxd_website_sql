// /**
//  * @typedef {import('next/server').NextRequest} NextRequest
//  */

// // app/api/enquiry/route.js
// import { NextResponse } from 'next/server';
// import connectDB from './../../lib/mongodb'; // your mongoose connection
// import Enquiry from './../../models/enquiry'; // your model
// import { sendEnquiryMail } from './../../lib/mailer';

// export async function POST(req) {
//   try {
//     const data = await req.json();

//     // 1️⃣ Connect to DB
//     await connectDB();

//     // 2️⃣ Save to MongoDB using Mongoose model
//     const enquiry = new Enquiry({
//       organizationName: data.organizationName,
//       organizationWebsite: data.organizationWebsite,
//       gstNumber: data.gstNumber,
//       address: data.address,
//       organizationType: data.organizationType,
//       quotationNumber: data.poNumber, // match your model field
//       spocName: data.spocName,
//       spocEmail: data.spocEmail,
//       spocPhone: data.spocPhone,

//       purpose: data.purpose,
//       nozzleFrequency: data.nozzleFrequency,
//       nozzleTip: data.nozzleTip,
//       flowRate: data.flowRate,
//       viscosity: data.viscosity,
//       solvent: data.solvent,
//       solute: data.solute,
//       solutionPercentage: data.solutionPercentage,
//       suspendedParticles: data.suspendedParticles,
//       particleSize: data.particleSize,
//       applicationNature: data.applicationNature,
//       substrateType: data.substrateType,
//       operatingTemperature: data.operatingTemperature,
//       storageTemperature: data.storageTemperature,
//       airShapingRequired: data.airShaping,

//       avgParticleSize: data.avgParticleSize,
//       particleYield: data.particleYield,
//       coatingThickness: data.coatingThickness,
//       coatingUniformity: data.coatingUniformity,
//       coatAdherence: data.coatAdherence,

//       supportRequired: data.supportRequired,
//     });

//     await enquiry.save();

//     // 3️⃣ Send email
//     await sendEnquiryMail(data);

//     // 4️⃣ Return success
//     return NextResponse.json({
//       success: true,
//       message: 'Enquiry submitted successfully!',
//       id: enquiry._id,
//     });
//   } catch (err) {
//     console.error('Error in /api/enquiry:', err);
//     return NextResponse.json(
//       { success: false, error: 'Failed to submit enquiry' },
//       { status: 500 },
//     );
//   }
// }


import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { sendEnquiryMail } from '@/app/lib/mailer';

/**
 * @typedef {import('next/server').NextRequest} NextRequest
 */

export async function POST(req) {
  try {
    const data = await req.json();

    // ✅ Insert into MySQL
    const [result] = await pool.query(
      `INSERT INTO enquiries (
        organization_name,
        organization_website,
        gst_number,
        address,
        organization_type,
        quotation_number,
        spoc_name,
        spoc_email,
        spoc_phone,
        purpose,
        nozzle_frequency,
        nozzle_tip,
        flow_rate,
        viscosity,
        solvent,
        solute,
        solution_percentage,
        suspended_particles,
        particle_size,
        application_nature,
        substrate_type,
        operating_temperature,
        storage_temperature,
        air_shaping_required,
        avg_particle_size,
        particle_yield,
        coating_thickness,
        coating_uniformity,
        coat_adherence,
        support_required
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.organizationName,
        data.organizationWebsite,
        data.gstNumber,
        data.address,
        data.organizationType,
        data.poNumber,
        data.spocName,
        data.spocEmail,
        data.spocPhone,
        data.purpose,
        data.nozzleFrequency,
        data.nozzleTip,
        data.flowRate,
        data.viscosity,
        data.solvent,
        data.solute,
        data.solutionPercentage,
        data.suspendedParticles,
        data.particleSize,
        data.applicationNature,
        data.substrateType,
        data.operatingTemperature,
        data.storageTemperature,
        data.airShaping,
        data.avgParticleSize,
        data.particleYield,
        data.coatingThickness,
        data.coatingUniformity,
        data.coatAdherence,
        data.supportRequired,
      ]
    );

    const enquiryId = result.insertId;

    // 📧 Send email (same as before)
    await sendEnquiryMail(data);

    return NextResponse.json({
      success: true,
      message: 'Enquiry submitted successfully!',
      id: enquiryId,
    });

  } catch (err) {
    console.error('Error in /api/enquiry:', err);

    return NextResponse.json(
      { success: false, error: 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}