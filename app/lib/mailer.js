import nodemailer from 'nodemailer';

export const sendEnquiryMail = async (data) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true only for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color:#333;">
      <h2 style="color:#1f7a3f;">New Micro Spray Application Enquiry</h2>

      <h3>General Information</h3>
      <p><strong>Organization Name:</strong> ${data.organizationName}</p>
      <p><strong>Website:</strong> ${data.organizationWebsite}</p>
      <p><strong>GST No:</strong> ${data.gstNumber || 'N/A'}</p>
      <p><strong>Address:</strong> ${data.address}</p>
      <p><strong>Organization Type:</strong> ${data.organizationType}</p>
      <p><strong>PO / Quotation No:</strong> ${data.poNumber || 'N/A'}</p>

      <h3>Point of Contact (SPoC)</h3>
      <p><strong>Name:</strong> ${data.spocName}</p>
      <p><strong>Email:</strong> ${data.spocEmail}</p>
      <p><strong>Phone:</strong> ${data.spocPhone}</p>

      <h3>Application Specific Information</h3>
      <p><strong>Purpose:</strong> ${data.purpose}</p>
      <p><strong>Nozzle Frequency:</strong> ${data.nozzleFrequency}</p>
      <p><strong>Nozzle Tip:</strong> ${data.nozzleTip}</p>
      <p><strong>Flow Rate (ml/min):</strong> ${data.flowRate}</p>
      <p><strong>Viscosity (Cps):</strong> ${data.viscosity}</p>
      <p><strong>Solvent:</strong> ${data.solvent}</p>
      <p><strong>Solute:</strong> ${data.solute}</p>
      <p><strong>Solution Percentage:</strong> ${data.solutionPercentage}</p>
      <p><strong>Suspended Particles:</strong> ${data.suspendedParticles}</p>
      <p><strong>Particle Size:</strong> ${data.particleSize}</p>
      <p><strong>Nature of Application:</strong> ${data.applicationNature}</p>
      <p><strong>Substrate Type:</strong> ${data.substrateType}</p>
      <p><strong>Operating Temperature:</strong> ${data.operatingTemperature}</p>
      <p><strong>Nozzle Storage Temperature:</strong> ${data.storageTemperature}</p>
      <p><strong>Air Shaping Required:</strong> ${data.airShaping}</p>

      <h3>Desired Outcome</h3>
      <p><strong>Average Particle Size:</strong> ${data.avgParticleSize}</p>
      <p><strong>Particle Yield:</strong> ${data.particleYield}</p>
      <p><strong>Coating Thickness:</strong> ${data.coatingThickness}</p>
      <p><strong>Coating Uniformity:</strong> ${data.coatingUniformity}</p>
      <p><strong>Coat Adherence:</strong> ${data.coatAdherence}</p>

      <h3>Additional Support</h3>
      <p>${data.supportRequired || 'N/A'}</p>

      <hr/>
      <p style="font-size:12px;color:#666;">
        Submitted from WaveNxd website enquiry form
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"WaveNxd Enquiry" <${process.env.SMTP_USER}>`,
    to: ['info@wavenxd.com', 'atharvapugade83@gmail.com'],
    subject: 'New Micro Spray Application Enquiry – WaveNxd',
    html,
  });
};
