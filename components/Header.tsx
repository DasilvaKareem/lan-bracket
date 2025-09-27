'use client'

import Link from 'next/link'
import { Trophy, ArrowLeft, Home } from 'lucide-react'

interface HeaderProps {
  showBackToTournaments?: boolean
  showBackToHome?: boolean
}

export default function Header({ 
  showBackToTournaments = false, 
  showBackToHome = false
}: HeaderProps) {
  return (
    <div className="bg-slate-950/50 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Navigation */}
          <div className="flex items-center gap-3">
            {showBackToHome && (
              <Link
                href="/"
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Home</span>
              </Link>
            )}

            {showBackToTournaments && (
              <Link
                href="/tournaments"
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Tournaments</span>
              </Link>
            )}
          </div>

          {/* Center - Title */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500" />
              <h1 className="text-lg sm:text-xl font-bold text-white">LAN Bracket</h1>
            </Link>
          </div>

          {/* Right side - Spacer for balance */}
          <div className="w-12 sm:w-24"></div>
        </div>
      </div>
    </div>
  )
}