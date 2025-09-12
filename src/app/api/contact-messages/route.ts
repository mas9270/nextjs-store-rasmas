import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// GET: دریافت همه پیام‌ها
export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST: ایجاد پیام جدید (ارسال پیام توسط کاربر)
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, subject, message } = data;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: "تمام فیلدها الزامی است" },
        { status: 400 }
      );
    }

    const newMessage = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    return NextResponse.json(newMessage);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT: بروزرسانی وضعیت دیده شدن پیام
export async function PUT(req: Request) {
  try {
    const { id, seen } = await req.json();
    if (!id) {
      return NextResponse.json(
        { message: "شناسه پیام الزامی است" },
        { status: 400 }
      );
    }

    const updated = await prisma.contactMessage.update({
      where: { id: Number(id) },
      data: { seen: Boolean(seen) },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE: حذف پیام
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { message: "شناسه پیام الزامی است" },
        { status: 400 }
      );
    }

    await prisma.contactMessage.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "پیام حذف شد" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST: ارسال پاسخ به ایمیل پیام
export async function PATCH(req: Request) {
  try {
    const { email, subject, replyMessage } = await req.json();
    if (!email || !subject || !replyMessage) {
      return NextResponse.json(
        { message: "تمام فیلدها الزامی است" },
        { status: 400 }
      );
    }

    // تنظیمات nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false, // true برای 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: subject,
      text: replyMessage,
    });

    return NextResponse.json({ message: "پاسخ ایمیل با موفقیت ارسال شد" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
