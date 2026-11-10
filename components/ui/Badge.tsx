interface BadgeProps {
  children: React.ReactNode
  variant?: 'sale' | 'new' | 'featured' | 'outofstock'
}

export default function Badge({ children, variant = 'sale' }: BadgeProps) {
  const styles = {
    sale: 'bg-[#c81e25] text-white',
    new: 'bg-[var(--cms-color-primary)] text-white',
    featured: 'bg-[#ffbd27] text-[var(--cms-color-primary)]',
    outofstock: 'bg-[#5d6b7b] text-white',
  }
  return (
    <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded ${styles[variant]}`}>
      {children}
    </span>
  )
}
