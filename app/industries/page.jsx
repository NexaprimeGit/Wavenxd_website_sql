import IndustriesClient from './IndustriesClient';
import connectDB from './../lib/mongodb';
import Industry from './../models/Industry';

async function getIndustries() {
  await connectDB();

  const industries = await Industry.find({}).lean();

  // Convert _id to string for client
  const cleanIndustries = industries.map((ind) => ({
    ...ind,
    _id: ind._id.toString(),
    updatedAt: ind.updatedAt?.toISOString(), // optional, convert Dates
    createdAt: ind.createdAt?.toISOString(),
  }));

  return cleanIndustries;
}

export default async function IndustriesPage() {
  const industries = await getIndustries();

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <IndustriesClient industries={industries} />
    </section>
  );
}
