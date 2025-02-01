"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { registerUser } from "@/app/actions"

export default function RegistrationForm() {
  const [message, setMessage] = useState("")
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    const result = await registerUser(formData)
    if (result.success) {
      setMessage(result.message)
      router.refresh()
    } else {
      setMessage("Registration failed. Please try again.")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Register for Robocupido 2025</CardTitle>
        <CardDescription>Fill out the form below to find your perfect Valentine's match!</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit}>
          {/* Form fields remain the same */}
          <div className="grid w-full items-center gap-6">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Your name" required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="Your email" required />
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
              <Label>Ideal Valentine's Day (select all that apply)</Label>
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
                <Button variant="outline">Back to Home</Button>
              </Link>
              <Button type="submit">Find My Match</Button>
            </div>
            {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}

