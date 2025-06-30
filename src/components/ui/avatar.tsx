import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  children?: React.ReactNode
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "md", children, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex shrink-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

interface AvatarCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const AvatarCircle = React.forwardRef<HTMLDivElement, AvatarCircleProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full overflow-hidden",
        "backdrop-blur-md bg-gradient-to-br from-white/20 via-white/10 to-white/5",
        "border border-white/20 shadow-lg",
        "transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
AvatarCircle.displayName = "AvatarCircle"

interface AvatarIconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  initials?: string
}

const AvatarIcon = React.forwardRef<HTMLDivElement, AvatarIconProps>(
  ({ className, icon, initials, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center",
        "text-white/90 font-medium",
        className
      )}
      {...props}
    >
      {icon || (
        <span className="text-sm uppercase">
          {initials || "U"}
        </span>
      )}
    </div>
  )
)
AvatarIcon.displayName = "AvatarIcon"

interface AvatarLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string
  variant?: "default" | "pro" | "premium"
}

const AvatarLabel = React.forwardRef<HTMLDivElement, AvatarLabelProps>(
  ({ className, text, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "from-gray-900/80 via-gray-800/70 to-gray-900/60 border-gray-500/30",
      pro: "from-blue-900/80 via-blue-800/70 to-blue-900/60 border-blue-400/30",
      premium: "from-purple-900/80 via-purple-800/70 to-purple-900/60 border-purple-400/30"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "absolute -bottom-2 left-1/2 -translate-x-1/2",
          "px-2 py-0.5 min-w-[3rem]",
          "rounded-full backdrop-blur-md",
          "bg-gradient-to-r border",
          "shadow-sm",
          "transition-all duration-300",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <span className="text-[10px] font-medium text-white/90 uppercase tracking-wider text-center block">
          {text}
        </span>
      </div>
    )
  }
)
AvatarLabel.displayName = "AvatarLabel"

// Composite Avatar with Icon and Label for glassmorphic design
interface GlassmorphicAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  initials?: string
  planLabel: string
  planVariant?: "default" | "pro" | "premium"
  size?: "sm" | "md" | "lg"
}

const GlassmorphicAvatar = React.forwardRef<HTMLDivElement, GlassmorphicAvatarProps>(
  ({ className, icon, initials, planLabel, planVariant = "default", size = "md", onClick, ...props }, ref) => {
    const sizeClasses = {
      sm: {
        container: "h-10 w-10",
        circle: "h-8 w-8",
        icon: "text-xs",
        label: "text-[9px] px-1.5 py-0.5 -bottom-1.5"
      },
      md: {
        container: "h-12 w-12",
        circle: "h-10 w-10",
        icon: "text-sm",
        label: "text-[10px] px-2 py-0.5 -bottom-2"
      },
      lg: {
        container: "h-14 w-14",
        circle: "h-12 w-12",
        icon: "text-base",
        label: "text-[11px] px-2.5 py-0.5 -bottom-2"
      }
    }

    const currentSize = sizeClasses[size]

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center cursor-pointer group",
          currentSize.container,
          className
        )}
        onClick={onClick}
        {...props}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Avatar Circle */}
        <div
          className={cn(
            "relative flex items-center justify-center rounded-full overflow-hidden z-10",
            "backdrop-blur-md bg-gradient-to-br from-white/20 via-white/10 to-white/5",
            "border border-white/20 shadow-lg",
            "transition-all duration-300",
            "group-hover:border-white/30 group-hover:from-white/25 group-hover:via-white/15 group-hover:to-white/10",
            "group-hover:scale-105",
            currentSize.circle
          )}
        >
          <div className={cn("text-white/90 font-medium", currentSize.icon)}>
            {icon || (
              <span className="uppercase">
                {initials || "U"}
              </span>
            )}
          </div>
        </div>

        {/* Plan Label */}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 z-20",
            "min-w-[2.5rem] px-2 py-0.5",
            "rounded-full backdrop-blur-md",
            "bg-gradient-to-r border",
            "shadow-sm",
            "transition-all duration-300",
            "group-hover:scale-105",
            currentSize.label,
            planVariant === "default" && "from-gray-900/80 via-gray-800/70 to-gray-900/60 border-gray-500/30",
            planVariant === "pro" && "from-blue-900/80 via-blue-800/70 to-blue-900/60 border-blue-400/30",
            planVariant === "premium" && "from-purple-900/80 via-purple-800/70 to-purple-900/60 border-purple-400/30"
          )}
        >
          <span className="font-medium text-white/90 uppercase tracking-wider text-center block">
            {planLabel}
          </span>
        </div>
      </div>
    )
  }
)
GlassmorphicAvatar.displayName = "GlassmorphicAvatar"

export { Avatar, AvatarCircle, AvatarIcon, AvatarLabel, GlassmorphicAvatar }