import { NextResponse } from 'next/server';

export async function POST(_req) {
  try {
    // Create a response that indicates successful logout
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    // Additional logout handling can be done here:
    // - Clear session cookies
    // - Invalidate tokens in database
    // - Log the logout event
    // For now, token removal is handled on the client side via localStorage

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}

