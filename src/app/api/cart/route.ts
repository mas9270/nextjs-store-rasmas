import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/sessions";
import { notifyCartUpdate } from "@/app/api/ws/route";

// تابع مشترک برای گرفتن userId از کوکی
async function getUserIdFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("rasmastoken")?.value;
  if (!token) return null;

  const payload = await decrypt(token);
  if (!payload || !payload.id) return null;

  return +payload.id;
}

// GET /api/cart
export async function GET() {
  try {
    const userId = await getUserIdFromToken();
    if (!userId)
      return NextResponse.json(
        { success: false, message: "توکن نامعتبر یا موجود نیست" },
        { status: 401 }
      );

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { product: true }, orderBy: { id: "asc" } },
      },
    });

    if (!cart)
      return NextResponse.json(
        { success: false, message: "سبد خرید یافت نشد" },
        { status: 404 }
      );

    return NextResponse.json({
      success: true,
      message: "سبد خرید دریافت شد",
      data: cart,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/cart
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken();
    if (!userId)
      return NextResponse.json(
        { success: false, message: "توکن نامعتبر یا موجود نیست" },
        { status: 401 }
      );

    const { productId, quantity } = await req.json();
    if (!productId || typeof quantity !== "number")
      return NextResponse.json(
        { success: false, message: "productId و quantity لازم است" },
        { status: 400 }
      );

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product)
      return NextResponse.json(
        { success: false, message: "محصول موجود نیست" },
        { status: 404 }
      );
    if (quantity > product.stock)
      return NextResponse.json(
        {
          success: false,
          message: `تعداد سفارش بیشتر از موجودی (${product.stock})`,
        },
        { status: 400 }
      );

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId, items: { create: { productId, quantity } } },
        include: { items: { include: { product: true } } },
      });
    } else {
      const existingItem = cart.items.find((i) => i.productId === productId);
      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: quantity !== 0 ? quantity : existingItem.quantity + 1,
          },
        });
      } else {
        await prisma.cartItem.create({
          data: { cartId: cart.id, productId, quantity },
        });
      }

      cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: { include: { product: true }, orderBy: { id: "asc" } },
        },
      });
    }

    notifyCartUpdate(userId, cart);

    return NextResponse.json({
      success: true,
      message: "سبد خرید با موفقیت بروزرسانی شد",
      data: cart,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/cart
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken();
    if (!userId)
      return NextResponse.json(
        { success: false, message: "توکن نامعتبر یا موجود نیست" },
        { status: 401 }
      );

    const { productId } = await req.json();
    if (!productId)
      return NextResponse.json(
        { success: false, message: "productId لازم است" },
        { status: 400 }
      );

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });
    if (!cart)
      return NextResponse.json(
        { success: false, message: "سبد خرید موجود نیست" },
        { status: 404 }
      );

    const item = cart.items.find((i) => i.productId === productId);
    if (!item)
      return NextResponse.json(
        { success: false, message: "محصول در سبد خرید موجود نیست" },
        { status: 404 }
      );

    await prisma.cartItem.delete({ where: { id: item.id } });

    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { product: true }, orderBy: { id: "asc" } },
      },
    });

    notifyCartUpdate(userId, updatedCart);

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
