import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: 'DATABASE_URL no está configurada en las variables de entorno de Vercel.' },
      { status: 500 },
    )
  }

  const secret = req.nextUrl.searchParams.get('secret')
  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { createSchema } = await import('@/db/setup')
    const { seed } = await import('@/db/seed')

    await createSchema()           // 1. create tables (idempotent)
    const results = await seed()   // 2. wipe + load all data (per-table)

    const failed = Object.entries(results ?? {}).filter(([, v]) => v !== 'ok')
    return NextResponse.json({
      ok: failed.length === 0,
      message: failed.length === 0
        ? 'Esquema creado y base de datos poblada correctamente.'
        : `Poblado con ${failed.length} tabla(s) con error — revisa "results".`,
      results,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Error desconocido', stack: err?.stack },
      { status: 500 },
    )
  }
}
