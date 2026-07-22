import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  getAdjacentModules,
  getModuleBySlug,
  getModuleMeta,
} from '../content/modules'
import type { ModuleContent, ModuleMeta, PlaygroundId } from '../content/modules/types'
import { LessonBlock } from '../components/lesson/LessonBlock'
import { Callout } from '../components/lesson/Callout'
import { CodeBlock } from '../components/lesson/CodeBlock'
import { GlossaryText } from '../components/lesson/GlossaryTooltip'
import { AnalogyCard } from '../components/lesson/AnalogyCard'
import { IntuitionExample } from '../components/lesson/IntuitionExample'
import { TryThis } from '../components/lesson/TryThis'
import { PlaygroundSlot } from '../components/lesson/PlaygroundSlot'
import { QuizEngine } from '../components/quiz/QuizEngine'
import { getUnlockRequirement, isModuleUnlocked } from '../lib/scoring'

function ModuleNav({ slug }: { slug: string }) {
  const { prev, next } = getAdjacentModules(slug)

  if (!prev && !next) return null

  return (
    <nav
      aria-label="Ders geçişi"
      className="mt-10 flex flex-col gap-3 border-t border-cyan-electric/15 pt-8 sm:flex-row sm:items-stretch sm:justify-between"
    >
      {prev ? (
        <NavLink meta={prev} direction="prev" />
      ) : (
        <span className="hidden sm:block sm:flex-1" />
      )}
      {next ? (
        <NavLink meta={next} direction="next" />
      ) : (
        <Link
          to="/yol"
          className="group flex flex-1 flex-col rounded-xl border border-cyan-electric/20 bg-navy-800/40 px-4 py-3 text-right transition-colors hover:border-cyan-electric/40 hover:bg-navy-800/70 sm:ml-auto sm:max-w-sm"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Sonraki →
          </span>
          <span className="mt-1 font-display text-sm font-semibold text-cyan-glow group-hover:text-white">
            Yol haritası & arena
          </span>
        </Link>
      )}
    </nav>
  )
}

function NavLink({
  meta,
  direction,
}: {
  meta: ModuleMeta
  direction: 'prev' | 'next'
}) {
  const isPrev = direction === 'prev'

  return (
    <Link
      to={`/modul/${meta.slug}`}
      className={`group flex flex-1 flex-col rounded-xl border border-cyan-electric/20 bg-navy-800/40 px-4 py-3 transition-colors hover:border-cyan-electric/40 hover:bg-navy-800/70 sm:max-w-sm ${
        isPrev ? 'text-left' : 'text-right sm:ml-auto'
      }`}
    >
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {isPrev ? '← Önceki ders' : 'Sonraki ders →'}
      </span>
      <span className="mt-1 font-display text-sm font-semibold text-white group-hover:text-cyan-glow">
        {meta.order}. {meta.title}
      </span>
      <span className="mt-0.5 line-clamp-1 text-xs text-slate-500">{meta.subtitle}</span>
    </Link>
  )
}

function getModulePlaygrounds(content: ModuleContent): PlaygroundId[] {
  if (content.playgrounds && content.playgrounds.length > 0) {
    return content.playgrounds
  }
  if (content.simType) {
    return [content.simType]
  }
  return []
}

export function Modul() {
  const { slug } = useParams<{ slug: string }>()
  const meta = slug ? getModuleMeta(slug) : undefined
  const content = slug ? getModuleBySlug(slug) : undefined
  const unlocked = slug ? isModuleUnlocked(slug) : false
  const unlockMessage = slug ? getUnlockRequirement(slug) : undefined
  const playgrounds = content ? getModulePlaygrounds(content) : []

  if (!slug || !meta) {
    return (
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold text-white">Modül bulunamadı</h1>
        <Link to="/yol" className="mt-4 inline-block text-cyan-glow hover:underline">
          Yol haritasına dön
        </Link>
      </div>
    )
  }

  if (!content) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="mb-2 text-sm text-cyan-electric/70">Modül {meta.order}</p>
        <h1 className="font-display text-3xl font-bold text-white">{meta.title}</h1>
        <p className="mt-2 text-slate-400">{meta.subtitle}</p>
        <Callout title="İçerik yakında" variant="tip">
          Bu modülün ders içeriği bir sonraki fazda eklenecek. Şimdilik yalnızca meta bilgi
          mevcut.
        </Callout>
        <ModuleNav slug={slug} />
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Link to="/yol" className="text-sm text-slate-500 hover:text-cyan-glow">
        ← Yol haritası
      </Link>
      <p className="mt-4 text-sm font-medium text-cyan-electric/70">Modül {content.order}</p>
      <h1 className="font-display text-3xl font-bold text-white">{content.title}</h1>
      <p className="mt-2 text-slate-400">{content.subtitle}</p>

      {!unlocked && unlockMessage && (
        <Callout title="Modül kilitli" variant="warning">
          {unlockMessage} İçeriği inceleyebilirsin; quiz ve playground önceki modül geçilince
          aktif olur.
        </Callout>
      )}

      <Callout title="Modül hedefi" variant="tip">
        <GlossaryText text={content.goal} />
      </Callout>

      {content.analogy && <AnalogyCard analogy={content.analogy} unlocked={unlocked} />}

      {content.sections.map((section) => (
        <LessonBlock key={section.id} title={section.title}>
          <p>
            <GlossaryText text={section.body} />
          </p>
          {section.codeBlock && (
            <CodeBlock language={section.codeBlock.language} code={section.codeBlock.code} />
          )}
          {section.visual && (
            <div className="mt-4">
              <PlaygroundSlot id={section.visual} unlocked={unlocked} compact />
            </div>
          )}
          {section.miniPlayground && (
            <div className="mt-4 rounded-lg border border-cyan-electric/10 bg-navy-900/30 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cyan-electric/60">
                Mini playground
              </p>
              <PlaygroundSlot id={section.miniPlayground} unlocked={unlocked} compact />
            </div>
          )}
        </LessonBlock>
      ))}

      {content.intuitions && content.intuitions.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-1 font-display text-xl font-semibold text-white">
            Sayılarla Sezgi
          </h2>
          <p className="mb-4 text-sm text-slate-500">
            Toy senaryolar — yarışma gününde aynı mantığı gerçek veriye uygulayacaksın.
          </p>
          <ul className="space-y-3">
            {content.intuitions.map((intuition, index) => (
              <IntuitionExample key={intuition.title} intuition={intuition} index={index} />
            ))}
          </ul>
        </section>
      )}

      {content.tryThis && content.tryThis.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-1 font-display text-xl font-semibold text-white">Dene Bunu</h2>
          <p className="mb-4 text-sm text-slate-500">
            Playground&apos;da elle oyna; gözlemlediğini not al — workshop tarzı ilerle.
          </p>
          <ol className="space-y-3">
            {content.tryThis.map((challenge, index) => (
              <TryThis key={`${challenge.prompt.slice(0, 24)}-${index}`} challenge={challenge} index={index} />
            ))}
          </ol>
        </section>
      )}

      {playgrounds.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-1 font-display text-xl font-semibold text-white">Playground</h2>
          <p className="mb-4 text-sm text-slate-500">
            {playgrounds.length > 1
              ? 'Bu modülde birden fazla interaktif alan var — sırayla dene.'
              : 'Kavramı elle hisset.'}
          </p>
          <div className="space-y-6">
            {playgrounds.map((playgroundId) => (
              <div key={playgroundId}>
                <PlaygroundSlot id={playgroundId} unlocked={unlocked} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-4 font-display text-xl font-semibold text-white">Quiz</h2>
        {unlocked ? (
          <QuizEngine moduleSlug={content.slug} questions={content.quiz} />
        ) : (
          <Callout title="Quiz kilitli" variant="tip">
            {unlockMessage ?? 'Önceki modül quizini en az %70 ile geç.'}
          </Callout>
        )}
      </section>

      <ModuleNav slug={content.slug} />
    </motion.div>
  )
}
