// // app/models/Career.js
// import mongoose from 'mongoose';

// const careerSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     location: { type: String, required: true },
//     experience: String, // for jobs
//     duration: String, // for internships
//     description: String,

//     responsibilities: [String],
//     eligibility: [String],
//     skills: [String],
//     benefits: [String],

//     isOpen: { type: Boolean, default: true },
//     type: { type: String, enum: ['job', 'internship'], default: 'job' },
//   },
//   { timestamps: true },
// );

// export default mongoose.models.Career || mongoose.model('Career', careerSchema);
