import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "./lib/sessions";

// مسیرهای عمومی (وقتی کاربر لاگین نیست)
const publicAuthRoutes = ["/login", "/register", "/reset-password"];

// مسیرهای خصوصی (وقتی کاربر لاگین هست)
const privateRoutes = ["/profile", "/panel-admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // دریافت توکن از کوکی
  const token = request.cookies.get("rasmastoken")?.value;
  const valid = token ? await decrypt(token) : null;

  // --- کاربر لاگین کرده ---
  if (valid) {
    // جلوگیری از دسترسی به صفحات عمومی
    if (publicAuthRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }

    // مسیر panel-admin فقط برای ADMIN
    if (pathname.startsWith("/panel-admin") && valid.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  }

  // --- کاربر لاگین نکرده ---
  if (!valid) {
    // مسیرهای خصوصی فقط برای کاربر لاگین شده
    if (privateRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|images).*)"], // API، _next و images از middleware رد می‌شوند
};
