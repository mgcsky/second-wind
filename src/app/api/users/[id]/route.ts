import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { API_MESSAGES, HTTP_STATUS, AUTH_MESSAGES } from "@/lib/constants";

const prisma = new PrismaClient();

// GET /api/users/[id] - Get a specific user
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: API_MESSAGES.NOT_FOUND },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: AUTH_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// PUT /api/users/[id] - Update a user
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { email, name, roleId } = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: API_MESSAGES.NOT_FOUND },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        email,
        name,
        roleId,
      },
      include: {
        role: true,
      },
    });

    return NextResponse.json(
      { message: API_MESSAGES.UPDATED, user },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: AUTH_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// DELETE /api/users/[id] - Delete a user
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: API_MESSAGES.NOT_FOUND },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: API_MESSAGES.DELETED },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: AUTH_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
} 