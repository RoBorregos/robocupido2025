// app/actions.ts
"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import * as tf from '@tensorflow/tfjs-node';
import { AutoTokenizer, AutoModel } from '@huggingface/transformers';


export async function registerUser(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return { success: false, message: "Debes iniciar sesión para enviar el formulario." }
    }

    const client = await clientPromise
    const db = client.db("robocupido")
    const submissions = db.collection("submissions")

    // Check if user has already submitted a form using the email
    const existingSubmission = await submissions.findOne({ 
      userEmail: session.user.email 
    })
    
    if (existingSubmission) {
      return { success: false, message: "Ya has enviado un formulario anteriormente." }
    }

    // Process form data with validation
    const submissionData = {
      userEmail: session.user.email,
      userName: session.user.name,
      fullName: formData.get("fullName"),
      age: safeParseInt(formData.get("age") as string),
      gender: formData.get("gender"),
      phone: formData.get("phone"),
      instagram: formData.get("instagram"),
      description: formData.get("description"),
      matchPreferences: formData.getAll("matchPreferences"),
      lookingFor: formData.get("lookingFor"),
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
      
      // Metadata
      createdAt: new Date(),
      lastUpdated: new Date()
    }

    // Validate required fields
    const requiredFields = ['fullName', 'age', 'gender', 'phone']
    for (const field of requiredFields) {
      if (!submissionData[field as keyof typeof submissionData]) {
        return { 
          success: false, 
          message: `El campo ${field} es requerido.` 
        }
      }
    }

// Generate embeddings for text fields
const embeddings: { [key: string]: number[] } = {};
const textFields = [
  'fullName', 'description', 'instagram', 'lookingFor', 'dateOlder', 
  'dateYounger', 'hobbyTime', 'conflictResolution', 'shareDetailedInfo', 
  'detailedDescription', 'attractiveTraits'
];

for (const field of textFields) {
  const text = submissionData[field as keyof typeof submissionData];
  if (typeof text === "string" && text.trim() !== "") {
    embeddings[`${field}Embedding`] = await generateEmbeddings(text);
  }
}

// Combine original submission data and generated embeddings
const dataWithEmbeddings = { ...submissionData, embeddings };

    // // Validate age
    // if (submissionData.age === null || submissionData.age < 18 || submissionData.age > 100) {
    //   return { 
    //     success: false, 
    //     message: "La edad debe estar entre 18 y 100 años." 
    //   }
    // }

    // Insert the submission into the database
    await submissions.insertOne({
      submissionData,
      dataWithEmbeddings
  });

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

// Helper function to generate text embeddings
async function generateEmbeddings(text: string) {
  const tokenizer = await AutoTokenizer.fromPretrained('bert-base-uncased');
  const model = await AutoModel.fromPretrained('bert-base-uncased');
  const inputs = await tokenizer.encode(text, { addSpecialTokens: true, truncation: true, padding: 'max_length' });
  const inputTensor = tf.tensor(inputs.input_ids);
  const output = await model.forward(inputTensor);
  const embedding = output.last_hidden_state.mean(1).dataSync();
  return embedding;
}

// Helper function to safely parse integers
function safeParseInt(value: string | null | undefined): number | null {
  if (!value) return null
  const parsed = parseInt(value)
  return isNaN(parsed) ? null : parsed
}