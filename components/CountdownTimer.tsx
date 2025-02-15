"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    const fetchEndTime = async () => {
      const response = await fetch("/api/countdown")
      const data = await response.json()
      const endTime = data.endTime
      const now = Date.now()
      setTimeLeft(Math.max(0, Math.floor((endTime - now) / 1000)))
    }

    fetchEndTime()

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === null) return null
        if (prevTime <= 1) {
          clearInterval(timer)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (timeLeft === null) {
    return <div>Cargando...</div>
  }

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Resultados disponibles en</CardTitle>
        <CardDescription className="text-center">
          Los matches se revelarán cuando el contador llegue a cero
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col">
            <span className="text-4xl font-bold">{hours.toString().padStart(2, "0")}</span>
            <span className="text-sm">Horas</span>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-bold">{minutes.toString().padStart(2, "0")}</span>
            <span className="text-sm">Minutos</span>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-bold">{seconds.toString().padStart(2, "0")}</span>
            <span className="text-sm">Segundos</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

