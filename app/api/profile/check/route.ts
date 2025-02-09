// app/api/profile/check/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json(
        { error: "Email es requerido" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("robocupido")
    
    const submission = await db.collection("profiles").findOne({ 
      userEmail: email 
    })
    
    return NextResponse.json({ 
      hasSubmitted: !!submission 
    })
    
  } catch (error) {
    console.error("Error checking profile:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}