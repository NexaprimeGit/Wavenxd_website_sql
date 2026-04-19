import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getIndustries() {
  try {
    // Use absolute URL with environment variable
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3001';
    
    const res = await fetch(`${baseUrl}/api/admin/industries`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Failed to fetch industries: ${res.status} ${errorData?.message || ''}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('getIndustries error:', error);
    throw error;
  }
}

export default async function IndustriesPage() {
  const industries = await getIndustries();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-green-600 mb-6">
        Select Industry
      </h1>

      <ul className="space-y-4">
        {industries.map((ind) => (
          <li
            key={ind.id}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >
            <Link href={`/admin-7f4b9c/industries/${ind.slug}/applications`}>
              <h2 className="text-lg font-semibold text-green-700">
                {ind.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{ind.tagline}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
