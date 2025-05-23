import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/roles/[id] - Get a specific role
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const role = await prisma.role.findUnique({
      where: { id: params.id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      return NextResponse.json(
        { error: "Role not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(role);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching role" },
      { status: 500 }
    );
  }
}

// PUT /api/roles/[id] - Update a role
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, permissions } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    // Handle permissions update
    if (permissions !== undefined) {
      // First, delete all existing permissions
      await prisma.rolePermission.deleteMany({
        where: { roleId: params.id },
      });

      // Then create new permissions
      updateData.permissions = {
        create: permissions.map((permissionId: string) => ({
          permission: {
            connect: { id: permissionId },
          },
        })),
      };
    }

    const role = await prisma.role.update({
      where: { id: params.id },
      data: updateData,
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return NextResponse.json(role);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Role not found" },
        { status: 404 }
      );
    }
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Role name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Error updating role" },
      { status: 500 }
    );
  }
}

// DELETE /api/roles/[id] - Delete a role
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.role.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Role deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Role not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Error deleting role" },
      { status: 500 }
    );
  }
} 