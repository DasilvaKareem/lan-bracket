'use client'

import { useState } from 'react'
import Dialog from './Dialog'
import { Shield, Loader2 } from 'lucide-react'

interface AdminLoginDialogProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (passcode: string) => Promise<boolean>
  loading?: boolean
}

export default function AdminLoginDialog({
  isOpen,
  onClose,
  onLogin,
  loading = false
}: AdminLoginDialogProps) {
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!passcode.trim()) {
      setError('Please enter a passcode')
      return
    }

    const success = await onLogin(passcode)
    if (success) {
      setPasscode('')
      setError('')
    } else {
      setError('Invalid passcode. Please try again.')
      setPasscode('')
    }
  }

  const handleClose = () => {
    setPasscode('')
    setError('')
    onClose()
  }

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Admin Login">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <Shield className="w-12 h-12 text-blue-500" />
        </div>
        <p className="text-slate-300">
          Enter the admin passcode to manage this tournament
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="passcode" className="block text-sm font-medium text-slate-300 mb-2">
            Admin Passcode
          </label>
          <input
            type="password"
            id="passcode"
            autoFocus
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            disabled={loading}
          />
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !passcode.trim()}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Logging in...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Login
              </>
            )}
          </button>
        </div>
      </form>
    </Dialog>
  )
}