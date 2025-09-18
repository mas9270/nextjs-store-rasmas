import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdOrUnauthorized } from "@/lib/sessions";

// GET /api/orders/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // گرفتن شناسه کاربر از توکن
    const { userId, error } = await getUserIdOrUnauthorized();
    if (error) return error;

    const orderId = Number(params.id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, message: "شناسه سفارش نامعتبر است" },
        { status: 400 }
      );
    }

    // گرفتن سفارش
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "سفارش یافت نشد" },
        { status: 404 }
      );
    }

    // بررسی مالکیت سفارش
    if (order.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "دسترسی به این سفارش مجاز نیست" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "سفارش با موفقیت دریافت شد",
      data: order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
