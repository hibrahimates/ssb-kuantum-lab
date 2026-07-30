import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('[SceneHost] WebGL render failed:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-48 items-center justify-center bg-navy-900/80 px-6 text-center">
          <p className="text-sm text-slate-400">
            3D sahne bu cihazda yüklenemedi (WebGL). Ders metni ve 2D görsellerle devam
            edebilirsin.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
