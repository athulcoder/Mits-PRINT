import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

/**
 * POST /api/admin/login
 * Validates admin credentials against the Admin database model
 * and sets the authorization cookies for the admin panel.
 */
export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email: String(email).trim().toLowerCase() },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials.' },
        { status: 401 }
      );
    }

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, admin.hashedPassword);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials.' },
        { status: 401 }
      );
    }

    const adminSecret = process.env.ADMIN_ROUTE_URL_SECRET || 'mitsadminsecret2026';

    const response = NextResponse.json({
      success: true,
      message: 'Admin login successful!',
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
      },
    });

    // Set authorization cookie for all /admin and /api/admin routes
    response.cookies.set('admin_route_secret', adminSecret, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Set admin session cookie
    response.cookies.set('admin_session', admin.id, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Error during admin login:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during login.' },
      { status: 500 }
    );
  }
}
