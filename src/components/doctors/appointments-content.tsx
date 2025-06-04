"use client"

import { useState, useEffect, useMemo } from "react"
import { useAppointmentStore } from "@/stores/docAppointment/useDoctorAppointmentsStore"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Calendar,
  Clock,
  Phone,
  Video,
  User,
  MoreHorizontal,
  MessageCircle,
  Filter,
  CalendarDays,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-hot-toast"

interface Appointment {
  _id: string
  user: { username: string; email: string }
  doctor: { name: string; specialty: string; rate: number }
  date: string
  mode?: string
  status?: string
  reason?: string
}

interface AppointmentsContentProps {
  doctorId?: string
}

const APPOINTMENT_STATUSES = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-800 border-amber-200", icon: AlertCircle },
  confirmed: { label: "Confirmed", color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: CheckCircle },
  completed: { label: "Completed", color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
}

const CONSULTATION_MODES = {
  "Online": { icon: Video, color: "text-blue-600" },
  "In-person": { icon: User, color: "text-purple-600" },
}

export function AppointmentsContent({ doctorId }: AppointmentsContentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { appointments, loading, error, fetchAppointmentsByDoctorId, approveAppointment, markBusyAppointment } =
    useAppointmentStore()

  useEffect(() => {
    if (doctorId) {
      fetchAppointmentsByDoctorId(doctorId)
    }
  }, [doctorId, fetchAppointmentsByDoctorId])

  const { upcomingAppointments, stats } = useMemo(() => {
    const now = new Date()
    const upcoming = appointments?.filter((appt: Appointment) => new Date(appt.date) >= now) || []

    const stats = {
      total: appointments?.length || 0,
      pending: appointments?.filter((appt: Appointment) => appt.status === "pending").length || 0,
      confirmed: appointments?.filter((appt: Appointment) => appt.status === "confirmed").length || 0,
      completed: appointments?.filter((appt: Appointment) => appt.status === "completed").length || 0,
    }

    return { upcomingAppointments: upcoming, stats }
  }, [appointments])

  const filterAppointments = (appts: Appointment[]) => {
    return appts?.filter((appt) => {
      const matchesSearch =
        appt.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (appt.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

      const matchesStatus = statusFilter === "all" || appt.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }

  const formatDateTime = (iso: string) => {
    const date = new Date(iso)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const isToday = date.toDateString() === today.toDateString()
    const isTomorrow = date.toDateString() === tomorrow.toDateString()

    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    if (isToday) return `Today, ${time}`
    if (isTomorrow) return `Tomorrow, ${time}`

    return `${date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    })}, ${time}`
  }

  const handleAction = async (action: "approve" | "busy", appointmentId: string) => {
    try {
      if (action === "approve") {
        await approveAppointment(appointmentId)
        toast.success("Appointment approved successfully!")
      } else {
        await markBusyAppointment(appointmentId)
        toast.success("Patient notified of unavailability")
      }
    } catch (error) {
      toast.error(`Failed to ${action} appointment`)
    }
  }

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const status =
      APPOINTMENT_STATUSES[appointment.status as keyof typeof APPOINTMENT_STATUSES] || APPOINTMENT_STATUSES.pending
    const mode =
      CONSULTATION_MODES[appointment.mode as keyof typeof CONSULTATION_MODES] || CONSULTATION_MODES["In-person"]
    const StatusIcon = status.icon
    const ModeIcon = mode.icon

    return (
      <Card className="group hover:shadow-md transition-all duration-200 border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <Avatar className="h-12 w-12 ring-2 ring-gray-100">
                <AvatarImage src="/placeholder.svg" alt={appointment.user.username} />
                <AvatarFallback className="bg-curex/10 text-curex font-semibold">
                  {appointment.user.username
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {appointment.user.username.charAt(0).toUpperCase() + appointment.user.username.slice(1)}
                  </h3>
                  <Badge variant="outline" className={`${status.color} border text-xs font-medium`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                  {appointment.reason || "General consultation"}
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDateTime(appointment.date)}
                  </div>
                  <div className="flex items-center">
                    <ModeIcon className={`w-4 h-4 mr-1 ${mode.color}`} />
                    {appointment.mode || "In-person"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              {appointment.status === "confirmed" && (
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="hover:bg-curex/10 hover:text-curex">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                  {appointment.mode === "Video Call" && (
                    <Button size="sm" className="bg-curex hover:bg-curex/90">
                      <Video className="w-4 h-4 mr-1" />
                      Join Call
                    </Button>
                  )}
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedAppointment(appointment)
                      setIsModalOpen(true)
                    }}
                  >
                    View Details
                  </DropdownMenuItem>
                  {appointment.status === "pending" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleAction("approve", appointment._id)}
                        className="text-green-600"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction("busy", appointment._id)} className="text-red-600">
                        <XCircle className="w-4 h-4 mr-2" />
                        Mark as Busy
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const EmptyState = ({ message }: { message: string }) => (
    <Card className="border-dashed border-2 border-gray-200">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <CalendarDays className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-500 text-center">{message}</p>
      </CardContent>
    </Card>
  )

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-600">
            <XCircle className="w-5 h-5" />
            <p className="font-medium">Error loading appointments</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-curex" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search patients or reasons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-curex hover:bg-curex/90" disabled={loading}>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule New
        </Button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <CalendarDays className="w-5 h-5 text-curex" />
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments ({upcomingAppointments.length})</h2>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : filterAppointments(upcomingAppointments).length === 0 ? (
          <EmptyState message="No upcoming appointments found. Schedule your first appointment to get started." />
        ) : (
          <div className="space-y-4">
            {filterAppointments(upcomingAppointments).map((appointment) => (
              <AppointmentCard key={appointment._id} appointment={appointment} />
            ))}
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>Complete information about this appointment</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Patient</label>
                  <p className="text-sm text-gray-900">
                    {selectedAppointment.user.username.charAt(0).toUpperCase() +
                      selectedAppointment.user.username.slice(1)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date & Time</label>
                  <p className="text-sm text-gray-900">{formatDateTime(selectedAppointment.date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Mode</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.mode || "In-person"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <Badge
                    className={
                      APPOINTMENT_STATUSES[selectedAppointment.status as keyof typeof APPOINTMENT_STATUSES]?.color ||
                      "bg-gray-100 text-gray-800"
                    }
                  >
                    {selectedAppointment.status || "Unknown"}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Doctor Rate</label>
                  <p className="text-sm text-gray-900">${selectedAppointment.doctor.rate}</p>
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-600">Reason for Visit</label>
                <p className="text-sm text-gray-900 mt-1">{selectedAppointment.reason || "General consultation"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
