// pages/api/products/[id].ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = Number(params.id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { message: "شناسه محصول معتبر نیست" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ message: "محصول پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "عملیات با موفقیت انجام شد", data: product },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "خطا در دریافت محصول" },
      { status: 500 }
    );
  }
}
