import { auth } from "@/auth";
import { NextResponse } from "next/server";

const protectedRoutes = ["/track", "/course", "/user"];

function isRouteProtected(pathname: string) {
  return protectedRoutes.some(
    (protectedRoute) =>
      pathname === protectedRoute || pathname.startsWith(`${protectedRoute}/`),
  );
}

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const user = req.auth?.user;

  console.log("[middleware]", { pathname, auth: req.auth });

  // redirect if already logged in
  if (user && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/user", req.nextUrl.origin));
  }

  // redirect if not logged in
  if (!user && isRouteProtected(pathname)) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.png).*)"],
};
