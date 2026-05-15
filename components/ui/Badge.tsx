interface BadgeProps {
  children: React.ReactNode
  variant?: 'sale' | 'new' | 'featured' | 'outofstock'
}

export default function Badge({ children, variant = 'sale' }: BadgeProps) {
  const styles = {
    sale: 'bg-[#ef262c] text-white',
    new: 'bg-[#041e42] text-white',
    featured: 'bg-[#ffbd27] text-[#041e42]',
    outofstock: 'bg-gray-400 text-white',
  }
  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${styles[variant]}`}>
      {children}
    </span>
  )
}
