import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { seed } = await import('@/db/seed')
    await seed()
    return NextResponse.json({ ok: true, message: 'Base de datos poblada correctamente.' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
