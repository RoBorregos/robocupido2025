// app/actions.ts
"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Function to generate embeddings for text
async function generateEmbedding(text: string | null): Promise<number[] | null> {
  if (!text) return null
  
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float"
    })
    console.log(response.data[0].embedding)
    return response.data[0].embedding
  } catch (error) {
    console.error("Error generating embedding:", error)
    return null
  }
}

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
    const textEmbeddings = db.collection("text_embeddings")

    // Check if user has already submitted a form using the email
    const existingSubmission = await profiles.findOne({ 
      userEmail: session.user.email 
    })
    
    if (existingSubmission) {
      return { success: false, message: "Ya has enviado un formulario anteriormente." }
    }

    // Generate a unique ID to link the documents
    const profileId = new ObjectId()

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

    // Get text fields that need embeddings
    const description = formData.get("description") as string
    const detailedDescription = formData.get("detailedDescription") as string
    const attractiveTraits = formData.get("attractiveTraits") as string

    const preferencesData = {
      profileId: profileId,
      description,
      matchPreferences: formData.getAll("matchPreferences"),
      lookingFor: formData.get("lookingFor"),
      dateOlder: formData.get("dateOlder"),
      dateYounger: formData.get("dateYounger"),
      activities: formData.getAll("activities"),
      socialPreference: safeParseInt(formData.get("socialPreference") as string),
      hobbyTime: formData.get("hobbyTime"),
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
      closenessEase: safeParseInt(formData.get("closenessEase") as string),
      conflictResolution: formData.get("conflictResolution"),
      attentionToDetail: safeParseInt(formData.get("attentionToDetail") as string),
      stressLevel: safeParseInt(formData.get("stressLevel") as string),
      imagination: safeParseInt(formData.get("imagination") as string),
      shareDetailedInfo: formData.get("shareDetailedInfo"),
      detailedDescription,
      attractiveTraits,
      createdAt: new Date(),
      lastUpdated: new Date()
    }

    // Generate embeddings only for the specified text fields
    const embeddingsData = {
      profileId: profileId,
      textEmbeddings: {
        description: await generateEmbedding(description),
        detailedDescription: await generateEmbedding(detailedDescription),
        attractiveTraits: await generateEmbedding(attractiveTraits)
      },
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

    // Insert all documents in a transaction
    const mongoSession = client.startSession()
    try {
      await mongoSession.withTransaction(async () => {
        await profiles.insertOne(profileData, { session: mongoSession })
        await preferences.insertOne(preferencesData, { session: mongoSession })
        await textEmbeddings.insertOne(embeddingsData, { session: mongoSession })
      })
    } finally {
      await mongoSession.endSession()
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


interface Match {
  name: string;
  age: number;
  compatibility: number;
  interests: string[];
  instagram: string;
  whatsapp: string;
}

export interface MatchResponse {
  pareja: Match[];
  amigos: Match[];
  casual: Match[];
}

export async function getMatches(userId: string): Promise<MatchResponse> {
  try {
    const client = await clientPromise;
    const db = client.db("robocupido");
    const matchesCollection = db.collection("match_test");
    const profilesCollection = db.collection("profiles");
    const preferencesCollection = db.collection("preferences");

    // Find the user's matches
    const userMatches = await matchesCollection.findOne({
      profileId: new ObjectId(userId)
    });

    if (!userMatches) {
      return { pareja: [], amigos: [], casual: [] };
    }



    // Helper function to fetch and format profile data
    async function getProfileData(matchId: ObjectId, score: number): Promise<Match> {
      const profile = await profilesCollection.findOne({ _id: matchId });
      const preferences = await preferencesCollection.findOne({ profileId: matchId });
      
      return {
        name: profile?.fullName as string,
        age: profile?.age as number,
        compatibility: score,
        interests: preferences?.activities as string[] || [],
        instagram: profile?.instagram as string,
        whatsapp: profile?.phone as string
      };
    }

    // Process pareja matches
    const parejaMatches = await Promise.all(
      (userMatches.pareja || []).map(async (match: { id: ObjectId; score: number }) => 
        getProfileData(match.id, match.score)
      )
    );

    // Process amigos matches
    const amigosMatches = await Promise.all(
      (userMatches.amigos || []).map(async (match: { id: ObjectId; score: number }) => 
        getProfileData(match.id, match.score)
      )
    );

    // Process casual matches
    const casualMatches = await Promise.all(
      (userMatches.casual || []).map(async (match: { id: ObjectId; score: number }) => 
        getProfileData(match.id, match.score)
      )
    );

    return {
      pareja: parejaMatches,
      amigos: amigosMatches,
      casual: casualMatches
    };

  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
}