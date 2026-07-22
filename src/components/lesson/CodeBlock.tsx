interface CodeBlockProps {
  language?: string
  code: string
}

export function CodeBlock({ language = 'python', code }: CodeBlockProps) {
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-cyan-electric/15 bg-navy-950">
      <div className="border-b border-cyan-electric/10 px-4 py-2 text-xs uppercase tracking-wide text-slate-500">
        {language}
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-cyan-100/90">
        <code>{code}</code>
      </pre>
    </div>
  )
}
