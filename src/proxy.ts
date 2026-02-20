import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const allowedRoles = new Set(["admin", "operator"]);

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isApiRoute = request.nextUrl.pathname.startsWith("/api/admin/");
  const role = typeof token?.role === "string" ? token.role : "";
  const authorized = Boolean(token?.email) && allowedRoles.has(role);

  if (authorized) {
    return NextResponse.next();
  }

  if (isApiRoute) {
    return NextResponse.json({ error: "Nepřihlášený uživatel" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/prihlaseni", request.url);
  loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/objednavky/:path*", "/api/admin/:path*"],
};
