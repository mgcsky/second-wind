import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/roles - Get all roles
export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching roles" },
      { status: 500 }
    );
  }
}

// POST /api/roles - Create a new role
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, permissions } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const role = await prisma.role.create({
      data: {
        name,
        description,
        permissions: permissions
          ? {
              create: permissions.map((permissionId: string) => ({
                permission: {
                  connect: { id: permissionId },
                },
              })),
            }
          : undefined,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return NextResponse.json(role, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Role name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Error creating role" },
      { status: 500 }
    );
  }
} 