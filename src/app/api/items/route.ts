import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/items - Get all items
export async function GET() {
  try {
    const items = await prisma.item.findMany({
      include: {
        category: true,
        gallery: true,
      },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching items" },
      { status: 500 }
    );
  }
}

// POST /api/items - Create a new item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, categoryId, gallery } = body;

    // Validate required fields
    if (!name || !price || !stock || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const item = await prisma.item.create({
      data: {
        name,
        description,
        price,
        stock,
        categoryId,
        gallery: gallery
          ? {
              create: gallery.map((imageUrl: string) => ({
                imageUrl,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        gallery: true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2003") {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Error creating item" },
      { status: 500 }
    );
  }
} 