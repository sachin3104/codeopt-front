import { OptimizeContext, OptimizeContextType } from "@/context/OptimizeContext"
import { useContext } from "react"


export const useOptimize = (): OptimizeContextType => {
    const ctx = useContext(OptimizeContext)
    if (!ctx) throw new Error('useOptimize must be used within OptimizeProvider')
    return ctx
  }