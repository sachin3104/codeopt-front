import React from 'react'
import { ActionVariant } from '@/types/action'
import { getButtonStyles, getIconSize } from '@/utils/action-utils'

interface LayoutActionButtonProps {
  onClick: () => void
  disabled: boolean
  icon: React.ComponentType<any>
  label: string
  variant: ActionVariant
}

export const LayoutActionButton: React.FC<LayoutActionButtonProps> = ({ 
  onClick, 
  disabled, 
  icon: Icon, 
  label, 
  variant 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={getButtonStyles(variant, disabled)}
    >
      <Icon className={getIconSize(variant)} />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  )
} 