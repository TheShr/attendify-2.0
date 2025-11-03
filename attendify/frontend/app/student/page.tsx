"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AttendanceOverview } from "@/components/student/attendance-overview"
import { ClassSchedule } from "@/components/student/class-schedule"
import { AttendanceRecord } from "@/components/student/attendance-record"
import { LocationStatus } from "@/components/student/location-status"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, CheckCircle, AlertCircle, Newspaper } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/student", icon: <Calendar className="h-5 w-5" />, current: true },
  { name: "Attendance", href: "/student/attendance", icon: <CheckCircle className="h-5 w-5" /> },
  { name: "Schedule", href: "/student/schedule", icon: <Clock className="h-5 w-5" /> },
  { name: "Profile", href: "/student/profile", icon: <AlertCircle className="h-5 w-5" /> },
  { name: "Upcoming Exams", href: "/student/profile/upcoming-exams", icon: <Newspaper className="h-5 w-5" /> },
]

const stats = [
  {
    title: "Overall Attendance",
    value: "87%",
    helper: "+2% from last month",
    icon: CheckCircle,
  },
  {
    title: "Classes Attended",
    value: "42",
    helper: "Out of 48 total",
    icon: Calendar,
  },
  {
    title: "This Week",
    value: "5/6",
    helper: "Classes attended",
    icon: Clock,
  },
  {
    title: "Streak",
    value: "12",
    helper: "Days consecutive",
    icon: AlertCircle,
  },
]

export default function StudentDashboard() {
  return (
    <DashboardLayout title="Student Dashboard" userType="student" navigation={navigation}>
      <div className="space-y-10">
        <section>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title} className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="mt-3 text-3xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <stat.icon className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">{stat.helper}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <AttendanceOverview refreshToken={0} />
            <AttendanceRecord refreshToken={0} />
          </div>
          <div className="space-y-6 lg:col-span-4">
            <LocationStatus />
            <ClassSchedule />
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
