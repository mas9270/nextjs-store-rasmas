import { NextResponse } from "next/server";
import { encrypt } from "@/lib/sessions"; // نسخه jose
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "ایمیل یافت نشد" },
        { status: 404 }
      );
    }

    // بررسی رمز عبور
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: "کلمه عبور اشتباه است" },
        { status: 404 }
      );
    }

    // تولید توکن با jose
    const accessToken = await encrypt({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "ورود موفقیت‌آمیز بود",
        accessToken, // اختیاری: اگه نمی‌خوای مستقیم بدی، فقط کوکی ست کن
      },
      { status: 200 }
    );

    // تنظیم کوکی با مقدار string واقعی
    response.cookies.set({
      name: "rasmastoken",
      value: accessToken,
      httpOnly: true,
      maxAge: 60 * 60, // 1 ساعت
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "خطایی در سرور رخ داد" },
      { status: 500 }
    );
  }
}
