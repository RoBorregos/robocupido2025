import { Inter } from "next/font/google"
import Providers from "@/components/Providers"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

import NavBar from "@/components/navbar";

export const metadata = {
  title: "RoboCupido 2025",
  description: "Find your perfect match for Valentine's Day!",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}