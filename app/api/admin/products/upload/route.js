import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminToken } from '@/app/middleware/adminAuth';
/**
 * @typedef {import('next/server').NextRequest} NextRequest
 */

const getBearerToken = (req) => {
  const authorization =
    typeof req.headers?.get === 'function'
      ? req.headers.get('authorization')
      : undefined;
  if (typeof authorization !== 'string' || !authorization.startsWith('Bearer '))
    return null;
  return authorization.split(' ')[1];
};


export const POST = async (req) => {
  try {
    const token = getBearerToken(req);
    const admin = verifyAdminToken(token);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const file = formData.get('image');

    if (!file)
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 },
      );

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only JPG, JPEG, PNG allowed' },
        { status: 400 },
      );
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const timestamp = Date.now();
    const ext = file.type.split('/')[1];
    const filename = `product-${timestamp}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(arrayBuffer));

    return NextResponse.json({ success: true, path: `/uploads/${filename}` });
  } catch (err) {
    console.error('Upload Error:', err);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 },
    );
  }
};
