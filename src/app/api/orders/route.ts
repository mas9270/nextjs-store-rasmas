import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/sessions";

// POST /api/orders/create
export async function POST(req: NextRequest) {
  try {
    // گرفتن توکن از کوکی
    const cookieStore = await cookies();
    const token = cookieStore.get("rasmastoken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "توکن موجود نیست" },
        { status: 401 }
      );
    }

    // دی‌کریپت توکن
    const payload = await decrypt(token);
    if (!payload || !payload.id) {
      return NextResponse.json(
        { success: false, message: "توکن نامعتبر است" },
        { status: 401 }
      );
    }

    const userId = +payload.id;

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
export async function GET(req: NextRequest) {
  try {
    // گرفتن توکن از کوکی
    const cookieStore = await cookies();
    const token = cookieStore.get("rasmastoken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "توکن موجود نیست" },
        { status: 401 }
      );
    }

    // دی‌کریپت توکن
    const payload = await decrypt(token);
    if (!payload || !payload.id) {
      return NextResponse.json(
        { success: false, message: "توکن نامعتبر است" },
        { status: 401 }
      );
    }

    const userId = +payload.id;

    // گرفتن سفارش‌های کاربر
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" }, // جدیدترین سفارش‌ها ابتدا
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
