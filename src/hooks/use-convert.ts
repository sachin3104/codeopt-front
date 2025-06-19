import { useContext } from "react"
import { ConvertContext,ConvertContextType } from "@/context/ConvertContext"

export const useConvert = (): ConvertContextType => {
    const ctx = useContext(ConvertContext)
    if (!ctx) throw new Error('useConvert must be used within ConvertProvider')
    return ctx
  }
  