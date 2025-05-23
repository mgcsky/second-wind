import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/items/[id] - Get a specific item
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.item.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        gallery: true,
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching item" },
      { status: 500 }
    );
  }
}

// PUT /api/items/[id] - Update an item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, price, stock, categoryId, gallery } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (categoryId !== undefined) updateData.categoryId = categoryId;

    // Handle gallery update if provided
    if (gallery !== undefined) {
      // First, delete all existing gallery items
      await prisma.gallery.deleteMany({
        where: { itemId: params.id },
      });

      // Then create new gallery items
      updateData.gallery = {
        create: gallery.map((imageUrl: string) => ({
          imageUrl,
        })),
      };
    }

    const item = await prisma.item.update({
      where: { id: params.id },
      data: updateData,
      include: {
        category: true,
        gallery: true,
      },
    });

    return NextResponse.json(item);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }
    if (error?.code === "P2003") {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Error updating item" },
      { status: 500 }
    );
  }
}

// DELETE /api/items/[id] - Delete an item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // First delete all gallery items
    await prisma.gallery.deleteMany({
      where: { itemId: params.id },
    });

    // Then delete the item
    await prisma.item.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Item deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Error deleting item" },
      { status: 500 }
    );
  }
} 