interface CheckListProps {
  items: string[]
  columns?: 1 | 2
  className?: string
}

/** Scannable list with a small check icon per item. Replaces dense, dot-joined text. */
export default function CheckList({ items, columns = 2, className = '' }: CheckListProps) {
  return (
    <ul className={`grid gap-x-8 gap-y-3 ${columns === 2 ? 'sm:grid-cols-2' : ''} ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-bone">
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className="mt-0.5 h-4 w-4 shrink-0 text-accent"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 10.5l4 4 8-9" />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
