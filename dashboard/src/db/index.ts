import { neon } from '@neondatabase/serverless'
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from './schema'

type DB = NeonHttpDatabase<typeof schema>

let _db: DB | null = null

function getDb(): DB {
  if (_db) return _db
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  _db = drizzle(neon(url), { schema })
  return _db
}

/**
 * Lazy proxy: `neon()` is only invoked on the first DB operation (request
 * time), never at module load / build time. This lets `next build` collect
 * page data without a database connection string.
 */
export const db = new Proxy({} as DB, {
  get(_target, prop, receiver) {
    const real = getDb()
    const value = Reflect.get(real as object, prop, receiver)
    return typeof value === 'function' ? value.bind(real) : value
  },
})
