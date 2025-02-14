"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Calendar,
  Gift,
  Music,
  Book,
  Film,
  Gamepad,
  MapPin,
  Briefcase,
  GraduationCap,
  Cake,
  Eye,
} from "lucide-react"
import type React from "react"

// Enhanced mock data for demonstration
const mockMatches = {
  pareja: [
    {
      name: "María García",
      age: 28,
      location: "Ciudad de México",
      occupation: "Diseñadora Gráfica",
      education: "Licenciatura en Diseño",
      compatibility: 95,
      description: "Comparten muchos intereses y valores similares.",
      interests: ["Música", "Lectura", "Viajes"],
      lastActive: "Hace 2 horas",
      profileViews: 42,
      mutualFriends: 3,
      instagram: "@maria_garcia",
      whatsapp: "+52 1 55 1234 5678",
    },
    {
      name: "Carlos Rodríguez",
      age: 32,
      location: "Guadalajara",
      occupation: "Ingeniero de Software",
      education: "Maestría en Ciencias Computacionales",
      compatibility: 88,
      description: "Gran química y objetivos de vida alineados.",
      interests: ["Deportes", "Cocina", "Cine"],
      lastActive: "Hace 1 día",
      profileViews: 35,
      mutualFriends: 2,
      instagram: "@carlos_rod",
      whatsapp: "+52 1 33 9876 5432",
    },
    {
      name: "Ana Martínez",
      age: 30,
      location: "Monterrey",
      occupation: "Profesora de Yoga",
      education: "Certificación en Yoga y Meditación",
      compatibility: 82,
      description: "Personalidades complementarias y pasiones compartidas.",
      interests: ["Arte", "Yoga", "Fotografía"],
      lastActive: "Hace 3 horas",
      profileViews: 38,
      mutualFriends: 1,
      instagram: "@ana_yoga",
      whatsapp: "+52 1 81 2468 1357",
    },
  ],
  amigos: [
    {
      name: "Javier López",
      compatibility: 91,
      description: "Intereses comunes y sentido del humor similar.",
      interests: ["Videojuegos", "Tecnología", "Deportes"],
    },
    {
      name: "Laura Sánchez",
      compatibility: 87,
      description: "Valores compartidos y actividades de ocio compatibles.",
      interests: ["Senderismo", "Cocina", "Voluntariado"],
    },
    {
      name: "Diego Fernández",
      compatibility: 79,
      description: "Buena comunicación y apoyo mutuo.",
      interests: ["Música", "Cine", "Viajes"],
    },
  ],
  casual: [
    {
      name: "Sofía Ruiz",
      compatibility: 93,
      description: "Atracción mutua y expectativas alineadas.",
      interests: ["Baile", "Fotografía", "Gastronomía"],
    },
    {
      name: "Alejandro Torres",
      compatibility: 85,
      description: "Química instantánea e intereses compartidos.",
      interests: ["Deportes extremos", "Conciertos", "Viajes"],
    },
    {
      name: "Elena Navarro",
      compatibility: 78,
      description: "Estilos de vida compatibles y buena comunicación.",
      interests: ["Arte", "Yoga", "Lectura"],
    },
  ],
}

const userStats = {
  totalMatches: 42,
  profileViews: 156,
  upcomingDates: 2,
}

type MatchType = "pareja" | "amigos" | "casual"

const InterestIcon = ({ interest }: { interest: string }) => {
  switch (interest.toLowerCase()) {
    case "música":
      return <Music className="w-4 h-4" />
    case "lectura":
      return <Book className="w-4 h-4" />
    case "cine":
      return <Film className="w-4 h-4" />
    case "videojuegos":
      return <Gamepad className="w-4 h-4" />
    default:
      return null
  }
}

const MatchCard = ({ match, type }: { match: (typeof mockMatches.pareja)[0]; type: MatchType }) => (
  <Card className="mb-6">
    <CardHeader className="flex flex-row items-start gap-6">
      <Avatar className="w-24 h-24">
        <AvatarImage src={`https://api.dicebear.com/6.x/micah/svg?seed=${match.name}`} />
        <AvatarFallback>
          {match.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <CardTitle className="text-2xl mb-2">{match.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Cake className="w-4 h-4" /> {match.age} años
        </CardDescription>
        <CardDescription className="flex items-center gap-2">
          <MapPin className="w-4 h-4" /> {match.location}
        </CardDescription>
        <CardDescription className="flex items-center gap-2">
          <Briefcase className="w-4 h-4" /> {match.occupation}
        </CardDescription>
        <CardDescription className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4" /> {match.education}
        </CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Compatibilidad</span>
          <span className="text-sm font-medium">{match.compatibility}%</span>
        </div>
        <Progress value={match.compatibility} className="h-2" />
      </div>
      <p className="text-base text-gray-600 mb-4">{match.description}</p>
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Intereses</h4>
        <div className="flex flex-wrap gap-2">
          {match.interests.map((interest, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              <InterestIcon interest={interest} />
              {interest}
            </Badge>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium">Última actividad</p>
          <p className="text-sm text-gray-600">{match.lastActive}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Vistas al perfil</p>
          <p className="text-sm text-gray-600">{match.profileViews}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Amigos en común</p>
          <p className="text-sm text-gray-600">{match.mutualFriends}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Tipo de match</p>
          <p className="text-sm text-gray-600 capitalize">{type}</p>
        </div>
      </div>
      <div className="flex justify-between">
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
          {match.instagram}
        </Button>
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          Conectar
        </Button>
      </div>
    </CardContent>
  </Card>
)

const StatCard = ({ icon, title, value }: { icon: React.ReactNode; title: string; value: number | string }) => (
  <Card>
    <CardContent className="flex items-center p-6">
      <div className="text-4xl text-primary mr-4">{icon}</div>
      <div>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </div>
    </CardContent>
  </Card>
)

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<MatchType>("pareja")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Tus Matches de Robocupido 2025</h1>

      <div className="grid gap-6 mb-8 md:grid-cols-3">
        <StatCard icon={<Heart />} title="Total de Matches" value={userStats.totalMatches} />
        <StatCard icon={<Eye />} title="Vistas a tu perfil" value={userStats.profileViews} />
        <StatCard icon={<Calendar />} title="Citas Próximas" value={userStats.upcomingDates} />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Consejo del Día</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            "La clave para una conexión genuina es la autenticidad. Sé tú mismo y deja que tu personalidad brille en
            cada interacción."
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="pareja" className="w-full" onValueChange={(value) => setActiveTab(value as MatchType)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="pareja">Pareja</TabsTrigger>
          <TabsTrigger value="amigos">Amigos</TabsTrigger>
          <TabsTrigger value="casual">Casual</TabsTrigger>
        </TabsList>
        {(["pareja", "amigos", "casual"] as const).map((type) => (
          <TabsContent key={type} value={type}>
            <div className="grid gap-8 md:grid-cols-2">
              {mockMatches[type].map((match, index) => (
                <MatchCard key={index} match={match} type={type} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Próximos Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Speed Dating Virtual - 15 de Febrero, 19:00</span>
            </li>
            <li className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-primary" />
              <span>Taller: Cómo Sorprender a tu Pareja - 20 de Febrero, 18:00</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

    