import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/sessions";

export async function GET() {
  try {
    // گرفتن کوکی
    const cookieStore = await cookies();
    const token = cookieStore.get("rasmastoken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "توکن موجود نیست" },
        { status: 401 }
      );
    }

    // دی‌کریپت توکن و گرفتن payload
    const payload = await decrypt(token);

    if (!payload || !payload.id) {
      return NextResponse.json(
        { success: false, message: "توکن نامعتبر است" },
        { status: 401 }
      );
    }

    // پیدا کردن سبد خرید کاربر
    const cart = await prisma.cart.findUnique({
      where: { userId: +payload.id },
      include: {
        items: { include: { product: true }, orderBy: { id: "asc" } },
      },
    });

    // اگر سبد خرید پیدا نشد
    if (!cart) {
      return NextResponse.json(
        { success: false, message: "سبد خرید برای کاربر یافت نشد" },
        { status: 404 }
      );
    }

    // پاسخ موفق
    return NextResponse.json(
      {
        success: true,
        message: "عملیات با موفقیت انجام شد",
        data: cart,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

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

    // گرفتن body
    const body = await req.json();
    const { productId, quantity } = body;

    if (!productId || !quantity) {
      return NextResponse.json(
        { success: false, message: "productId و quantity لازم است" },
        { status: 400 }
      );
    }

    // بررسی موجودی محصول
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return NextResponse.json(
        { success: false, message: "محصول موجود نیست" },
        { status: 404 }
      );
    }

    if (quantity > product.stock) {
      return NextResponse.json(
        {
          success: false,
          message: `تعداد سفارش بیشتر از موجودی محصول است (${product.stock})`,
        },
        { status: 400 }
      );
    }

    // پیدا کردن کارت موجود
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      // ایجاد کارت جدید اگر وجود ندارد
      cart = await prisma.cart.create({
        data: {
          userId,
          items: { create: { productId, quantity } },
        },
        include: { items: { include: { product: true } } },
      });
    } else {
      // بررسی اینکه آیتم قبلاً موجود است یا نه
      const existingItem = cart.items.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        // مقدار quantity همان مقداری که فرستاده شده ثبت می‌شود (overwrite)
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity },
        });
      } else {
        // ایجاد آیتم جدید
        await prisma.cartItem.create({
          data: { cartId: cart.id, productId, quantity },
        });
      }

      // دوباره گرفتن کارت کامل همراه با product
      cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: { product: true },
            orderBy: { id: "asc" },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "محصول با موفقیت به سبد خرید اضافه شد",
      data: cart,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/remove
export async function DELETE(req: NextRequest) {
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

    // گرفتن body
    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "productId لازم است" },
        { status: 400 }
      );
    }

    // پیدا کردن کارت کاربر
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: "سبد خرید موجود نیست" },
        { status: 404 }
      );
    }

    // پیدا کردن آیتم مورد نظر
    const item = cart.items.find((i) => i.productId === productId);
    if (!item) {
      return NextResponse.json(
        { success: false, message: "محصول در سبد خرید موجود نیست" },
        { status: 404 }
      );
    }

    // حذف آیتم
    await prisma.cartItem.delete({
      where: { id: item.id },
    });

    // گرفتن کارت به‌روز شده
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { product: true }, orderBy: { id: "asc" } },
      },
    });

    return NextResponse.json({
      success: true,
      message: "محصول با موفقیت حذف شد",
      data: updatedCart,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
