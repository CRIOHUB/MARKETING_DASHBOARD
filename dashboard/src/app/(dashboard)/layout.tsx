import { Header } from '@/components/layout/header'
import { DashNav } from '@/components/layout/dash-nav'

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
