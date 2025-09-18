import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdOrUnauthorized } from "@/lib/sessions";

// POST /api/orders/create
export async function POST(req: NextRequest) {
  try {
    const { userId, error } = await getUserIdOrUnauthorized();
    if (error) return error;

    // گرفتن سبد خرید کاربر
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "سبد خرید خالی است" },
        { status: 400 }
      );
    }

    // محاسبه مبلغ کل
    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // ایجاد سفارش
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    // خالی کردن سبد خرید
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return NextResponse.json({
      success: true,
      message: "سفارش با موفقیت ثبت شد",
      data: order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// GET /api/orders
export async function GET() {
  try {
    const { userId, error } = await getUserIdOrUnauthorized();
    if (error) return error;

    // گرفتن سفارش‌های کاربر
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      message: "سفارش‌ها با موفقیت دریافت شدند",
      data: orders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
