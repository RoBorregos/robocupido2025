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
  import { useRouter } from "next/navigation";
  import {
    Music,
    Book,
    Film,
    Gamepad,
    // MapPin,
    // Briefcase,
    // GraduationCap,
    Cake,
    Loader2,
  } from "lucide-react";
  import type React from "react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getMatches } from "@/app/actions";

  // Enhanced mock data for demonstration
  const mockMatches = {
    pareja: [
      {
        name: "María García",
        age: 28,
        compatibility: 95,
        interests: ["Música", "Lectura", "Viajes"],
        instagram: "@maria_garcia",
        whatsapp: "+52 1 55 1234 5678",
      },
      {
      name: "María García",
      age: 28,
      compatibility: 95,
      interests: ["Música", "Lectura", "Viajes"],
      instagram: "@maria_garcia",
      whatsapp: "+52 1 55 1234 5678",
      },
      {
        name: "María García",
        age: 28,
        compatibility: 95,
        interests: ["Música", "Lectura", "Viajes"],
        instagram: "@maria_garcia",
        whatsapp: "+52 1 55 1234 5678",
      },
    ],
    amigos: [
      {
        name: "María García",
        age: 28,
        compatibility: 95,
        interests: ["Música", "Lectura", "Viajes"],
        instagram: "@maria_garcia",
        whatsapp: "+52 1 55 1234 5678",
      },
      {
        name: "María García",
        age: 28,
        compatibility: 95,
        interests: ["Música", "Lectura", "Viajes"],
        instagram: "@maria_garcia",
        whatsapp: "+52 1 55 1234 5678",
      },
      {
        name: "María García",
        age: 28,
        compatibility: 95,
        interests: ["Música", "Lectura", "Viajes"],
        instagram: "@maria_garcia",
        whatsapp: "+52 1 55 1234 5678",
      },
    ],
    casual: [
    ],
  };

  type MatchType = "pareja" | "amigos" | "casual";

  const InterestIcon = ({ interest }: { interest: string }) => {
    switch (interest.toLowerCase()) {
      case "musica":
        return <Music className="w-4 h-4" />;
      case "leer":
        return <Book className="w-4 h-4" />;
      case "deportes":
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

  export function Dashboard() {
   const router = useRouter()
   const { data: session, status } = useSession()
   const [user_id, setUserId] = useState(null)
    useEffect(() => {
        async function checkuserid() {
          if (session?.user?.email) {
            try {
              const response = await fetch(`/api/profile/check?email=${session.user.email}`)
              const data = await response.json()
              setUserId(data.profileId)
              const user_id = data.profileId
              if (user_id) {
                const matches = await getMatches(user_id);
                console.log(matches)
              }
            } catch (error) {
              console.error("Error checking userid:", error)
            }
          }
        }
        
        checkuserid()
      }, [session])

      
    if (status === "loading") {
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </CardContent>
          </Card>
        )
      }
    if (status === "unauthenticated") {
        router.push("/login")
        return null
      }
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
