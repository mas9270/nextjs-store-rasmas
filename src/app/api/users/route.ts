import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getUserIdOrUnauthorized } from "@/lib/sessions";

export async function GET() {
  try {
    const { error } = await getUserIdOrUnauthorized();
    if (error) return error;

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        orders: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "خطایی رخ داده است دوباره تلاش کنید",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "نام، ایمیل و پسوورد الزامی است" },
        { status: 400 }
      );
    }

    // بررسی تکراری بودن ایمیل
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "این ایمیل قبلا ثبت شده است" },
        { status: 400 }
      );
    }

    // هش کردن پسوورد
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json({ message: "کاربر با موفقیت ایجاد شد", user });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "خطایی رخ داد" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { error } = await getUserIdOrUnauthorized();
    if (error) return error;

    const body = await req.json();
    const { id, name, email, password } = body;

    if (!id || !name || !email) {
      return NextResponse.json(
        { error: "شناسه، نام و ایمیل الزامی است" },
        { status: 400 }
      );
    }

    // پیدا کردن کاربر برای ویرایش
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "کاربر پیدا نشد" }, { status: 404 });
    }

    // بررسی اینکه ایمیل تغییر کرده و تکراری نباشد
    if (email !== user.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return NextResponse.json(
          { error: "این ایمیل قبلا ثبت شده است" },
          { status: 400 }
        );
      }
    }

    let hashedPassword = user.password; // پیشفرض پسوورد قبلی

    if (password && password.trim().length > 0) {
      hashedPassword = await bcrypt.hash(password, 10); // اگر پسوورد وارد شد، تغییر بده
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: "کاربر با موفقیت ویرایش شد",
      updatedUser,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "خطایی رخ داد" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { error } = await getUserIdOrUnauthorized();
    if (error) return error;

    const body = await req.json();
    const { id } = body;

    const user = await prisma.user.findUnique({ where: { id: +id } });
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: +id } });

    return NextResponse.json(
      { message: "کاربر با موفقیت حذف شد" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "خطایی رخ داد" },
      { status: 500 }
    );
  }
}
