import { NextResponse } from "next/server"

export async function GET() {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  // Calculate the next hour and a half
  let endHour = currentHour + 1
  let endMinute = currentMinute + 30

  if (endMinute >= 60) {
    endHour += 1
    endMinute -= 60
  }

  if (endHour >= 24) {
    endHour -= 24
  }

  const endTime = new Date(now)
  endTime.setHours(endHour, endMinute, 0, 0)

  // If the end time is earlier than now, add a day
  if (endTime <= now) {
    endTime.setDate(endTime.getDate() + 1)
  }

  return NextResponse.json({ endTime: endTime.getTime() })
}

