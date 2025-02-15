"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Music,
  Book,
  Film,
  Gamepad,
  // MapPin,
  // Briefcase,
  // GraduationCap,
  Cake,
} from "lucide-react";
import type React from "react";

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
};

type MatchType = "pareja" | "amigos" | "casual";

const InterestIcon = ({ interest }: { interest: string }) => {
  switch (interest.toLowerCase()) {
    case "música":
      return <Music className="w-4 h-4" />;
    case "lectura":
      return <Book className="w-4 h-4" />;
    case "cine":
      return <Film className="w-4 h-4" />;
    case "videojuegos":
      return <Gamepad className="w-4 h-4" />;
    default:
      return null;
  }
};

const MatchCard = ({
  match,
  type,
}: {
  match: Partial<(typeof mockMatches.pareja)[0]>;
  type: MatchType;
}) => (
  <Card className="mb-6">
    <CardHeader className="flex flex-row items-start gap-6">
      <Avatar className="w-24 h-24">
        <AvatarImage
          src={`https://api.dicebear.com/6.x/micah/svg?seed=${match.name}`}
        />
        <AvatarFallback>
          {match.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <CardTitle className="text-2xl mb-2">{match.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Cake className="w-4 h-4" /> {match.age} años
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
          {match.interests?.map((interest, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1"
            >
              <InterestIcon interest={interest} />
              {interest}
            </Badge>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
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
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            height={10}
            focusable={false}
            // {...props}
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M22 16.92v3a2 2 0 0 1-2.18 2a19.79 19.79 0 0 1-8.63-3.07a19.5 19.5 0 0 1-6-6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72a12.84 12.84 0 0 0 .7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45a12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92"
            />
          </svg>
          {match.whatsapp}
        </Button>
      </div>
    </CardContent>
  </Card>
);

// const StatCard = ({
//   icon,
//   title,
//   value,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   value: number | string;
// }) => (
//   <Card>
//     <CardContent className="flex items-center p-6">
//       <div className="text-4xl text-primary mr-4">{icon}</div>
//       <div>
//         <CardDescription>{title}</CardDescription>
//         <CardTitle className="text-2xl">{value}</CardTitle>
//       </div>
//     </CardContent>
//   </Card>
// );

export function Dashboard() {
  // const [activeTab, setActiveTab] = useState<MatchType>("pareja")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Tus Matches de Robocupido 2025
      </h1>

      <Tabs defaultValue="pareja" className="w-full">
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
    </div>
  );
}
