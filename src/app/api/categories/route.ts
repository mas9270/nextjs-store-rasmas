import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdOrUnauthorized } from "@/lib/sessions";

// دریافت همه دسته‌بندی‌ها
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      message: "لیست دسته‌بندی‌ها دریافت شد",
      data: categories,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ایجاد دسته‌بندی جدید
export async function POST(req: Request) {
  try {
    const { error } = await getUserIdOrUnauthorized();
    if (error) return error;

    const data = await req.json();
    if (!data.name) {
      return NextResponse.json(
        { success: false, message: "نام دسته‌بندی الزامی است" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({ data });

    return NextResponse.json({
      success: true,
      message: "دسته‌بندی با موفقیت ایجاد شد",
      data: category,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ویرایش دسته‌بندی
export async function PUT(req: Request) {
  try {
    const { error } = await getUserIdOrUnauthorized();
    if (error) return error;

    const { id, name } = await req.json();
    if (!id || !name) {
      return NextResponse.json(
        { success: false, message: "شناسه و نام الزامی است" },
        { status: 400 }
      );
    }

    const updated = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });

    return NextResponse.json({
      success: true,
      message: "دسته‌بندی بروزرسانی شد",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// حذف دسته‌بندی
export async function DELETE(req: Request) {
  try {
    const { error } = await getUserIdOrUnauthorized();
    if (error) return error;

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { success: false, message: "شناسه الزامی است" },
        { status: 400 }
      );
    }

    // بررسی محصول‌های مرتبط
    const productCount = await prisma.product.count({
      where: { categoryId: Number(id) },
    });
    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "این دسته‌بندی شامل محصول است و نمی‌توان آن را حذف کرد",
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id: Number(id) } });

    return NextResponse.json({
      success: true,
      message: "دسته‌بندی حذف شد",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
