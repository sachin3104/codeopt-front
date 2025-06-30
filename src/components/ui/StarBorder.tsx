import { cn } from "@/lib/utils"
import { ElementType, ComponentPropsWithoutRef } from "react"

interface StarBorderProps<T extends ElementType> {
  as?: T
  color?: string
  speed?: string
  className?: string
  children: React.ReactNode
}

export function StarBorder<T extends ElementType = "button">({
  as,
  className,
  color,
  speed = "6s",
  children,
  ...props
}: StarBorderProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof StarBorderProps<T>>) {
  const Component = as || "button"
  const defaultColor = color || "#ffffff"

  return (
    <Component 
      className={cn(
        "relative inline-block py-[1px] overflow-hidden rounded-[30px]",
        className
      )} 
      {...props}
    >
      <div
        className={cn(
          "absolute w-[300%] h-[50%] bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0",
          "opacity-15 dark:opacity-25" 
        )}
        style={{
          background: `radial-gradient(circle, ${defaultColor}, transparent 15%)`,
          animationDuration: speed,
        }}
      />
      <div
        className={cn(
          "absolute w-[300%] h-[50%] top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0",
          "opacity-15 dark:opacity-25"
        )}
        style={{
          background: `radial-gradient(circle, ${defaultColor}, transparent 15%)`,
          animationDuration: speed,
        }}
      />
      <div className={cn(
        "relative z-1 border text-foreground text-center text-base py-3 px-8 rounded-[30px]",
        "bg-gradient-to-br from-black/40 via-black/30 to-black/20 border-white/20",
        "hover:from-black/50 hover:via-black/40 hover:to-black/30 hover:border-white/30",
        "backdrop-blur-md transition-all duration-300"
      )}>
        {children}
      </div>
    </Component>
  )
} 