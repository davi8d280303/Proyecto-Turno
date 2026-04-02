import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Rutas públicas — no necesitan sesión
  const publicas = ['/', '/login', '/registro'];
  if (publicas.includes(pathname)) return NextResponse.next();

  // En producción real leerías una cookie/JWT aquí.
  // Por ahora dejamos pasar y el layout de cada rol
  // verifica el localStorage en el cliente.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/super-admin/:path*',
    '/admin/:path*',
    '/usuario/:path*',
  ],
};