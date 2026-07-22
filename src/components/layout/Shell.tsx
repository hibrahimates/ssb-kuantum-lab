import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Sidebar, MobileNavToggle, useMobileNav } from './Sidebar'
import { setLastLocation } from '../../lib/progress'

interface ShellProps {
  fullWidth?: boolean
}

export function Shell({ fullWidth = false }: ShellProps) {
  const { mobileOpen, openMobile, closeMobile } = useMobileNav()
  const location = useLocation()

  useEffect(() => {
    setLastLocation(location.pathname)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen bg-navy-950">
      <Sidebar mobileOpen={mobileOpen} onClose={closeMobile} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-cyan-electric/10 bg-navy-950/90 px-4 py-3 backdrop-blur-md lg:px-6">
          <MobileNavToggle onOpen={openMobile} />
          <span className="font-display text-sm font-semibold text-slate-400 lg:hidden">
            Kuantum Lab
          </span>
        </header>
        <main
          className={`flex-1 ${fullWidth ? '' : 'mx-auto w-full max-w-5xl px-4 py-8 lg:px-8'}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
