// app/actions.ts
"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function registerUser(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return { success: false, message: "Debes iniciar sesión para enviar el formulario." }
    }

    const client = await clientPromise
    const db = client.db("robocupido")
    const profiles = db.collection("profiles")
    const preferences = db.collection("preferences")

    // Check if user has already submitted a form using the email
    const existingSubmission = await profiles.findOne({ 
      userEmail: session.user.email 
    })
    
    if (existingSubmission) {
      return { success: false, message: "Ya has enviado un formulario anteriormente." }
    }

    // Generate a unique ID to link the documents
    const profileId = new ObjectId()

    // Split data into two objects
    const profileData = {
      _id: profileId,
      userEmail: session.user.email,
      userName: session.user.name,
      fullName: formData.get("fullName"),
      age: safeParseInt(formData.get("age") as string),
      gender: formData.get("gender"),
      phone: formData.get("phone"),
      instagram: formData.get("instagram"),
      createdAt: new Date(),
      lastUpdated: new Date()
    }

    const preferencesData = {
      profileId: profileId,
      description: formData.get("description"),
      matchPreferences: formData.getAll("matchPreferences"),
      lookingFor: formData.getAll("lookingFor"),
      dateOlder: formData.get("dateOlder"),
      dateYounger: formData.get("dateYounger"),
      activities: formData.getAll("activities"),
      socialPreference: safeParseInt(formData.get("socialPreference") as string),
      hobbyTime: formData.get("hobbyTime"),
      // Importance ratings
      honestyImportance: safeParseInt(formData.get("honestidadImportance") as string),
      loyaltyImportance: safeParseInt(formData.get("lealtadImportance") as string),
      kindnessImportance: safeParseInt(formData.get("bondadImportance") as string),
      respectImportance: safeParseInt(formData.get("respetoImportance") as string),
      openMindednessImportance: safeParseInt(formData.get("apertura mentalImportance") as string),
      independenceImportance: safeParseInt(formData.get("independenciaImportance") as string),
      ambitionImportance: safeParseInt(formData.get("ambicionImportance") as string),
      creativityImportance: safeParseInt(formData.get("creatividadImportance") as string),
      humorImportance: safeParseInt(formData.get("humorImportance") as string),
      authenticityImportance: safeParseInt(formData.get("autenticidadImportance") as string),
      empathyImportance: safeParseInt(formData.get("empatiaImportance") as string),
      // Additional characteristics
      closenessEase: safeParseInt(formData.get("closenessEase") as string),
      conflictResolution: formData.get("conflictResolution"),
      attentionToDetail: safeParseInt(formData.get("attentionToDetail") as string),
      stressLevel: safeParseInt(formData.get("stressLevel") as string),
      imagination: safeParseInt(formData.get("imagination") as string),
      shareDetailedInfo: formData.get("shareDetailedInfo"),
      detailedDescription: formData.get("detailedDescription"),
      attractiveTraits: formData.get("attractiveTraits"),
      createdAt: new Date(),
      lastUpdated: new Date()
    }

    // Validate required fields
    const requiredFields = ['fullName', 'age', 'gender', 'phone']
    for (const field of requiredFields) {
      if (!profileData[field as keyof typeof profileData]) {
        return { 
          success: false, 
          message: `El campo ${field} es requerido.` 
        }
      }
    }

    // Insert both documents in a transaction
    const dbSession = client.startSession()
    try {
      await dbSession.withTransaction(async () => {
        await profiles.insertOne(profileData, { session: dbSession })
        await preferences.insertOne(preferencesData, { session: dbSession })
      })
    } finally {
      await dbSession.endSession()
    }

    return { 
      success: true, 
      message: "¡Registro exitoso! Te contactaremos con tu pareja el 14 de febrero." 
    }

  } catch (error) {
    console.error("Error in registerUser:", error)
    return { 
      success: false, 
      message: "Ocurrió un error al procesar tu registro. Por favor intenta nuevamente." 
    }
  }
}

// Helper function to safely parse integers
function safeParseInt(value: string | null | undefined): number | null {
  if (!value) return null
  const parsed = parseInt(value)
  return isNaN(parsed) ? null : parsed
}