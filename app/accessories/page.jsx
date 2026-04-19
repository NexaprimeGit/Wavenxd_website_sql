// import pool from '../lib/db';
// import AccessoriesClient from './AccessoriesClient';

// export default async function AccessoriesPage() {
//   const [rows] = await pool.query(
//     'SELECT * FROM accessories WHERE is_active = 1'
//   );

//   const accessories = rows.map((row) => ({
//     ...row,
//     _id: String(row.id),
//     isActive: Boolean(row.is_active),
//   }));

//   if (!accessories.length) {
//     return <p className="p-10 text-center">No accessories available</p>;
//   }

//   return <AccessoriesClient accessories={accessories} />;
// }

import pool from "../lib/db";
import AccessoriesClient from "./AccessoriesClient";

export default async function AccessoriesPage() {
  let accessories = [];
  let error = null;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM accessories WHERE is_active = 1",
    );
    accessories = rows.map((row) => ({
      ...row,
      _id: String(row.id),
      isActive: Boolean(row.is_active),
    }));
  } catch (err) {
    console.error("AccessoriesPage DB error:", err);
    error = err;
  }

  if (error) {
    return (
      <main className="p-6">
        <h1 className="text-3xl md:text-4xl mb-8 text-green-600 font-bold text-center">
          Our Accesories
        </h1>
        <p className="p-10 text-center text-red-600">
          Failed to load accessories. Check database connection.
        </p>
      </main>
    );
  }

  if (!accessories.length) {
    return (
      <main className="p-6">
        <h1 className="text-3xl md:text-4xl mb-8 text-green-600 font-bold text-center">
          Our Accesories
        </h1>
        <p className="p-10 text-center">No accessories available</p>
      </main>
    );
  }

  return <AccessoriesClient accessories={accessories} />;
}
