import Link from 'next/link'
import { Trophy, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <Trophy className="w-24 h-24 mx-auto text-yellow-500 mb-4" />
          <h1 className="text-6xl font-bold text-white mb-4">
            LAN Bracket
          </h1>
          <p className="text-xl text-slate-300 mb-12">
            Beautiful tournament brackets made simple
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link
            href="/register"
            className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <Trophy className="w-12 h-12 mb-4 mx-auto" />
              <h2 className="text-2xl font-bold mb-2">Create Tournament</h2>
              <p className="text-blue-100">Start a new tournament bracket</p>
            </div>
          </Link>

          <Link
            href="/tournaments"
            className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 text-white p-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <Users className="w-12 h-12 mb-4 mx-auto" />
              <h2 className="text-2xl font-bold mb-2">View Tournaments</h2>
              <p className="text-purple-100">Browse active tournaments</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}