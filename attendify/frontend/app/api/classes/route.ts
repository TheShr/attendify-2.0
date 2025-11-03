import { NextResponse } from "next/server"
import { getApiBase } from "@/lib/api"

type BackendClassListResponse = {
  classes?: Array<Record<string, unknown>>
  ok?: boolean
  data?: unknown
  error?: string
}

type BackendClassDetailResponse = {
  ok?: boolean
  data?: {
    class?: Record<string, unknown>
    students?: Array<Record<string, unknown>>
  }
  error?: string
}

type BackendCreateClassResponse = {
  class?: Record<string, unknown>
  error?: string
}

function buildBackendUrl(path: string): URL {
  const base = getApiBase().replace(/\/+$/, "")
  const suffix = path.startsWith("/") ? path : `/${path}`
  return new URL(`${base}${suffix}`)
}

function mapClassRow(input: Record<string, unknown>): Record<string, unknown> {
  return {
    id: input.id,
    class_name: input.class_name ?? input.className ?? null,
    section: input.section ?? null,
    subject: input.subject ?? null,
    schedule_info: input.schedule_info ?? input.scheduleInfo ?? null,
    created_at: input.created_at ?? input.createdAt ?? null,
    student_count: input.student_count ?? input.studentCount ?? null,
  }
}

export async function GET(req: Request) {
  try {
    const incomingUrl = new URL(req.url)
    const backendUrl = buildBackendUrl("/classes")

    const classId = incomingUrl.searchParams.get("class_id")
    const withStudents = incomingUrl.searchParams.get("with_students")

    if (classId && classId !== "all") {
      backendUrl.searchParams.set("class_id", classId)
    }
    if (withStudents) {
      backendUrl.searchParams.set("with_students", withStudents)
    }

    const backendResponse = await fetch(backendUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    })

    const data = (await backendResponse.json().catch(() => null)) as
      | BackendClassListResponse
      | BackendClassDetailResponse
      | null

    if (!backendResponse.ok || !data) {
      return NextResponse.json(
        { ok: false, error: data && "error" in data ? data.error : "Unable to fetch classes" },
        { status: backendResponse.status || 502 },
      )
    }

    if (Array.isArray((data as BackendClassListResponse).classes)) {
      const classes = (data as BackendClassListResponse).classes ?? []
      return NextResponse.json({ ok: true, data: classes.map((item) => mapClassRow(item as Record<string, unknown>)) })
    }

    if ((data as BackendClassDetailResponse).ok && (data as BackendClassDetailResponse).data) {
      const payload = (data as BackendClassDetailResponse).data ?? {}
      const cls = payload.class ? mapClassRow(payload.class as Record<string, unknown>) : null
      const students = Array.isArray(payload.students) ? payload.students : []
      return NextResponse.json({ ok: true, data: { class: cls, students } })
    }

    return NextResponse.json(
      { ok: false, error: (data as BackendClassListResponse)?.error ?? "Unexpected response from backend" },
      { status: 502 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ ok: false, error: message || "Failed to load classes" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))

    const payload = {
      className: body?.class_name ?? body?.className ?? "",
      section: body?.section ?? null,
      subject: body?.subject ?? null,
      scheduleInfo: body?.schedule_info ?? body?.scheduleInfo ?? null,
    }

    const backendResponse = await fetch(buildBackendUrl("/classes"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = (await backendResponse.json().catch(() => null)) as BackendCreateClassResponse | null

    if (!backendResponse.ok || !data || !data.class) {
      return NextResponse.json(
        { ok: false, error: data?.error ?? "Unable to create class" },
        { status: backendResponse.status || 500 },
      )
    }

    const mapped = mapClassRow(data.class as Record<string, unknown>)
    return NextResponse.json({ ok: true, data: mapped }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ ok: false, error: message || "Failed to create class" }, { status: 500 })
  }
}
