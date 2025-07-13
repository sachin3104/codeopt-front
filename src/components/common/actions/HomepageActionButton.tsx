import React from 'react'
import { StarBorder } from '@/components/ui/StarBorder'

interface HomepageActionButtonProps {
  onClick: () => void
  disabled: boolean
  icon: React.ComponentType<any>
  label: string
  subname: string
}

export const HomepageActionButton: React.FC<HomepageActionButtonProps> = ({ 
  onClick, 
  disabled, 
  icon: Icon, 
  label, 
  subname 
}) => {
  return (
    <StarBorder
      as="button"
      onClick={onClick}
      disabled={disabled}
      className="w-32 xs:w-36 sm:w-40 md:w-44 lg:w-48 xl:w-52 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      color="#878686"
      speed={disabled ? "0s" : "8s"}
    >
      <div className="flex flex-row flex-nowrap items-center justify-center space-x-1 xs:space-x-1.5 sm:space-x-2 md:space-x-2.5 text-white font-medium text-xs xs:text-xs sm:text-xs md:text-sm py-0.5 xs:py-1 sm:py-1.5 min-w-0">
        <Icon className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 flex-shrink-0" />
        <span>{label}</span>
        {/* hide subname on mobile (<sm), show on tablet+ */}
        <span className="text-gray-400 hidden sm:inline">{subname}</span>
      </div>
    </StarBorder>
  )
} 