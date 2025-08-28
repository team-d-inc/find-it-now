import { Prisma } from '@/generated/prisma'

export type NormalizedError = {
  message: string
  status: number
}

const DEFAULT_MESSAGE = 'An unexpected server error occurred. Please try again later.'

function extractUniqueFields(meta?: Record<string, unknown>): string[] {
  const target = (meta as { target?: string | string[] })?.target
  if (Array.isArray(target)) {
    return target as string[]
  }
  if (typeof target === 'string') {
    const parts = target.split('_')
    const last = parts[parts.length - 1]
    return [last || target]
  }
  return []
}

export function normalizeError(error: unknown): NormalizedError {
  let message = DEFAULT_MESSAGE
  let status = 500

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const fields = extractUniqueFields(error.meta)
      const fieldLabel = fields.length > 0 ? fields.join(', ') : 'value'
      message = `This ${fieldLabel} is already in use. Please use a different one.`
      status = 409
      return { message, status }
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('already exists')) {
      message = error.message
      status = 409
      return { message, status }
    }
  }

  return { message, status }
}
