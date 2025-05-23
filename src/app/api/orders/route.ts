import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/orders - Get all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: {
          include: {
            user: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, items, status, totalAmount } = body;

    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Customer ID and items are required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        customerId,
        status: status || "PENDING",
        totalAmount: totalAmount || 0,
        items: {
          create: items.map((item: any) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        customer: {
          include: {
            user: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2003") {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Error creating order" },
      { status: 500 }
    );
  }
} 