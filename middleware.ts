import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Jika sudah login lalu buka /login → redirect ke /home
  if (request.nextUrl.pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Jika user belum login, halaman yang harus dilindungi bisa dicek di sini:
  const protectedRoutes = ["/home", "/dashboard"];
  if (protectedRoutes.includes(request.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/home", "/dashboard"],
};
