import nodemailer from 'nodemailer';
/**
 * @typedef {import('next/server').NextRequest} NextRequest
 */

export async function POST(req) {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const careerTitle = formData.get('careerTitle');
    const coverLetter = formData.get('coverLetter') || 'N/A';

    // Get the resume file (optional: attach to email)
    const resume = formData.get('resume'); // File object

    // ✅ Configure transporter using your SMTP env variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // use TLS if true, port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Prepare email
    const mailOptions = {
      from: `"WaveNxD Careers" <${process.env.SMTP_USER}>`,
      to: ['info@wavenxd.com', process.env.SMTP_USER].join(','),
      subject: `New Application for ${careerTitle}`,
      text: `
Full Name: ${fullName}
Email: ${email}
Phone: ${phone}
Position: ${careerTitle}
Cover Letter: ${coverLetter}
      `,
      attachments: resume
        ? [
            {
              filename: resume.name,
              content: Buffer.from(await resume.arrayBuffer()),
            },
          ]
        : [],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Email send error:', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
