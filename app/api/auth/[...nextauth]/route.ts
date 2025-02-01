import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

// models/UserProfile.ts
import { ObjectId } from "mongodb"

export interface UserProfile {
  _id?: ObjectId
  userId: string
  name: string
  email: string
  age: number
  gender: string
  seeking: string
  interests: string[]
  relationshipPreference: string
  valentinesDayPreferences: string[]
  loveLanguage: string
  aboutMe: string
  idealMatch: string
  hasSubmittedForm: boolean
  createdAt: Date
  updatedAt: Date
}