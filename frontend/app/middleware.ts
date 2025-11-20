// app/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUser } from './firebase/config';  // Using the getUser function from config.ts

export async function middleware(req: NextRequest) {
  const user = await getUser();
  
  if (!user && req.nextUrl.pathname === '/') {
    // If the user is not logged in, redirect to the "main" page
    return NextResponse.redirect(new URL('/main', req.url));
  }

  if (user && req.nextUrl.pathname === '/') {
    // If the user is logged in, redirect to the "dashboard"
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // For other routes, just continue as normal
  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
