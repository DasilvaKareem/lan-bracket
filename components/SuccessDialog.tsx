'use client'

import Dialog from './Dialog'
import { CheckCircle } from 'lucide-react'

interface SuccessDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  buttonText?: string
}

export default function SuccessDialog({
  isOpen,
  onClose,
  title,
  message,
  buttonText = 'OK'
}: SuccessDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        
        <p className="text-slate-300 mb-6 leading-relaxed">
          {message}
        </p>

        <button
          onClick={onClose}
          className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-800"
        >
          {buttonText}
        </button>
      </div>
    </Dialog>
  )
}