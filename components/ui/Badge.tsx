interface BadgeProps {
  children: React.ReactNode
  variant?: 'sale' | 'new' | 'featured' | 'outofstock'
}

export default function Badge({ children, variant = 'sale' }: BadgeProps) {
  const styles = {
    sale: 'bg-[var(--cms-color-accent)] text-white',
    new: 'bg-[var(--cms-color-primary)] text-white',
    featured: 'bg-[#ffbd27] text-[var(--cms-color-primary)]',
    outofstock: 'bg-gray-400 text-white',
  }
  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${styles[variant]}`}>
      {children}
    </span>
  )
}
