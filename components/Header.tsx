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
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Navigation */}
          <div className="flex items-center gap-4">
            {showBackToHome && (
              <Link
                href="/"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            )}
            
            {showBackToTournaments && (
              <Link
                href="/tournaments"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">All Tournaments</span>
              </Link>
            )}
          </div>

          {/* Center - Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Trophy className="w-8 h-8 text-yellow-500" />
              <h1 className="text-xl font-bold text-white">LAN Bracket</h1>
            </Link>
          </div>

          {/* Right side - Spacer for balance */}
          <div className="w-16 sm:w-32"></div>
        </div>
      </div>
    </div>
  )
}