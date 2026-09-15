import { X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface ModalProps {
  title: string
  icon: LucideIcon
  onClose: () => void
  children: ReactNode
  footer: ReactNode
}

function Modal({ title, icon: Icon, onClose, children, footer }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-relis-navy/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2 text-relis-navy">
            <Icon size={18} />
            <h2 className="text-base font-bold">{title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-relis-navy">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto px-5 py-5">{children}</div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">{footer}</div>
      </div>
    </div>
  )
}

export default Modal
