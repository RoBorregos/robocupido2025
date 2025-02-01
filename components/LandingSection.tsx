import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LandingSection() {
  return (
    <section className="text-center py-24 md:py-32 lg:py-48">
      <Heart className="w-24 h-24 text-red-500 mx-auto mb-8 animate-heartbeat" />
      <h1 className="text-5xl md:text-6xl font-bold text-red-600 mb-6">Robocupido 2025</h1>
      <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-2xl mx-auto">
        Find your perfect match for Valentine's Day! Our AI-powered matchmaking system will pair you with your ideal
        partner. Register now and get matched on February 14th.
      </p>
      <Link href="/register">
        <Button size="lg" className="text-lg px-8 py-6">
          Register Now
        </Button>
      </Link>
    </section>
  )
}

