// CLI runner for the seed. Mirrors the /api/seed route: create the schema
// (idempotent) then wipe + reload every table from seed.ts into Neon.
// Used by `npm run db:seed` locally and by the daily sync routine.
// Requires dashboard/.env.local with DATABASE_URL (loaded via --env-file).
import { createSchema } from './setup'
import { seed } from './seed'

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL no está definida. Crea dashboard/.env.local con la cadena de Neon.')
    process.exit(1)
  }
  await createSchema()
  const results = await seed()
  const failed = Object.entries(results ?? {}).filter(([, v]) => v !== 'ok')
  if (failed.length) {
    console.error('Seed terminó con errores:', failed)
    process.exit(1)
  }
  console.log('Seed OK — Neon recargada.')
  process.exit(0)
}

main().catch((e) => { console.error('Seed falló:', e); process.exit(1) })
