import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/orders/[id] - Get a specific order
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
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

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching order" },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update an order
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, totalAmount, items } = body;

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (totalAmount !== undefined) updateData.totalAmount = totalAmount;

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...updateData,
        ...(items && {
          items: {
            deleteMany: {},
            create: items.map((item: any) => ({
              itemId: item.itemId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        }),
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

    return NextResponse.json(order);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Error updating order" },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Delete an order
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.order.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Error deleting order" },
      { status: 500 }
    );
  }
} 