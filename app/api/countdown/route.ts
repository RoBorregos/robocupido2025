import { NextResponse } from "next/server";

export async function GET() {
  // Create dates using Monterrey's timezone (UTC-6)
  const now = new Date();

  // Create target time at 4 PM Monterrey time (16:00 + 6 hours)
  const targetTime = new Date("2025-02-15T22:20:00Z");

  // If current time is past 4 PM, set target to tomorrow 4 PM
  if (now >= targetTime) {
    targetTime.setDate(targetTime.getDate() + 1);
  }

  return NextResponse.json({
    endTime: targetTime.getTime(),
  });
}
