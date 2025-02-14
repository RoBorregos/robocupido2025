"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { registerUser } from "@/app/actions"
import { Loader2 } from "lucide-react"

export default function RegistrationForm() {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [showDetailedQuestions, setShowDetailedQuestions] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  // Check if user has already submitted form
  useEffect(() => {
    async function checkSubmissionStatus() {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/profile/check?email=${session.user.email}`)
          const data = await response.json()
          setHasSubmitted(data.hasSubmitted)
        } catch (error) {
          console.error("Error checking submission status:", error)
        }
      }
    }
    
    checkSubmissionStatus()
  }, [session])

  async function handleSubmit(formData: FormData) {
    try {
      setIsSubmitting(true)
      setMessage("")

      // Auto-fill email and name from session
      if (session?.user?.email) {
        formData.set("email", session.user.email)
      }
      if (session?.user?.name) {
        formData.set("fullName", session.user.name)
      }

      const result = await registerUser(formData)
      
      if (result.success) {
        setMessage(result.message)
        setHasSubmitted(true)
        router.refresh()
      } else {
        setMessage(result.message)
      }
    } catch {
      setMessage("Ocurrió un error. Por favor intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

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

  // Show already submitted message
  if (hasSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">¡Ya has enviado tu formulario!</h2>
            <p className="text-gray-600 mb-6">
              Tu registro ya está completo. Inicia sesion con tu cuenta el 15 de febrero para descubrir tus matchs!
            </p>
            <div className="flex flex-col gap-4 items-center">
              <Link href="/">
                <Button variant="outline">Volver al Inicio</Button>
              </Link>
              <Button onClick={() => signOut()} variant="outline">
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registro para Robocupido 2025</CardTitle>
        <CardDescription>¡Completa el formulario para encontrar tu pareja perfecta para San Valentín!</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit}>
          <div className="grid w-full items-center gap-6">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input 
                id="fullName" 
                name="fullName" 
                placeholder="Tu nombre completo" 
                required 
                defaultValue={session?.user?.name || ""}
                disabled={true}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="Tu email" 
                required 
                defaultValue={session?.user?.email || ""}
                disabled={true}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="age">Edad</Label>
              <Input 
                id="age" 
                name="age" 
                type="number" 
                placeholder="Tu edad" 
                required 
                min="18"
                disabled={isSubmitting}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="gender">Género</Label>
              <Select name="gender" required disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="femenino">Femenino</SelectItem>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="no-binario">No binario</SelectItem>
                  <SelectItem value="prefiero-no-decirlo">Prefiero no decirlo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phone">Celular/WhatsApp</Label>
              <Input id="phone" name="phone" type="tel" placeholder="Tu número de teléfono" required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="instagram">Instagram (Ej. @roborregos)</Label>
              <Input id="instagram" name="instagram" placeholder="Tu usuario de Instagram" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Breve descripción sobre ti</Label>
              <Textarea id="description" name="description" placeholder="Cuéntanos un poco sobre ti..." required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Me gustaría que me emparejaran con personas que se identifiquen como:</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="match-men" name="matchPreferences" value="hombres" />
                  <Label htmlFor="match-men">Hombres</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="match-women" name="matchPreferences" value="mujeres" />
                  <Label htmlFor="match-women">Mujeres</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="match-non-binary" name="matchPreferences" value="no-binarias" />
                  <Label htmlFor="match-non-binary">No binarias</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="match-any" name="matchPreferences" value="indiferente" />
                  <Label htmlFor="match-any">Me es indiferente</Label>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>¿Qué estás buscando? (Puedes seleccionar múltiples opciones)</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="looking-for-partner" name="lookingFor" value="pareja" />
                  <Label htmlFor="looking-for-partner">Pareja</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="looking-for-friendship" name="lookingFor" value="amistad" />
                  <Label htmlFor="looking-for-friendship">Amistad</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="looking-for-casual" name="lookingFor" value="casual" />
                  <Label htmlFor="looking-for-casual">Algo casual</Label>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>¿Saldrías con alguien mayor que tú?</Label>
              <RadioGroup name="dateOlder" defaultValue="si">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="si" id="date-older-yes" />
                  <Label htmlFor="date-older-yes">Sí</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="date-older-no" />
                  <Label htmlFor="date-older-no">No</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>¿Saldrías con alguien menor que tú?</Label>
              <RadioGroup name="dateYounger" defaultValue="si">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="si" id="date-younger-yes" />
                  <Label htmlFor="date-younger-yes">Sí</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="date-younger-no" />
                  <Label htmlFor="date-younger-no">No</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>¿Qué actividades te gusta realizar?</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="activity-reading" name="activities" value="leer" />
                  <Label htmlFor="activity-reading">Leer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="activity-sports" name="activities" value="deportes" />
                  <Label htmlFor="activity-sports">Deportes/Ejercicio</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="activity-travel" name="activities" value="viajar" />
                  <Label htmlFor="activity-travel">Viajar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="activity-cooking" name="activities" value="cocinar" />
                  <Label htmlFor="activity-cooking">Cocinar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="activity-music" name="activities" value="musica" />
                  <Label htmlFor="activity-music">Escuchar música</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="activity-art" name="activities" value="arte" />
                  <Label htmlFor="activity-art">Apreciar/hacer arte</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="activity-videogames" name="activities" value="videojuegos" />
                  <Label htmlFor="activity-videogames">Videojuegos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="activity-movies" name="activities" value="peliculas" />
                  <Label htmlFor="activity-movies">Ver películas/series</Label>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Generalmente me gusta salir y disfruto socializar</Label>
              <Slider name="socialPreference" defaultValue={[3]}  max={6} step={1} className="w-full" />
              <div className="flex justify-between text-xs">
                <span>Nada de acuerdo</span>
                <span>Muy de acuerdo</span>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>¿Cuánto tiempo a la semana dedicas a tus hobbies?</Label>
              <RadioGroup name="hobbyTime" defaultValue="5-10">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="menos-5" id="hobby-time-less-5" />
                  <Label htmlFor="hobby-time-less-5">Menos de 5 horas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5-10" id="hobby-time-5-10" />
                  <Label htmlFor="hobby-time-5-10">5 a 10 horas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10-20" id="hobby-time-10-20" />
                  <Label htmlFor="hobby-time-10-20">10 a 20 horas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mas-20" id="hobby-time-more-20" />
                  <Label htmlFor="hobby-time-more-20">Más de 20 horas</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>¿Qué tan importante son los siguientes valores para ti?</Label>
              <div className="space-y-4">
                {[
                  "Honestidad",
                  "Lealtad",
                  "Bondad",
                  "Respeto",
                  "Apertura Mental",
                  "Independencia",
                  "Ambicion",
                  "Creatividad",
                  "Humor",
                  "Autenticidad",
                  "Empatia",
                ].map((value) => (
                  <div key={value}>
                    <Label>{value}</Label>
                    <Slider
                      name={`${value.toLowerCase()}Importance`}
                      defaultValue={[3]}
                      max={6}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs">
                      <span>Nada</span>
                      <span>Mucho</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Me es fácil volverme cercano a otras personas</Label>
              <Slider name="closenessEase" defaultValue={[3]}  max={6} step={1} className="w-full" />
              <div className="flex justify-between text-xs">
                <span>Nada de acuerdo</span>
                <span>De acuerdo</span>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label>¿Cómo manejas los desacuerdos?</Label>
              <RadioGroup name="conflictResolution">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="avoiding" id="conflict-avoiding" />
                  <Label htmlFor="conflict-avoiding">Evitándolos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="compromising" id="conflict-compromising" />
                  <Label htmlFor="conflict-compromising">Comprometiéndose a buscar soluciones</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="assertive" id="conflict-assertive" />
                  <Label htmlFor="conflict-assertive">Defendiendo los intereses propios</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="understanding" id="conflict-understanding" />
                  <Label htmlFor="conflict-understanding">Entender la perspectiva de la otra persona</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label>Soy muy atent@ a los detalles</Label>
              <Slider name="attentionToDetail" defaultValue={[3]}  max={6} step={1} className="w-full" />
              <div className="flex justify-between text-xs">
                <span>Nada de acuerdo</span>
                <span>Muy de acuerdo</span>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label>Fácilmente me estreso y me preocupo por las cosas</Label>
              <Slider name="stressLevel" defaultValue={[3]}  max={6} step={1} className="w-full" />
              <div className="flex justify-between text-xs">
                <span>Nada de acuerdo</span>
                <span>Muy de acuerdo</span>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label>Me gusta imaginar y descubrir nuevas cosas</Label>
              <Slider name="imagination" defaultValue={[3]}  max={6} step={1} className="w-full" />
              <div className="flex justify-between text-xs">
                <span>Nada de acuerdo</span>
                <span>Muy de acuerdo</span>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label>
                Si elegiste pareja o casual, ¿te gustaría compartir a detalle el tipo de persona a la cuál te sientes
                atraídx?
              </Label>
              <RadioGroup name="shareDetailedInfo" onValueChange={(value) => setShowDetailedQuestions(value === "si")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="si" id="share-detailed-yes" />
                  <Label htmlFor="share-detailed-yes">Sí</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="share-detailed-no" />
                  <Label htmlFor="share-detailed-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            
            {showDetailedQuestions && (
              <>
                <div className="flex flex-col space-y-1.5">
                  <Label className="font-bold">ANUNCIO:</Label>
                  <p className="text-sm text-gray-600">
                    Si consideras algunas otras características importantes para una relación amorosa, te brindamos este
                    espacio para compartir un poco sobre tus preferencias. La información proporcionada será procesada
                    por algortimos computacionales y modelos de lenguaje, y permanecerá completamente confidencial.
                  </p>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="detailedDescription">
                    Descripción detallada sobre ti (hábitos, metas, apariencia, etc.)
                  </Label>
                  <Textarea
                    id="detailedDescription"
                    name="detailedDescription"
                    placeholder="Comparte más detalles sobre ti..."
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="attractiveTraits">¿Qué características te atraen de otra persona?</Label>
                  <Textarea
                    id="attractiveTraits"
                    name="attractiveTraits"
                    placeholder="Describe las características que te atraen..."
                    disabled={isSubmitting}
                  />
                </div>
              </>
            )}
          </div>
          <CardFooter className="flex flex-col items-center mt-6">
            <div className="flex w-full justify-between">
              <Link href="/">
                <Button variant="outline" disabled={isSubmitting}>Volver al Inicio</Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Encontrar Mi Pareja"
                )}
              </Button>
            </div>
            {message && (
              <p className={`mt-4 text-sm ${
                message.includes("exitoso") ? "text-green-600" : "text-red-600"
              }`}>
                {message}
              </p>
            )}
          </CardFooter>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={() => signOut()} variant="outline" disabled={isSubmitting}>
          Cerrar Sesión
        </Button>
      </CardFooter>
    </Card>
  )
}