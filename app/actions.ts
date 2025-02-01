"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { revalidatePath } from "next/cache"

export async function registerUser(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return { success: false, message: "You must be logged in to register" }
    }

    const client = await clientPromise
    const db = client.db("robocupido")
    
    // Check if user has already submitted a form
    const existingProfile = await db.collection("profiles").findOne({
      userId: session.user.id
    })

    if (existingProfile) {
      return { 
        success: false, 
        message: "You have already submitted a registration form" 
      }
    }

    // Process form data
    const profile = {
      userId: session.user.id,
      name: formData.get("name"),
      email: formData.get("email"),
      age: parseInt(formData.get("age") as string),
      gender: formData.get("gender"),
      seeking: formData.get("seeking"),
      interests: (formData.get("interests") as string).split(",").map(i => i.trim()),
      relationshipPreference: formData.get("relationship_preference"),
      valentinesDayPreferences: formData.getAll("valentines_day_preference"),
      loveLanguage: formData.get("love_language"),
      aboutMe: formData.get("about_me"),
      idealMatch: formData.get("ideal_match"),
      hasSubmittedForm: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await db.collection("profiles").insertOne(profile)
    
    revalidatePath("/register")
    return { 
      success: true, 
      message: "Registration successful! We'll contact you with your match on February 14th." 
    }
  } catch (error) {
    console.error("Registration error:", error)
    return { 
      success: false, 
      message: "An error occurred during registration. Please try again." 
    }
  }
}