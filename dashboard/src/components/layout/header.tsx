import { ThemeToggle } from './theme-toggle'

export function Header() {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'rgba(7,11,10,.95)',
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--color-border-hi)',
      boxShadow: '0 2px 24px rgba(0,0,0,.6), var(--shadow-glow)',
    }}>
      <div
        style={{ maxWidth: 1600, margin: '0 auto', padding: '10px 24px' }}
        className="flex items-center justify-between gap-3 flex-wrap"
      >
        <div className="flex items-center gap-3">
          {/* Brand pill */}
          <span style={{
            background: 'var(--color-primary)',
            color: '#070b0a',
            fontFamily: 'var(--font-accent)',
            fontStyle: 'italic',
            fontSize: 15,
            fontWeight: 700,
            padding: '4px 16px',
            borderRadius: 'var(--r-pill)',
            flexShrink: 0,
          }}>
            CrioCord
          </span>
          <div>
            <div style={{
              fontSize: 15, fontWeight: 700,
              color: 'var(--color-foreground)', letterSpacing: '-0.01em',
            }}>
              Dashboard Marketing 2026
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 1 }}>
              Desarrollado por Daniel Walcheff
            </div>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
