'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, CheckCircle, Clock, AlertCircle, Newspaper } from 'lucide-react'

export default function StudentProfilePage() {
  const user = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || '{"name":"John Doe","email":"john@example.com","role":"STUDENT"}')
    : { name: 'John Doe', email: 'john@gmail.com' }

  const profile = {
    photoUrl: '',
    name: user.name || 'John Doe',
    email: user.email || 'john@gmail.com',
    phone: '+91-7011438731',
    enrollment: '2472',
    username: (user.name || 'john').toLowerCase().replace(/\s+/g, ''),
    course: 'B.Tech Computer Science',
    year: '2nd Year',
  }

  const navigation = [
    { name: 'Dashboard', href: '/student', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Attendance', href: '/student/attendance', icon: <CheckCircle className="h-5 w-5" /> },
    { name: 'Schedule', href: '/student/schedule', icon: <Clock className="h-5 w-5" /> },
    { name: 'Profile', href: '/student/profile', icon: <AlertCircle className="h-5 w-5" />, current: true },
    { name: 'Upcoming Exams', href: '/student/profile/upcoming-exams', icon: <Newspaper className="h-5 w-5" /> },
  ]

  const details = [
    { label: 'Phone', value: profile.phone },
    { label: 'Enrollment', value: profile.enrollment },
    { label: 'Username', value: profile.username },
    { label: 'Course', value: profile.course },
    { label: 'Year', value: profile.year },
  ]

  const initials = profile.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <DashboardLayout title="Profile" userType="student" navigation={navigation}>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-none shadow-sm lg:col-span-2">
          <CardContent className="space-y-8 p-6 sm:p-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.photoUrl} alt={profile.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-semibold text-gray-900">{profile.name}</h2>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {details.map((item) => (
                <ReadonlyField key={item.label} label={item.label} value={item.value} />
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              This profile is view-only. Updates can be made by the Admin from the Admin Panel.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-gray-900">Account Summary</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p><span className="font-medium text-gray-900">Role:</span> Student</p>
              <p><span className="font-medium text-gray-900">Course:</span> {profile.course}</p>
              <p><span className="font-medium text-gray-900">Year:</span> {profile.year}</p>
              <p><span className="font-medium text-gray-900">Enrollment No:</span> {profile.enrollment}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 rounded-xl border border-dashed border-gray-200 bg-white/60 p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm font-medium text-gray-900">{value}</div>
    </div>
  )
}
