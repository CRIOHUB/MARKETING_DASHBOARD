interface BadgeProps {
  label: string
  color?: string
}

const ESTADO_COLOR: Record<string, string> = {
  FINALIZADO:  '#5ED29C',
  EN_PROGRESO: '#3B82F6',
  PENDIENTE:   '#D97706',
  DETENIDO:    '#EF4444',
}

const CANAL_COLOR: Record<string, string> = {
  digital: '#2563EB',
  vm:      '#D97706',
  mkt:     '#059669',
  online:  '#2563EB',
  offline: '#D97706',
}

export function Badge({ label, color }: BadgeProps) {
  const c = color ?? ESTADO_COLOR[label] ?? CANAL_COLOR[label?.toLowerCase()] ?? 'var(--color-muted)'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 10px', borderRadius: 'var(--r-pill)',
      fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
      background: `${c}22`, color: c,
    }}>
      {label}
    </span>
  )
}

export function StatusDot({ estado }: { estado: string }) {
  const c = ESTADO_COLOR[estado] ?? '#9CA3AF'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, flexShrink: 0 }} />
      <Badge label={estado} color={c} />
    </span>
  )
}
