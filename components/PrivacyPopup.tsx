"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface PrivacyPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyPopup({ isOpen, onClose }: PrivacyPopupProps) {
  const [accepted, setAccepted] = useState(false)
  const router = useRouter()

  const handleAccept = () => {
    setAccepted(true)
    onClose()
    router.push("/login")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Política de Privacidad</DialogTitle>
          <DialogDescription>Por favor, lee nuestra política de privacidad antes de registrarte.</DialogDescription>
        </DialogHeader>
        <div className="max-h-[300px] overflow-y-auto my-4">
          <p className="mb-4">
            En Robocupido 2025, nos tomamos muy en serio la privacidad de tus datos. Queremos asegurarte que:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Toda la información que proporciones será estrictamente confidencial.</li>
            <li>Tus datos personales nunca serán compartidos con terceros sin tu consentimiento explícito.</li>
            <li>Utilizamos encriptación de última generación para proteger tu información.</li>
            <li>Solo utilizaremos tus datos para los fines específicos de nuestro servicio de emparejamiento.</li>
            <li>Tienes derecho a solicitar la eliminación de tus datos en cualquier momento.</li>
          </ul>
          <p className="mt-4">
            Al registrarte, aceptas nuestra política de privacidad y el uso de tus datos exclusivamente para los fines
            de Robocupido 2025.
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleAccept} disabled={accepted}>
            {accepted ? "Aceptado" : "Acepto la Política de Privacidad"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

