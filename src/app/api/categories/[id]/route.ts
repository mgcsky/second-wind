import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { API_MESSAGES, HTTP_STATUS, AUTH_MESSAGES } from '@/lib/constants';

const prisma = new PrismaClient();

// GET /api/categories/[id] - Get a specific category
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        items: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: API_MESSAGES.NOT_FOUND },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { message: AUTH_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: API_MESSAGES.VALIDATION_ERROR },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { message: API_MESSAGES.NOT_FOUND },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: { name },
      include: {
        items: true,
      },
    });

    return NextResponse.json(
      { message: API_MESSAGES.UPDATED, category },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { message: AUTH_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { message: API_MESSAGES.NOT_FOUND },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: API_MESSAGES.DELETED },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { message: AUTH_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
} 