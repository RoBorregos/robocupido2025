'use client'
import { Dashboard } from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOut } from "next-auth/react"

// import { redirect } from "next/navigation";

export default function DashboardPage() {
  
  // redirect("/");
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-100 to-red-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold text-primary"
          >
            <span>Robocupido 2025</span>
          </Link>
          <nav>
            <Button onClick={() => signOut()} variant="outline">
             Cerrar Sesión
            </Button>
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
          </div>
        </div>
      </footer>
    </div>
  );
}
