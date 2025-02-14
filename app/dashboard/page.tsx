import { Dashboard } from "@/components/dashboard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-100 to-red-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Heart className="w-6 h-6" />
            <span>Robocupido 2025</span>
          </Link>
          <nav>
            <Button variant="ghost" asChild>
              <Link href="/profile">Mi Perfil</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/settings">Configuración</Link>
            </Button>
            <Button variant="outline">Cerrar Sesión</Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <Dashboard />
      </main>

      <footer className="bg-white mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>&copy; 2025 Robocupido. Todos los derechos reservados.</p>
          <div className="mt-2">
            <Link href="/privacy" className="text-sm hover:underline">
              Política de Privacidad
            </Link>
            {" | "}
            <Link href="/terms" className="text-sm hover:underline">
              Términos de Servicio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

