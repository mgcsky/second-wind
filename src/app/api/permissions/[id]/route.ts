import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/permissions/[id] - Get a specific permission
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const permission = await prisma.permission.findUnique({
      where: { id: params.id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!permission) {
      return NextResponse.json(
        { error: "Permission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(permission);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching permission" },
      { status: 500 }
    );
  }
}

// PUT /api/permissions/[id] - Update a permission
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    const permission = await prisma.permission.update({
      where: { id: params.id },
      data: updateData,
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    return NextResponse.json(permission);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Permission not found" },
        { status: 404 }
      );
    }
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Permission name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Error updating permission" },
      { status: 500 }
    );
  }
}

// DELETE /api/permissions/[id] - Delete a permission
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.permission.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Permission deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Permission not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Error deleting permission" },
      { status: 500 }
    );
  }
} 