import { NextResponse } from 'next/server'

type GeofencePayload = Record<string, unknown>

interface GeofenceZone extends GeofencePayload {
  id: string
}

const zones: GeofenceZone[] = []

export async function GET() {
  return NextResponse.json({ zones })
}

export async function POST(req: Request) {
  const payload = await req.json().catch(() => null)
  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
  }

  const zone: GeofenceZone = { id: crypto.randomUUID(), ...(payload as GeofencePayload) }
  zones.push(zone)
  return NextResponse.json(zone, { status: 201 })
}
