import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdOrUnauthorized } from "@/lib/sessions";

// GET /api/cart
export async function GET() {
  try {
    const { userId, error } = await getUserIdOrUnauthorized();
    if (error) return error;

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
    const { userId, error } = await getUserIdOrUnauthorized();
    if (error) return error;

    const { productId, quantity } = await req.json();
    if (!productId || typeof quantity !== "number")
      return NextResponse.json(
        { success: false, message: "productId و quantity لازم است" },
        { status: 400 }
      );

    // بررسی محصول
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product)
      return NextResponse.json(
        { success: false, message: "محصول موجود نیست" },
        { status: 404 }
      );

    // گرفتن یا ساختن سبد خرید
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      const initialQty = quantity === 0 ? 1 : quantity;
      if (initialQty > product.stock) {
        return NextResponse.json(
          {
            success: false,
            message: `تعداد سفارش بیشتر از موجودی (${product.stock})`,
          },
          { status: 400 }
        );
      }

      cart = await prisma.cart.create({
        data: {
          userId,
          items: { create: { productId, quantity: initialQty } },
        },
        include: { items: { include: { product: true } } },
      });
    } else {
      const existingItem = cart.items.find((i) => i.productId === productId);

      if (existingItem) {
        const newQty = quantity === 0 ? existingItem.quantity + 1 : quantity;

        if (newQty > product.stock) {
          return NextResponse.json(
            {
              success: false,
              message: `تعداد سفارش بیشتر از موجودی (${product.stock})`,
            },
            { status: 400 }
          );
        }

        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQty },
        });
      } else {
        const newQty = quantity === 0 ? 1 : quantity;

        if (newQty > product.stock) {
          return NextResponse.json(
            {
              success: false,
              message: `تعداد سفارش بیشتر از موجودی (${product.stock})`,
            },
            { status: 400 }
          );
        }

        await prisma.cartItem.create({
          data: { cartId: cart.id, productId, quantity: newQty },
        });
      }

      cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: { include: { product: true }, orderBy: { id: "asc" } },
        },
      });
    }

    // notifyCartUpdate(userId, cart);

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
    const { userId, error } = await getUserIdOrUnauthorized();
    if (error) return error;

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

    // notifyCartUpdate(userId, updatedCart);

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
