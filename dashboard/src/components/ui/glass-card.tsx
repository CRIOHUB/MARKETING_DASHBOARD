interface GlassCardProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  headerRight?: React.ReactNode
}

export function GlassCard({ title, subtitle, children, className, style, headerRight }: GlassCardProps) {
  return (
    <div
      className={`glass ${className ?? ''}`}
      style={{ borderRadius: 'var(--r-md)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', ...style }}
    >
      {(title || subtitle || headerRight) && (
        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        }}>
          <div>
            {title    && <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-foreground)' }}>{title}</div>}
            {subtitle && <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>{subtitle}</div>}
          </div>
          {headerRight}
        </div>
      )}
      <div style={{ padding: 18 }}>{children}</div>
    </div>
  )
}
