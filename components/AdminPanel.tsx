'use client'

import { useState } from 'react'
import { Play, Shuffle, Users, Trash2, Edit3, Lock, Unlock, Shield, Trophy, User, RotateCcw } from 'lucide-react'
import ConfirmDialog from './ConfirmDialog'
import SuccessDialog from './SuccessDialog'
import EditTournamentDialog from './EditTournamentDialog'

interface AdminPanelProps {
  tournament: any
  onUpdate: () => void
  onDelete?: () => void
}

export default function AdminPanel({ tournament, onUpdate, onDelete }: AdminPanelProps) {
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showStartConfirm, setShowStartConfirm] = useState(false)
  const [showShuffleConfirm, setShowShuffleConfirm] = useState(false)
  const [showCloseRegistrationConfirm, setShowCloseRegistrationConfirm] = useState(false)
  const [showOpenRegistrationConfirm, setShowOpenRegistrationConfirm] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleStartTournament = () => {
    if (tournament.players.length < 2) {
      setSuccessMessage('Need at least 2 players to start the tournament')
      setShowSuccessDialog(true)
      return
    }
    setShowStartConfirm(true)
  }

  const startTournament = async () => {
    setShowStartConfirm(false)
    setLoading(true)
    try {
      const response = await fetch(`/api/tournaments/${tournament.id}/start`, {
        method: 'POST',
      })

      if (response.ok) {
        setSuccessMessage('Tournament started successfully! Brackets have been generated.')
        setShowSuccessDialog(true)
        onUpdate()
      } else {
        const error = await response.json()
        setSuccessMessage(error.error || 'Failed to start tournament')
        setShowSuccessDialog(true)
      }
    } catch (error) {
      console.error('Error starting tournament:', error)
      setSuccessMessage('Failed to start tournament')
      setShowSuccessDialog(true)
    } finally {
      setLoading(false)
    }
  }

  const handleShufflePlayers = () => {
    setShowShuffleConfirm(true)
  }

  const shufflePlayers = async () => {
    setShowShuffleConfirm(false)
    setLoading(true)
    try {
      const response = await fetch(`/api/tournaments/${tournament.id}/shuffle`, {
        method: 'POST',
      })

      if (response.ok) {
        setSuccessMessage('Player seeds have been shuffled!')
        setShowSuccessDialog(true)
        onUpdate()
      } else {
        setSuccessMessage('Failed to shuffle players')
        setShowSuccessDialog(true)
      }
    } catch (error) {
      console.error('Error shuffling players:', error)
      setSuccessMessage('Failed to shuffle players')
      setShowSuccessDialog(true)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseRegistration = () => {
    setShowCloseRegistrationConfirm(true)
  }

  const closeRegistration = async () => {
    setShowCloseRegistrationConfirm(false)
    setLoading(true)
    try {
      const response = await fetch(`/api/tournaments/${tournament.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'registration_closed' }),
      })

      if (response.ok) {
        setSuccessMessage('Registration has been closed. No more players can join.')
        setShowSuccessDialog(true)
        onUpdate()
      } else {
        const error = await response.json()
        setSuccessMessage(error.error || 'Failed to close registration')
        setShowSuccessDialog(true)
      }
    } catch (error) {
      console.error('Error closing registration:', error)
      setSuccessMessage('Failed to close registration')
      setShowSuccessDialog(true)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenRegistration = () => {
    setShowOpenRegistrationConfirm(true)
  }

  const openRegistration = async () => {
    setShowOpenRegistrationConfirm(false)
    setLoading(true)
    try {
      const response = await fetch(`/api/tournaments/${tournament.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'registration_open' }),
      })

      if (response.ok) {
        setSuccessMessage('Registration has been reopened. Players can now join again.')
        setShowSuccessDialog(true)
        onUpdate()
      } else {
        const error = await response.json()
        setSuccessMessage(error.error || 'Failed to open registration')
        setShowSuccessDialog(true)
      }
    } catch (error) {
      console.error('Error opening registration:', error)
      setSuccessMessage('Failed to open registration')
      setShowSuccessDialog(true)
    } finally {
      setLoading(false)
    }
  }

  const handleResetTournament = () => {
    setShowResetConfirm(true)
  }

  const resetTournament = async () => {
    setShowResetConfirm(false)
    setLoading(true)
    try {
      const response = await fetch(`/api/tournaments/${tournament.id}/reset`, {
        method: 'POST',
      })

      if (response.ok) {
        setSuccessMessage('Tournament has been reset. All matches cleared and status returned to registration open.')
        setShowSuccessDialog(true)
        onUpdate()
      } else {
        const error = await response.json()
        setSuccessMessage(error.error || 'Failed to reset tournament')
        setShowSuccessDialog(true)
      }
    } catch (error) {
      console.error('Error resetting tournament:', error)
      setSuccessMessage('Failed to reset tournament')
      setShowSuccessDialog(true)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTournament = () => {
    setShowDeleteConfirm(true)
  }

  const deleteTournament = async () => {
    setShowDeleteConfirm(false)
    setLoading(true)
    try {
      const response = await fetch(`/api/tournaments/${tournament.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        if (onDelete) {
          onDelete()
        }
      } else {
        const error = await response.json()
        setSuccessMessage(error.error || 'Failed to delete tournament')
        setShowSuccessDialog(true)
      }
    } catch (error) {
      console.error('Error deleting tournament:', error)
      setSuccessMessage('Failed to delete tournament')
      setShowSuccessDialog(true)
    } finally {
      setLoading(false)
    }
  }

  const handleEditTournament = () => {
    setShowEditDialog(true)
  }

  const editTournament = async (data: any) => {
    setLoading(true)
    try {
      // Convert datetime strings to ISO format if they exist
      const updateData = {
        ...data,
        startDateTime: data.startDateTime ? new Date(data.startDateTime).toISOString() : null,
        endDateTime: data.endDateTime ? new Date(data.endDateTime).toISOString() : null,
      }

      const response = await fetch(`/api/tournaments/${tournament.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        setSuccessMessage('Tournament updated successfully!')
        setShowSuccessDialog(true)
        setShowEditDialog(false)
        onUpdate()
      } else {
        const error = await response.json()
        setSuccessMessage(error.error || 'Failed to update tournament')
        setShowSuccessDialog(true)
      }
    } catch (error) {
      console.error('Error updating tournament:', error)
      setSuccessMessage('Failed to update tournament')
      setShowSuccessDialog(true)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="mt-8 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700/50">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-slate-700/50 rounded-lg">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          Admin Dashboard
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Tournament Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Players</span>
            </div>
            <div className="text-2xl font-bold text-white">{tournament.players.length} / {tournament.maxPlayers}</div>
          </div>
          
          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">Status</span>
            </div>
            <div className="text-lg font-semibold text-white capitalize">{tournament.status.replace('_', ' ')}</div>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Play className="w-4 h-4" />
              <span className="text-sm font-medium">Matches</span>
            </div>
            <div className="text-2xl font-bold text-white">{tournament.matches?.length || 0}</div>
          </div>
        </div>

        {/* General Controls */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">General</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleEditTournament}
              disabled={loading}
              className="px-5 py-2.5 bg-slate-700/60 hover:bg-slate-600/60 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border border-slate-600/30"
            >
              <Edit3 className="w-4 h-4" />
              Edit Details
            </button>
          </div>
        </div>

        {/* Registration Controls */}
        {tournament.status === 'registration_open' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Registration</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleShufflePlayers}
                disabled={loading || tournament.players.length < 2}
                className="px-5 py-2.5 bg-purple-600/80 hover:bg-purple-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Shuffle className="w-4 h-4" />
                Shuffle Seeds
              </button>

              <button
                onClick={handleCloseRegistration}
                disabled={loading}
                className="px-5 py-2.5 bg-orange-600/80 hover:bg-orange-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Close Registration
              </button>
            </div>
          </div>
        )}

        {tournament.status === 'registration_closed' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Registration</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleOpenRegistration}
                disabled={loading}
                className="px-5 py-2.5 bg-green-600/80 hover:bg-green-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                Reopen Registration
              </button>
            </div>
          </div>
        )}

        {/* Tournament Controls */}
        {(tournament.status === 'registration_open' || tournament.status === 'registration_closed') && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Tournament</h3>
            <button
              onClick={handleStartTournament}
              disabled={loading || tournament.players.length < 2}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
            >
              <Play className="w-5 h-5" />
              Start Tournament
            </button>
            {tournament.players.length < 2 && (
              <p className="text-sm text-slate-400 mt-2">Need at least 2 players to start</p>
            )}
          </div>
        )}

        {tournament.status === 'in_progress' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Tournament</h3>
            <button
              onClick={handleResetTournament}
              disabled={loading}
              className="px-5 py-2.5 bg-orange-600/80 hover:bg-orange-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Tournament
            </button>
            <p className="text-sm text-slate-400 mt-2">
              Clear all matches and return to registration phase
            </p>
          </div>
        )}


        {/* Danger Zone */}
        <div className="border-t border-red-900/30 pt-6">
          <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </h3>
          <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-4">
            <button
              onClick={handleDeleteTournament}
              disabled={loading}
              className="px-5 py-2.5 bg-red-600/80 hover:bg-red-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Tournament
            </button>
            <p className="text-sm text-red-300/70 mt-2">
              Permanently delete tournament and all data
            </p>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <EditTournamentDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSave={editTournament}
        tournament={tournament}
        loading={loading}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={deleteTournament}
        title="Delete Tournament"
        message={`Are you sure you want to delete "${tournament.name}"? This action cannot be undone and will permanently delete all tournament data, players, and matches.`}
        confirmText="Delete Tournament"
        cancelText="Cancel"
        variant="danger"
        loading={loading}
      />

      <ConfirmDialog
        isOpen={showStartConfirm}
        onClose={() => setShowStartConfirm(false)}
        onConfirm={startTournament}
        title="Start Tournament"
        message={`Ready to start "${tournament.name}"? This will generate the bracket and begin the tournament. You can reset the tournament later if needed.`}
        confirmText="Start Tournament"
        cancelText="Cancel"
        variant="info"
        loading={loading}
      />

      <ConfirmDialog
        isOpen={showShuffleConfirm}
        onClose={() => setShowShuffleConfirm(false)}
        onConfirm={shufflePlayers}
        title="Shuffle Player Seeds"
        message="This will randomly shuffle all player seeds. Are you sure you want to proceed?"
        confirmText="Shuffle Seeds"
        cancelText="Cancel"
        variant="warning"
        loading={loading}
      />

      <ConfirmDialog
        isOpen={showCloseRegistrationConfirm}
        onClose={() => setShowCloseRegistrationConfirm(false)}
        onConfirm={closeRegistration}
        title="Close Registration"
        message="This will prevent new players from joining the tournament. You can still start the tournament later. Are you sure?"
        confirmText="Close Registration"
        cancelText="Cancel"
        variant="warning"
        loading={loading}
      />

      <ConfirmDialog
        isOpen={showOpenRegistrationConfirm}
        onClose={() => setShowOpenRegistrationConfirm(false)}
        onConfirm={openRegistration}
        title="Reopen Registration"
        message="This will allow new players to join the tournament again. Are you sure?"
        confirmText="Reopen Registration"
        cancelText="Cancel"
        variant="info"
        loading={loading}
      />

      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={resetTournament}
        title="Reset Tournament"
        message="This will delete all matches and reset the tournament back to registration phase. All bracket progress will be lost. Are you sure?"
        confirmText="Reset Tournament"
        cancelText="Cancel"
        variant="warning"
        loading={loading}
      />


      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title="Success"
        message={successMessage}
      />
    </div>
  )
}