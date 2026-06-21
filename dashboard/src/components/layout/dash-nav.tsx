'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart2, Gauge, Users, TrendingUp, PieChart,
  Wallet, UserCheck, Calendar, FolderKanban, BookOpen,
} from 'lucide-react'

const TABS = [
  { label: 'KPIs 2026',     href: '/',               icon: BarChart2 },
  { label: 'Resumen',       href: '/resumen',         icon: Gauge },
  { label: 'Captación',     href: '/captacion',       icon: Users },
  { label: 'Marketing KPIs',href: '/marketing',       icon: TrendingUp },
  { label: 'Mix Servicios', href: '/mix',             icon: PieChart },
  { label: 'Presupuesto',   href: '/presupuesto',     icon: Wallet },
  { label: 'Vendedores',    href: '/ventas',          icon: UserCheck },
  { label: 'Comunicaciones',href: '/comunicaciones',  icon: Calendar },
  { label: 'Calendario',    href: '/calendario',      icon: Calendar },
  { label: 'Proyectos',     href: '/proyectos',       icon: FolderKanban },
  { label: 'Glosario',      href: '/glosario',        icon: BookOpen },
]

export function DashNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'sticky', top: 57, zIndex: 30,
      background: 'rgba(7,11,10,.92)',
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--color-border)',
      overflowX: 'auto',
    }}>
      <div
        style={{ maxWidth: 1600, margin: '0 auto', display: 'flex', padding: '0 16px', gap: 2 }}
      >
        {TABS.map(({ label, href, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 14px',
              fontSize: 12, fontWeight: active ? 600 : 400,
              color: active ? 'var(--color-primary)' : 'var(--color-muted)',
              borderBottom: active ? '2px solid var(--color-primary)' : '2px solid transparent',
              textDecoration: 'none', whiteSpace: 'nowrap',
              transition: 'color var(--t-fast), border-color var(--t-fast)',
            }}>
              <Icon size={14} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
