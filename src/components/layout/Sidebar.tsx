import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { to: '/', label: 'Ana Sayfa', end: true },
  { to: '/yol', label: 'Yol Haritası' },
  { to: '/arena', label: 'Ön Eleme Arenası' },
  { to: '/hackathon', label: 'Hackathon' },
  { to: '/terimler', label: 'Terimler' },
  { to: '/hakkinda', label: 'Hakkında' },
]

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-cyan-electric/15 text-cyan-glow'
                : 'text-slate-400 hover:bg-navy-700/50 hover:text-slate-200'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      <aside className="hidden w-56 shrink-0 flex-col border-r border-cyan-electric/10 bg-navy-900/80 lg:flex">
        <div className="border-b border-cyan-electric/10 px-4 py-5">
          <NavLink to="/" className="font-display text-lg font-bold text-gradient-cyan">
            Kuantum Lab
          </NavLink>
          <p className="mt-1 text-xs text-slate-500">SSB Yarışma Hazırlığı</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <NavItems />
        </div>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-navy-950/80 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-cyan-electric/10 bg-navy-900 lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-cyan-electric/10 px-4 py-4">
                <span className="font-display text-lg font-bold text-gradient-cyan">
                  Kuantum Lab
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-2 text-slate-400 hover:bg-navy-700 hover:text-white"
                  aria-label="Menüyü kapat"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <NavItems onNavigate={onClose} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export function MobileNavToggle({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="rounded-lg border border-cyan-electric/20 p-2 text-slate-300 hover:border-cyan-electric/40 lg:hidden"
      aria-label="Menüyü aç"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  )
}

export function useMobileNav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  return {
    mobileOpen,
    openMobile: () => setMobileOpen(true),
    closeMobile: () => setMobileOpen(false),
  }
}
