import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { API_MESSAGES, HTTP_STATUS, AUTH_MESSAGES } from '@/lib/constants';

const prisma = new PrismaClient();

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        items: true,
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { message: AUTH_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: API_MESSAGES.VALIDATION_ERROR },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: API_MESSAGES.DUPLICATE_ENTRY },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const category = await prisma.category.create({
      data: { name },
      include: {
        items: true,
      },
    });

    return NextResponse.json(
      { message: API_MESSAGES.CREATED, category },
      { status: HTTP_STATUS.CREATED }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { message: AUTH_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
} 