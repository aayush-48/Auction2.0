import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Middleware executed: " ,request.nextUrl.pathname);

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/leaderboard",
    "/calculator"  
  ] // Apply to all routes
};
