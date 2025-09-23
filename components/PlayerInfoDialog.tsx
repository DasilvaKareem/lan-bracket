'use client'

import { User, Mail, Phone, Trophy, Hash } from 'lucide-react'
import Dialog from './Dialog'

interface PlayerInfoDialogProps {
  isOpen: boolean
  onClose: () => void
  player: any
}

export default function PlayerInfoDialog({ isOpen, onClose, player }: PlayerInfoDialogProps) {
  if (!player) return null

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Player Information">
      <div className="space-y-6">
        {/* Player Header */}
        <div className="text-center pb-4 border-b border-slate-700">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">{player.gamertag}</h2>
          <p className="text-slate-400">{player.name}</p>
        </div>

        {/* Player Details */}
        <div className="space-y-4">
          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Hash className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-medium text-slate-400">Seed</span>
            </div>
            <div className="text-xl font-bold text-white">
              #{player.seed || 'Not assigned'}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-slate-800/40 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-400">Email</span>
              </div>
              <div className="text-white font-medium">
                {player.email || 'Not provided'}
              </div>
            </div>

            <div className="bg-slate-800/40 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Phone className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-400">Phone</span>
              </div>
              <div className="text-white font-medium">
                {player.phone || 'Not provided'}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-medium text-slate-400">Registration</span>
            </div>
            <div className="text-white font-medium">
              {new Date(player.createdAt).toLocaleDateString()} at{' '}
              {new Date(player.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-4 border-t border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  )
}