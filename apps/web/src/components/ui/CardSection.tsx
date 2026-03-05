'use client'

interface CardSectionProps {
  children: React.ReactNode
  index: number
  id?: string
  className?: string
}

export function CardSection({
  children,
  index,
  id,
  className = '',
}: CardSectionProps) {

  if (index === 0) {
    return (
      <section id={id} className={`w-full ${className}`}>
        <div data-scroll-container className="w-full">
          {children}
        </div>
      </section>
    )
  }

  return (
    <section id={id} className={`w-full ${className}`}>
      <div
        data-scroll-container
        className="w-full"
        style={{
          transformOrigin: 'bottom left',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </section>
  )
}