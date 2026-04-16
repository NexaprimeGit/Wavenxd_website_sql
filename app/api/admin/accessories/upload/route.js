import fs from 'fs/promises';
import path from 'path';
/**
 * @typedef {import('next/server').NextRequest} NextRequest
 */

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    await fs.writeFile(filepath, buffer);

    return Response.json({
      success: true,
      path: `/uploads/${filename}`, // ✅ STRING ONLY
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
