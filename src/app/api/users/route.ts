import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { API_MESSAGES, HTTP_STATUS } from '@/lib/constants';

const prisma = new PrismaClient();

// GET /api/users - Get all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: API_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    const { email, password, name, roleId } = await request.json();

    if (!email || !password || !roleId) {
      return NextResponse.json(
        { message: API_MESSAGES.VALIDATION_ERROR },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: API_MESSAGES.DUPLICATE_ENTRY },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        roleId,
      },
      include: {
        role: true,
      },
    });

    return NextResponse.json(
      { message: API_MESSAGES.CREATED, user },
      { status: HTTP_STATUS.CREATED }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: API_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
} 