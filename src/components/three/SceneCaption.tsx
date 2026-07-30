interface SceneCaptionProps {
  children: string
}

export function SceneCaption({ children }: SceneCaptionProps) {
  return (
    <p className="border-t border-cyan-electric/10 px-4 py-2.5 text-xs leading-relaxed text-slate-400">
      <span className="font-semibold text-cyan-electric/80">Bu ne anlatıyor?</span>{' '}
      {children}
    </p>
  )
}
