"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Deepfake Detection
            </Link>
          </div>
          <div className="flex space-x-8">
            <Link
              href="/"
              className={cn(
                "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 text-gray-700 hover:text-gray-900 transition-colors",
                pathname === "/" ? "border-blue-500 text-gray-900" : "border-transparent",
              )}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={cn(
                "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 text-gray-700 hover:text-gray-900 transition-colors",
                pathname === "/about" ? "border-blue-500 text-gray-900" : "border-transparent",
              )}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
