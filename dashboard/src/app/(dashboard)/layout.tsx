import { Header } from '@/components/layout/header'
import { DashNav } from '@/components/layout/dash-nav'

// These pages read live data from the DB on every request — never
// statically pre-render them at build time (the DB may be empty/offline then).
export const dynamic = 'force-dynamic'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      <Header />
      <DashNav />
      <main style={{ maxWidth: 1600, margin: '0 auto', padding: '20px 20px 60px' }}>
        {children}
      </main>
    </div>
  )
}
