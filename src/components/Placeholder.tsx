interface PlaceholderProps {
  label: string
  ratio?: string
  className?: string
}

/**
 * Honest stand-in for real photography/screenshots that haven't been supplied
 * yet. It should look like a placeholder, not a fake product shot.
 * Swap for real assets (see deliverable #13).
 */
export default function Placeholder({ label, ratio = 'aspect-[4/3]', className = '' }: PlaceholderProps) {
  return (
    <div
      className={`relative flex ${ratio} items-center justify-center overflow-hidden rounded-2xl border border-dashed border-line bg-surface ${className}`}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(45deg, var(--color-bone) 1px, transparent 1px), linear-gradient(-45deg, var(--color-bone) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />
      <span className="relative px-6 text-center text-xs uppercase tracking-widest text-mute">{label}</span>
    </div>
  )
}
