import React, { useState, CSSProperties } from 'react';

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  borderColor?: string; // Color for border on hover
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  size = 'md',
  variant = 'primary',
  borderColor = '#4ade80', // Default border color
  startIcon,
  endIcon,
  fullWidth = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Size classes mapping
  const sizeStyles: Record<string, CSSProperties> = {
    sm: { padding: '0.25rem 0.75rem', fontSize: '0.875rem' },
    md: { padding: '0.5rem 1rem', fontSize: '1rem' },
    lg: { padding: '0.75rem 1.5rem', fontSize: '1.125rem' },
  };

  // Variant styles mapping
  const variantStyles: Record<string, CSSProperties> = {
    primary: { backgroundColor: 'rgba(15, 15, 30, 0.25)' },
    secondary: { backgroundColor: 'rgba(15, 15, 30, 0.15)' },
    ghost: { backgroundColor: 'rgba(15, 15, 30, 0.05)' },
  };

  // Container styles
  const containerStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    borderRadius: '8px',
    width: fullWidth ? '100%' : 'auto',
  };

  // Button styles
  const buttonStyle: CSSProperties = {
    backdropFilter: 'blur(10px)',
    backgroundColor: variantStyles[variant].backgroundColor,
    border: `2px solid ${isHovered && !disabled ? borderColor : 'rgba(255, 255, 255, 0.1)'}`,
    borderRadius: '8px',
    color: 'rgba(255, 255, 255, 0.85)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    gap: '8px',
    transition: 'all 0.3s ease',
    position: 'relative',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
    ...sizeStyles[size],
    ...(isHovered && !disabled ? {
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
      transform: 'translateY(-1px)',
    } : {})
  };

  return (
    <div style={containerStyle} className={fullWidth ? 'w-full' : ''}>
      <button
        style={buttonStyle}
        className={className}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        type="button"
      >
        {startIcon && <span className="button-start-icon">{startIcon}</span>}
        {children}
        {endIcon && <span className="button-end-icon">{endIcon}</span>}
      </button>
    </div>
  );
};

export default GlassButton;