import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-[#00a046] hover:bg-[#037535] text-white',
    secondary: 'bg-[var(--cms-color-primary)] hover:bg-[var(--cms-color-primary-hover)] text-white',
    outline: 'border-2 border-[var(--cms-color-primary)] text-[var(--cms-color-primary)] hover:bg-[var(--cms-color-primary)] hover:text-white',
    ghost: 'text-[var(--cms-color-primary)] hover:bg-[#f2f3f5]',
  }

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
