"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, Menu, X } from "lucide-react"

interface NavigationChildItem {
  name: string
  href: string
  current?: boolean
  icon?: React.ReactNode
}

interface NavigationItem {
  name: string
  href: string
  icon: React.ReactNode
  current?: boolean
  children?: NavigationChildItem[]
}

interface StoredUser {
  role: string
  username?: string
  name?: string
}

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  userType: "teacher" | "student" | "admin" | "mgmt" | "dept" | "policymaker"
  navigation: NavigationItem[]
}

export function DashboardLayout({ children, title, userType, navigation }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<StoredUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    const data = localStorage.getItem("user")
    if (!data) {
      router.push("/")
      return
    }

    try {
      const parsed = JSON.parse(data) as Partial<StoredUser>
      if (!parsed || typeof parsed.role !== "string") {
        throw new Error("invalid user payload")
      }

      const normalizedRoleKey = parsed.role.toUpperCase()
      const normalizedUser: StoredUser = {
        role: normalizedRoleKey,
        username: typeof parsed.username === "string" ? parsed.username : undefined,
        name: typeof parsed.name === "string" ? parsed.name : undefined,
      }

      setUser(normalizedUser)

      const roleMap: Record<string, DashboardLayoutProps["userType"]> = {
        STUDENT: "student",
        TEACHER: "teacher",
        ADMIN: "admin",
        MGMT: "mgmt",
        DEPT: "dept",
        POLICYMAKER: "policymaker",
      }

      const mappedRole = roleMap[normalizedRoleKey]
      if (!mappedRole || mappedRole !== userType) {
        router.push("/")
      }
    } catch {
      router.push("/")
    }
  }, [router, userType])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const profileNav = navigation.find((item) => item.name.toLowerCase() === "profile")
  const profileChild = profileNav?.children?.find((child) => child.current) ?? profileNav?.children?.[0]
  const fallbackProfileHref = `/${userType}/profile`
  const profileHref = profileNav?.href || profileChild?.href || fallbackProfileHref

  const avatarLabel = (user?.username || user?.name || "User").charAt(0).toUpperCase()

  const renderNavItems = (items: NavigationItem[]) =>
    items.map((item) => {
      const isActive = item.current || item.children?.some((child) => child.current)

      return (
        <div key={item.name} className="space-y-1">
          <a
            href={item.href}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-100 text-blue-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              {item.icon}
            </span>
            <span className="truncate">{item.name}</span>
          </a>
          {item.children && item.children.length > 0 ? (
            <div className="ml-12 space-y-1">
              {item.children.map((child) => (
                <a
                  key={child.name}
                  href={child.href}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                    child.current
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {child.icon ? (
                    <span className="inline-flex h-6 w-6 items-center justify-center text-blue-500">
                      {child.icon}
                    </span>
                  ) : (
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-400" aria-hidden="true" />
                  )}
                  <span className="truncate">{child.name}</span>
                </a>
              ))}
            </div>
          ) : null}
        </div>
      )
    })

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600/70" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-lg font-semibold text-gray-900">Attendify</h1>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 space-y-3 overflow-y-auto px-4 pb-6" onClick={() => setSidebarOpen(false)}>
            {renderNavItems(navigation)}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white shadow-sm">
          <div className="flex h-16 items-center px-6">
            <h1 className="text-xl font-semibold text-gray-900">Attendify</h1>
          </div>
          <nav className="flex-1 space-y-3 overflow-y-auto px-4 pb-8">
            {renderNavItems(navigation)}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-72">
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Toggle sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <span className="text-lg font-semibold text-gray-900">Attendify</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full border border-transparent hover:border-blue-200"
                onClick={() => router.push(profileHref)}
                aria-label="Go to profile"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{avatarLabel}</AvatarFallback>
                </Avatar>
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-gray-50">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

