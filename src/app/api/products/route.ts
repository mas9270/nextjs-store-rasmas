// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, price, stock, categoryId } = body;

    if (!title || !description || !price || !stock || !categoryId) {
      return NextResponse.json(
        { message: "تمام فیلدها الزامی است" },
        { status: 400 }
      );
    }

    // ایجاد ۳ عکس رندوم از picsum.photos
    const randomImages = Array.from(
      { length: 3 },
      () =>
        `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/600/400`
    );

    // ذخیره محصول در دیتابیس
    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        price: Number(price),
        stock: Number(stock),
        categoryId: Number(categoryId),
        images: randomImages,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "خطا در ایجاد محصول", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...data } = await req.json();
    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.product.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "محصول حذف شد" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
