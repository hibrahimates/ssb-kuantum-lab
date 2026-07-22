import { useId, useState } from 'react'
import { findGlossaryTerm, getGlossaryTermsSorted } from '../../content/glossary'

interface GlossaryTooltipProps {
  term: string
}

export function GlossaryTooltip({ term }: GlossaryTooltipProps) {
  const entry = findGlossaryTerm(term)
  const tooltipId = useId()
  const [open, setOpen] = useState(false)

  if (!entry) {
    return <span>{term}</span>
  }

  return (
    <span
      className="relative inline"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        className="cursor-help border-b border-dotted border-cyan-electric/50 text-cyan-glow/90 transition-colors hover:border-cyan-glow hover:text-cyan-glow"
        aria-describedby={open ? tooltipId : undefined}
      >
        {term}
      </button>
      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg border border-cyan-electric/25 bg-navy-900 px-3 py-2 text-left shadow-xl"
        >
          <span className="block text-xs font-semibold text-cyan-glow">{entry.translation}</span>
          <span className="mt-1 block text-xs leading-relaxed text-slate-300">
            {entry.description}
          </span>
          <span
            className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-navy-900"
            aria-hidden
          />
        </span>
      )}
    </span>
  )
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Renders plain lesson text with glossary tooltips on known EN terms. */
export function GlossaryText({ text }: { text: string }) {
  const terms = getGlossaryTermsSorted()
  if (terms.length === 0) return <>{text}</>

  const pattern = new RegExp(
    `\\b(${terms.map((t) => escapeRegex(t.term)).join('|')})\\b`,
    'gi',
  )

  const parts = text.split(pattern)

  return (
    <>
      {parts.map((part, index) => {
        const match = findGlossaryTerm(part)
        if (match) {
          return <GlossaryTooltip key={`${match.term}-${index}`} term={match.term} />
        }
        return <span key={index}>{part}</span>
      })}
    </>
  )
}
