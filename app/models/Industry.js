// import mongoose from 'mongoose';

// const TechnicalPaperSchema = new mongoose.Schema(
//   {
//     title: String,
//     link: String,
//   },
//   { _id: false },
// );

// const ApplicationSchema = new mongoose.Schema(
//   {
//     title: String,
//     slug: String,
//     description: String,
//     image: String,
//     technicalPapers: [TechnicalPaperSchema],
//   },
//   { _id: false },
// );

// const IndustrySchema = new mongoose.Schema(
//   {
//     name: String,
//     slug: { type: String, unique: true },
//     applications: [ApplicationSchema],
//     isActive: { type: Boolean, default: true },
//   },
//   { timestamps: true },
// );

// export default mongoose.models.Industry ||
//   mongoose.model('Industry', IndustrySchema);
