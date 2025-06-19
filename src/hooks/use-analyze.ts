import { AnalyzeContext, AnalyzeContextType } from "@/context/AnalyzeContext"
import { useContext } from "react"

export function useAnalyze(): AnalyzeContextType {
  const ctx = useContext(AnalyzeContext)
  if (!ctx) {
    throw new Error('useAnalyze must be used within an AnalyzeProvider')
  }
  return ctx
}