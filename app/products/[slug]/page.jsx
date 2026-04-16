import Image from 'next/image';
import Link from 'next/link';
import connectDB from '../../lib/mongodb';
import Product from '../../models/Product';
import RequestQuoteButton from '@/app/components/RequestQuoteButton';

export default async function ProductDetail({ params }) {
  // Fix: unwrap params
  params = await params;
  console.log('Params received:', params);

  // Connect to DB
  try {
    await connectDB();
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ DB connection failed:', err);
    return (
      <div className="p-10 text-center text-red-600 text-lg">
        Database connection failed
      </div>
    );
  }

  // Fetch product
  let product = null;
  try {
    product = await Product.findOne({
      slug: params.slug,
      isActive: true,
    }).lean();

    console.log('Product fetched from DB:', product);
  } catch (err) {
    console.error('❌ Error fetching product:', err);
  }

  if (!product) {
    return (
      <div className="p-10 text-center text-red-600 text-lg">
        Product not found
      </div>
    );
  }

  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-10 mb-14">
          <div className="bg-white rounded-xl shadow p-4 flex items-center justify-center">
            <div className="relative w-full max-w-[560px] aspect-[4/3]">
              <Image
                src={product.image}
                alt={product.title}
                fill
                priority
                className="object-contain rounded-lg"
              />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
            <p className="text-gray-600 mb-6">{product.subtitle}</p>

            {product.documents?.length > 0 && (
              <>
                <h3 className="font-semibold mb-3">Documents</h3>
                <div className="space-y-3 mb-8">
                  {product.documents.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.link}
                      target="_blank"
                      className="flex items-center justify-between border rounded-lg px-4 py-3 bg-white hover:bg-gray-100 transition"
                    >
                      <span>{doc.label}</span>
                      <span className="text-sm text-gray-500">PDF</span>
                    </a>
                  ))}
                </div>
              </>
            )}

            <h3 className="font-semibold mb-1">Pricing</h3>
            <Link
              href="/contact"
              className="text-green-700 font-medium hover:underline inline-block mb-6"
            >
              Contact Us for Pricing
            </Link>

            <RequestQuoteButton
              product={{
                title: product.title,
                slug: product.slug,
              }}
            />
          </div>
        </div>

        {/* ================= TABLES ================= */}
        <div className="grid md:grid-cols-2 gap-8 mb-14">
          {/* Specs Table */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">Key Specifications</h3>
            <div className="divide-y divide-gray-200">
              {product.specs?.map((item, i) => (
                <div key={i} className="flex justify-between py-3 text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Details Table */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">Product Details</h3>
            <div className="divide-y divide-gray-200">
              {product.details?.map((item, i) => (
                <div key={i} className="flex justify-between py-3 text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {product.applications && (
          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-8">Applications</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(product.applications).map(([title, items]) => (
                <div
                  key={title}
                  className="bg-white border-l-4 border-green-600 p-6 rounded-xl shadow-sm"
                >
                  <h4 className="font-semibold mb-4">{title}</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
