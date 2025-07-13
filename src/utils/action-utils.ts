import { ActionVariant } from '@/types/action'
import { SUPPORTED_LANGUAGES } from '@/types/action'

// Helper function to check if language is supported
export const isLanguageSupported = (language: string): boolean => {
  return SUPPORTED_LANGUAGES.some(
    supportedLang => supportedLang.toLowerCase() === language.toLowerCase()
  )
}

// Get button styles based on variant
export const getButtonStyles = (variant: ActionVariant, isDisabled?: boolean): string => {
  const baseStyles = variant === 'homepage' 
    ? `
      flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 md:py-4 rounded-md xs:rounded-lg sm:rounded-xl
      text-white backdrop-blur-md
      transition-all duration-300
      text-xs xs:text-sm sm:text-sm md:text-base
      min-h-[44px] xs:min-h-[48px] sm:min-h-[52px] md:min-h-[56px]
    `
    : `
      flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-2 xs:px-2.5 sm:px-3 md:px-4 py-1.5 xs:py-2 sm:py-2 md:py-2.5 rounded-md sm:rounded-lg
      text-white backdrop-blur-md
      transition-all duration-300
      text-xs xs:text-xs sm:text-sm
      min-h-[36px] xs:min-h-[40px] sm:min-h-[44px]
    `

  if (isDisabled) {
    return `${baseStyles} opacity-50 cursor-not-allowed bg-black/40 border border-white/20`
  }

  return `${baseStyles} bg-gradient-to-br from-black/40 via-black/30 to-black/20 hover:from-black/50 hover:via-black/40 hover:to-black/30 border border-white/20 hover:border-white/30`
}

// Get icon size based on variant
export const getIconSize = (variant: ActionVariant): string => {
  return variant === 'homepage' ? 'w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 md:w-6 md:h-6' : 'w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4'
}

// Get container styles based on variant
export const getContainerStyles = (variant: ActionVariant): string => {
  return variant === 'homepage' 
    ? "flex items-center justify-center p-2 xs:p-2.5 sm:p-3 md:p-4"
    : "flex items-center gap-x-4 xs:gap-x-6 sm:gap-x-8 md:gap-x-10 gap-y-3 xs:gap-y-4 sm:gap-y-4 md:gap-y-4"
}

// Get inner container styles based on variant
export const getInnerContainerStyles = (variant: ActionVariant): string => {
  return variant === 'homepage'
    // mobile: 2x2 grid, tablet+: horizontal flex row
    ? "grid grid-cols-2 gap-2 xs:flex xs:flex-row xs:flex-nowrap xs:justify-center xs:space-x-1.5 sm:space-x-2.5 md:space-x-3 p-2 xs:p-2.5 sm:p-3 md:p-4"
    : "flex flex-wrap gap-x-4 xs:gap-x-6 sm:gap-x-8 md:gap-x-10 gap-y-3 xs:gap-y-4 sm:gap-y-4 md:gap-y-4"
} 