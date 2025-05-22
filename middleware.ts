import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Obtener la ruta actual
  const { pathname } = request.nextUrl

  // Si la ruta es /projects/new, redirigir a /projects/create
  if (pathname === "/projects/new") {
    return NextResponse.redirect(new URL("/projects/create", request.url))
  }

  // Para cualquier otra ruta, continuar normalmente
  return NextResponse.next()
}

// Configurar las rutas en las que se ejecutará el middleware
export const config = {
  matcher: ["/projects/new"],
}
