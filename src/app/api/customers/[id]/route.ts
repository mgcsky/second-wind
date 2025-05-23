import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/customers/[id] - Get a specific customer
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching customer" },
      { status: 500 }
    );
  }
}

// PUT /api/customers/[id] - Update a customer
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { phone, address, dateOfBirth } = body;

    const updateData: any = {};
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (dateOfBirth !== undefined) {
      updateData.dateOfBirth = new Date(dateOfBirth);
    }

    const customer = await prisma.customer.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(customer);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Error updating customer" },
      { status: 500 }
    );
  }
}

// DELETE /api/customers/[id] - Delete a customer
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.customer.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Customer deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Error deleting customer" },
      { status: 500 }
    );
  }
} 