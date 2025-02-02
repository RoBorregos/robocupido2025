"use client"

import { useState, useEffect } from "react"
import { useRouter, redirect } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { registerUser } from "@/app/actions"
import { Loader2 } from "lucide-react"
import { signOut } from "next-auth/react"


export default function RegistrationForm() {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  // Check if user has already submitted form
  useEffect(() => {
    async function checkSubmissionStatus() {
      if (session?.user) {
        const response = await fetch(`/api/profile/check?userId=${(session.user as { id: string }).id}`)
        const data = await response.json()
        setHasSubmitted(data.hasSubmitted)
      }
    }
    
    checkSubmissionStatus()
  }, [session])



  // Show loading state while session is being fetched
  if (status === "loading") {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </CardContent>
      </Card>
    )
  }
  else if (!session) {
    redirect("/api/auth/signin");
  }

  // Show message if user has already submitted
  if (hasSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">You&apos;ve Already Registered!</h2>
            <p className="text-gray-600 mb-6">
              You have already submitted your registration form. We&apos;ll contact you with your match on February 14th!
            </p>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
            <Button className="ml-4"
              variant="outline" 
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  async function handleSubmit(formData: FormData) {
    try {
      setIsSubmitting(true)
      setMessage("")

      // Pre-fill email and name from session if available
      if (session?.user?.email) {
        formData.set("email", session.user.email)
      }
      if (session?.user?.name) {
        formData.set("name", session.user.name)
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
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Register for Robocupido 2025</CardTitle>
              <CardDescription>Fill out the form below to find your perfect Valentine&apos;s match!</CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign Out
            </Button>
          </div>
        </CardHeader>
      <CardContent>
        <form action={handleSubmit}>
          <div className="grid w-full items-center gap-6">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Your name" 
                required 
                defaultValue={session?.user?.name || ""}
                disabled={isSubmitting}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="Your email" 
                required 
                defaultValue={session?.user?.email || ""}
                disabled={isSubmitting}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" type="number" placeholder="Your age" required min="18" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="seeking">Seeking</Label>
              <Select name="seeking" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="any">Any</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="interests">Interests (comma-separated)</Label>
              <Textarea id="interests" name="interests" placeholder="e.g., hiking, movies, cooking" required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Relationship Preference</Label>
              <RadioGroup name="relationship_preference" defaultValue="long-term">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="long-term" id="long-term" />
                  <Label htmlFor="long-term">Long-term relationship</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="casual" id="casual" />
                  <Label htmlFor="casual">Casual dating</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="friendship" id="friendship" />
                  <Label htmlFor="friendship">Friendship</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Ideal Valentine&apos;s Day (select all that apply)</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="romantic-dinner" name="valentines_day_preference" value="romantic-dinner" />
                  <Label htmlFor="romantic-dinner">Romantic dinner</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="movie-night" name="valentines_day_preference" value="movie-night" />
                  <Label htmlFor="movie-night">Movie night</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="outdoor-adventure" name="valentines_day_preference" value="outdoor-adventure" />
                  <Label htmlFor="outdoor-adventure">Outdoor adventure</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="spa-day" name="valentines_day_preference" value="spa-day" />
                  <Label htmlFor="spa-day">Spa day</Label>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="love_language">Primary Love Language</Label>
              <Select name="love_language" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary love language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="words_of_affirmation">Words of Affirmation</SelectItem>
                  <SelectItem value="acts_of_service">Acts of Service</SelectItem>
                  <SelectItem value="receiving_gifts">Receiving Gifts</SelectItem>
                  <SelectItem value="quality_time">Quality Time</SelectItem>
                  <SelectItem value="physical_touch">Physical Touch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="about_me">About Me</Label>
              <Textarea id="about_me" name="about_me" placeholder="Tell us a bit more about yourself..." required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="ideal_match">Describe Your Ideal Match</Label>
              <Textarea
                id="ideal_match"
                name="ideal_match"
                placeholder="What are you looking for in a partner?"
                required
              />
            </div>
          </div>
          <CardFooter className="flex flex-col items-center mt-6">
            <div className="flex w-full justify-between">
              <Link href="/">
                <Button variant="outline" disabled={isSubmitting}>Back to Home</Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Find My Match"
                )}
              </Button>
            </div>
            {message && (
              <p className={`mt-4 text-sm ${
                message.includes("successful") ? "text-green-600" : "text-red-600"
              }`}>
                {message}
              </p>
            )}
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}