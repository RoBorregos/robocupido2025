import { NextResponse } from "next/server"

export async function GET() {
  // Create dates using Monterrey's timezone (UTC-6)
  const now = new Date()
  
  // Create target time at 4 PM Monterrey time
  const targetTime = new Date()
  targetTime.setHours(0, 0, 0, 0) // Set to 4 PM

  // If current time is past 4 PM, set target to tomorrow 4 PM
  if (now >= targetTime) {
    targetTime.setDate(targetTime.getDate() + 1)
  }

  return NextResponse.json({ 
endTime: targetTime.getTime(),
  })
}