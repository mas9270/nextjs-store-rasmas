import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // ایجاد پاسخ
  const response = NextResponse.json({ done: true });

  // حذف کوکی JWT
  response.cookies.set("rasmastoken", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}
