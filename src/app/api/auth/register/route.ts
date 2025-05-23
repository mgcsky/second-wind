import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';
import { AUTH_MESSAGES } from '@/lib/constants';

const prisma = new PrismaClient();

// POST /api/auth/register - Register a new user
export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: AUTH_MESSAGES.EMAIL_PASSWORD_REQUIRED },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: AUTH_MESSAGES.USER_EXISTS },
        { status: 400 }
      );
    }

    // Get default role (you should have a default role in your database)
    const defaultRole = await prisma.role.findFirst({
      where: { name: 'USER' },
    });

    if (!defaultRole) {
      return NextResponse.json(
        { message: AUTH_MESSAGES.DEFAULT_ROLE_NOT_FOUND },
        { status: 500 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId: defaultRole.id,
      },
      include: {
        role: true,
      },
    });

    // Generate token
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: AUTH_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
} 