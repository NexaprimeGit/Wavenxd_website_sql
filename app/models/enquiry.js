import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema(
  {
    // GENERAL INFORMATION
    organizationName: String,
    organizationWebsite: String,
    gstNumber: String,
    address: String,
    organizationType: String,
    quotationNumber: String,
    spocName: String,
    spocEmail: String,
    spocPhone: String,

    // APPLICATION INFORMATION
    purpose: String,
    nozzleFrequency: String,
    nozzleTip: String,
    flowRate: String,
    viscosity: String,
    solvent: String,
    solute: String,
    solutionPercentage: String,
    suspendedParticles: String,
    particleSize: String,
    applicationNature: String,
    substrateType: String,
    operatingTemperature: String,
    storageTemperature: String,
    airShapingRequired: String,

    // DESIRED OUTCOME
    avgParticleSize: String,
    particleYield: String,
    coatingThickness: String,
    coatingUniformity: String,
    coatAdherence: String,

    // ADDITIONAL NOTES
    supportRequired: String,
  },
  { timestamps: true },
);

// Prevent model overwrite error in Next.js
export default mongoose.models.Enquiry ||
  mongoose.model('Enquiry', EnquirySchema);
