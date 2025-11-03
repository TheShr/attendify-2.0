import { NextResponse } from 'next/server'

type Params = { params: { id: string } }

export async function PATCH(_req: Request, { params }: Params) {
  void params.id
  return NextResponse.json({ ok: true }) // TODO: real DB update
}

export async function DELETE(_req: Request, { params }: Params) {
  void params.id
  return NextResponse.json({ ok: true })
}
