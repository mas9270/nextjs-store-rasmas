import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// دریافت همه دسته‌بندی‌ها
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// ایجاد دسته‌بندی جدید
export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data.name) {
      return NextResponse.json(
        { message: "نام دسته‌بندی الزامی است" },
        { status: 400 }
      );
    }
    const category = await prisma.category.create({ data });
    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// ویرایش دسته‌بندی
export async function PUT(req: Request) {
  try {
    const { id, name } = await req.json();
    if (!id || !name) {
      return NextResponse.json(
        { message: "شناسه و نام الزامی است" },
        { status: 400 }
      );
    }

    const updated = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// حذف دسته‌بندی
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { message: "شناسه الزامی است" },
        { status: 400 }
      );
    }

    // قبل از حذف، بررسی می‌کنیم که محصولی به این دسته متصل نباشد
    const productCount = await prisma.product.count({
      where: { categoryId: Number(id) },
    });
    if (productCount > 0) {
      return NextResponse.json(
        { message: "این دسته‌بندی شامل محصول است و نمی‌توان آن را حذف کرد" },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "دسته‌بندی حذف شد" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
