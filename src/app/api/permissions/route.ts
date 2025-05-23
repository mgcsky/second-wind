import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/permissions - Get all permissions
export async function GET() {
  try {
    const permissions = await prisma.permission.findMany({
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
    return NextResponse.json(permissions);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching permissions" },
      { status: 500 }
    );
  }
}

// POST /api/permissions - Create a new permission
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const permission = await prisma.permission.create({
      data: {
        name,
        description,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    return NextResponse.json(permission, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Permission name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Error creating permission" },
      { status: 500 }
    );
  }
} 