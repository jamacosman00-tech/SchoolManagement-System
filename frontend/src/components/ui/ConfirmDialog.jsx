import React from 'react'
import Modal from './Modal'
import Button from './Button'
import { AlertTriangle } from 'lucide-react'

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full flex-shrink-0 ${
          variant === 'danger' 
            ? 'bg-red-100 dark:bg-red-900/30' 
            : 'bg-yellow-100 dark:bg-yellow-900/30'
        }`}>
          <AlertTriangle
            size={22}
            className={variant === 'danger' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}
          />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{message}</p>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
