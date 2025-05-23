import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/customers - Get all customers
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching customers" },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create a new customer
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, phone, address, dateOfBirth } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        userId,
        phone,
        address,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "User already has a customer profile" },
        { status: 400 }
      );
    }
    if (error?.code === "P2003") {
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Error creating customer" },
      { status: 500 }
    );
  }
} 