import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';
import { AUTH_MESSAGES } from '@/lib/constants';

const prisma = new PrismaClient();

// POST /api/auth/login - Login a user
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: AUTH_MESSAGES.EMAIL_PASSWORD_REQUIRED },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: AUTH_MESSAGES.INVALID_CREDENTIALS },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: AUTH_MESSAGES.INVALID_CREDENTIALS },
        { status: 401 }
      );
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      roleId: user.roleId,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: AUTH_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
} 