'use server'
import { db } from '@/db'
import { proyectos } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function createProject(formData: FormData) {
  const nombre = (formData.get('nombre') as string)?.trim()
  if (!nombre) return

  const all  = await db.select({ id: proyectos.id }).from(proyectos).orderBy(desc(proyectos.id)).limit(1)
  const last  = all[0]?.id ?? 'P000'
  const num   = parseInt(last.slice(1)) + 1
  const id    = `P${String(num).padStart(3, '0')}`

  await db.insert(proyectos).values({
    id,
    nombre,
    resp:   (formData.get('resp')  as string) || 'Daniel Walcheff',
    inicio: (formData.get('inicio') as string) || null,
    fin:    (formData.get('fin')    as string) || null,
    estado: (formData.get('estado') as 'PENDIENTE'|'EN_PROGRESO'|'FINALIZADO'|'DETENIDO') || 'PENDIENTE',
    notas:  (formData.get('notas') as string) || null,
  })

  revalidatePath('/proyectos')
}

export async function updateEstado(id: string, estado: 'PENDIENTE'|'EN_PROGRESO'|'FINALIZADO'|'DETENIDO') {
  await db.update(proyectos).set({ estado }).where(eq(proyectos.id, id))
  revalidatePath('/proyectos')
}

export async function deleteProject(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return
  await db.delete(proyectos).where(eq(proyectos.id, id))
  revalidatePath('/proyectos')
}
