import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Shell } from './components/layout/Shell'
import { DevUnlockToast } from './components/DevUnlockToast'
import { Home } from './routes/Home'
import { Yol } from './routes/Yol'
import { Modul } from './routes/Modul'
import { Arena } from './routes/Arena'
import { Hackathon } from './routes/Hackathon'
import { Terimler } from './routes/Terimler'
import { Hakkinda } from './routes/Hakkinda'
import { installDevUnlockListener } from './lib/devUnlock'

export default function App() {
  useEffect(() => installDevUnlockListener(), [])

  return (
    <BrowserRouter>
      <DevUnlockToast />
      <Routes>
        <Route element={<Shell fullWidth />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<Shell />}>
          <Route path="/yol" element={<Yol />} />
          <Route path="/modul/:slug" element={<Modul />} />
          <Route path="/arena" element={<Arena />} />
          <Route path="/hackathon" element={<Hackathon />} />
          <Route path="/terimler" element={<Terimler />} />
          <Route path="/hakkinda" element={<Hakkinda />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
