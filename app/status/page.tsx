import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, Clock, ArrowDownCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

// Mock data for the status page
const services = [
  {
    name: "Streaming API",
    status: "operational",
    uptime: "99.99%",
    lastIncident: "None in last 90 days",
  },
  {
    name: "WebRTC Service",
    status: "operational",
    uptime: "99.95%",
    lastIncident: "3 days ago",
  },
  {
    name: "Authentication",
    status: "operational",
    uptime: "99.99%",
    lastIncident: "None in last 90 days",
  },
  {
    name: "Analytics Engine",
    status: "operational",
    uptime: "99.98%",
    lastIncident: "12 days ago",
  },
  {
    name: "AI Processing",
    status: "operational",
    uptime: "99.90%",
    lastIncident: "7 days ago",
  },
  {
    name: "CDN",
    status: "operational",
    uptime: "99.99%",
    lastIncident: "None in last 90 days",
  },
  {
    name: "Database",
    status: "operational",
    uptime: "99.99%",
    lastIncident: "None in last 90 days",
  },
  {
    name: "Storage",
    status: "operational",
    uptime: "99.99%",
    lastIncident: "None in last 90 days",
  },
]

const incidents = [
  {
    id: "inc-001",
    title: "WebRTC Connection Issues",
    date: "June 1, 2025",
    status: "resolved",
    description:
      "Some users experienced difficulties establishing WebRTC connections. The issue was resolved by updating TURN server configurations.",
    updates: [
      {
        time: "10:15 AM",
        message: "Issue identified: Users reporting connection failures in certain network environments.",
      },
      {
        time: "10:45 AM",
        message: "Investigation: Determined that TURN server capacity was insufficient for current load.",
      },
      {
        time: "11:30 AM",
        message: "Mitigation: Added additional TURN server capacity and optimized connection handling.",
      },
      { time: "12:15 PM", message: "Resolution: All systems operational. Monitoring for any further issues." },
    ],
  },
  {
    id: "inc-002",
    title: "AI Processing Delays",
    date: "May 25, 2025",
    status: "resolved",
    description:
      "AI-powered video enhancements experienced processing delays affecting stream quality. The issue was resolved by scaling up processing resources.",
    updates: [
      { time: "3:20 PM", message: "Issue identified: Users reporting delayed AI enhancements during streams." },
      { time: "3:45 PM", message: "Investigation: High load on AI processing cluster causing queuing delays." },
      { time: "4:30 PM", message: "Mitigation: Scaled up processing resources and optimized workload distribution." },
      {
        time: "5:15 PM",
        message: "Resolution: Processing times returned to normal. Implemented additional monitoring.",
      },
    ],
  },
  {
    id: "inc-003",
    title: "Analytics Data Processing Delay",
    date: "May 19, 2025",
    status: "resolved",
    description:
      "Analytics data processing experienced delays, causing dashboard updates to be delayed by up to 30 minutes.",
    updates: [
      { time: "9:10 AM", message: "Issue identified: Analytics dashboards showing stale data." },
      {
        time: "9:30 AM",
        message: "Investigation: Data processing pipeline experiencing backlog due to database performance.",
      },
      { time: "10:45 AM", message: "Mitigation: Optimized database queries and increased processing capacity." },
      { time: "11:30 AM", message: "Resolution: Data processing returned to normal with 5-minute update intervals." },
    ],
  },
]

const maintenanceEvents = [
  {
    id: "maint-001",
    title: "Scheduled Database Maintenance",
    date: "June 10, 2025",
    time: "2:00 AM - 4:00 AM UTC",
    status: "upcoming",
    description:
      "We will be performing database optimizations to improve performance. Brief interruptions to analytics may occur during this window.",
  },
  {
    id: "maint-002",
    title: "CDN Infrastructure Upgrade",
    date: "June 15, 2025",
    time: "1:00 AM - 3:00 AM UTC",
    status: "upcoming",
    description:
      "We are upgrading our CDN infrastructure to improve global delivery speeds. No service interruptions are expected.",
  },
]

export default function StatusPage() {
  // Calculate overall system status
  const allOperational = services.every((service) => service.status === "operational")

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">RunAsh System Status</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Current status of all RunAsh services and components
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                Back to Home
              </Link>
              <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Current Status */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <CardTitle>Current Status</CardTitle>
            <CardDescription>Last updated: {new Date().toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-6">
              {allOperational ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <h3 className="font-medium text-lg">All Systems Operational</h3>
                    <p className="text-gray-600 dark:text-gray-400">All RunAsh services are operating normally</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="h-6 w-6 text-amber-500" />
                  <div>
                    <h3 className="font-medium text-lg">Partial System Outage</h3>
                    <p className="text-gray-600 dark:text-gray-400">Some RunAsh services are experiencing issues</p>
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((service) => (
                <div key={service.name} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{service.name}</h3>
                    <StatusBadge status={service.status} />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Uptime: {service.uptime}</p>
                    <p>Last incident: {service.lastIncident}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Incidents & Maintenance */}
        <Tabs defaultValue="incidents" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="incidents">Recent Incidents</TabsTrigger>
            <TabsTrigger value="maintenance">Scheduled Maintenance</TabsTrigger>
          </TabsList>

          <TabsContent value="incidents">
            <Card>
              <CardHeader>
                <CardTitle>Recent Incidents</CardTitle>
                <CardDescription>History of recent service disruptions and their resolutions</CardDescription>
              </CardHeader>
              <CardContent>
                {incidents.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No incidents reported</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      All systems have been operational for the past 90 days
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {incidents.map((incident) => (
                      <div
                        key={incident.id}
                        className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0"
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                          <div>
                            <h3 className="font-medium text-lg">{incident.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{incident.date}</p>
                          </div>
                          <StatusBadge status={incident.status} />
                        </div>
                        <p className="mb-4">{incident.description}</p>

                        <h4 className="font-medium mb-2 text-sm text-gray-700 dark:text-gray-300">Updates</h4>
                        <div className="space-y-3">
                          {incident.updates.map((update, index) => (
                            <div key={index} className="flex gap-3">
                              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 w-20 flex-shrink-0">
                                {update.time}
                              </div>
                              <div className="text-sm">{update.message}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Maintenance</CardTitle>
                <CardDescription>Upcoming maintenance events that may affect service availability</CardDescription>
              </CardHeader>
              <CardContent>
                {maintenanceEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No scheduled maintenance</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      There are no upcoming maintenance events scheduled
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {maintenanceEvents.map((event) => (
                      <div
                        key={event.id}
                        className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0"
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                          <div>
                            <h3 className="font-medium text-lg">{event.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              {event.date} • {event.time}
                            </p>
                          </div>
                          <MaintenanceBadge status={event.status} />
                        </div>
                        <p>{event.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Subscribe to Updates */}
        <Card>
          <CardHeader>
            <CardTitle>Subscribe to Status Updates</CardTitle>
            <CardDescription>Get notified when there are changes to our system status</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex-grow"
                required
              />
              <select className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                <option value="all">All updates</option>
                <option value="incidents">Incidents only</option>
                <option value="maintenance">Maintenance only</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

// Helper components
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "operational":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
        >
          <CheckCircle className="h-3 w-3 mr-1" /> Operational
        </Badge>
      )
    case "degraded":
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
        >
          <AlertCircle className="h-3 w-3 mr-1" /> Degraded
        </Badge>
      )
    case "outage":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
        >
          <ArrowDownCircle className="h-3 w-3 mr-1" /> Outage
        </Badge>
      )
    case "resolved":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
        >
          <CheckCircle className="h-3 w-3 mr-1" /> Resolved
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function MaintenanceBadge({ status }: { status: string }) {
  switch (status) {
    case "upcoming":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
        >
          <Clock className="h-3 w-3 mr-1" /> Upcoming
        </Badge>
      )
    case "in-progress":
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
        >
          <RefreshCw className="h-3 w-3 mr-1" /> In Progress
        </Badge>
      )
    case "completed":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
        >
          <CheckCircle className="h-3 w-3 mr-1" /> Completed
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}
