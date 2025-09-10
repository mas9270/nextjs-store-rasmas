import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // بررسی یکتا بودن ایمیل
    const existingEmail = await prisma.user.findFirst({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "ایمیل تکراری است" },
        { status: 400 }
      );
    }

    // هش کردن رمز عبور
    const hashedPassword = await bcrypt.hash(password, 10);

    // ایجاد کاربر جدید
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER", // پیش‌فرض مدل Prisma
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "ثبت ‌نام با موفقیت انجام شد",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { success: false, message: "خطایی در سرور رخ داد" },
      { status: 500 }
    );
  }
}
