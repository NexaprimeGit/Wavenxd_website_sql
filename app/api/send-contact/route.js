// import connectDB from './../../lib/mongodb';
// import nodemailer from 'nodemailer';
// import Contact from './../../models/Contact';
// /**
//  * @typedef {import('next/server').NextRequest} NextRequest
//  */

// export async function POST(req) {
//   try {
//     const { name, email, company, message, source } = await req.json();

//     // 1️⃣ Connect to DB
//     await connectDB();

//     // 2️⃣ Save contact to DB
//     await Contact.create({
//       name,
//       email,
//       company,
//       message,
//       source: source || 'website',
//     });

//     // 3️⃣ Send email
//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: Number(process.env.SMTP_PORT || 587),
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"WaveNxD Website" <${process.env.SMTP_USER}>`,
//       to: 'atharvapuagade83@gmail.com, info@wavenxd.com',
//       subject: 'New Contact Form Submission',
//       html: `
//         <h3>New Contact Form Submission</h3>
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Company:</strong> ${company}</p>
//         <p><strong>Message:</strong> ${message}</p>
//         <p><strong>Source:</strong> ${source || 'website'}</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     return new Response(
//       JSON.stringify({ message: 'Contact form submitted successfully' }),
//       { status: 200 },
//     );
//   } catch (err) {
//     console.error('Contact API Error:', err);
//     return new Response(
//       JSON.stringify({ message: 'Error submitting contact form' }),
//       { status: 500 },
//     );
//   }
// }


// SQL

import pool from '@/app/lib/db';
import nodemailer from 'nodemailer';

/**
 * @typedef {import('next/server').NextRequest} NextRequest
 */

export async function POST(req) {
  try {
    const { name, email, company, message, source } = await req.json();

    // ✅ Basic validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ message: 'Required fields missing' }),
        { status: 400 }
      );
    }

    // ✅ Insert into MySQL
    const [result] = await pool.query(
      `INSERT INTO contacts (name, email, company, message, source)
       VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        email,
        company || null,
        message,
        source || 'website'
      ]
    );

    const contactId = result.insertId;

    // ✅ Email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const sanitize = (str) =>
      String(str || '').replace(/\n/g, ' ').trim();

    const mailOptions = {
      from: `"WaveNxD Website" <${process.env.SMTP_USER}>`,
      to: ['atharvapuagade83@gmail.com', 'info@wavenxd.com'].join(','),
      subject: 'New Contact Form Submission',
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${sanitize(name)}</p>
        <p><strong>Email:</strong> ${sanitize(email)}</p>
        <p><strong>Company:</strong> ${sanitize(company)}</p>
        <p><strong>Message:</strong> ${sanitize(message)}</p>
        <p><strong>Source:</strong> ${sanitize(source || 'website')}</p>
      `,
    };

    // ✅ Send email (non-blocking safety)
    try {
      await transporter.sendMail(mailOptions);
    } catch (mailErr) {
      console.error('Email failed:', mailErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contact form submitted successfully',
        id: contactId
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error('Contact API Error:', err);

    return new Response(
      JSON.stringify({ message: 'Error submitting contact form' }),
      { status: 500 }
    );
  }
}