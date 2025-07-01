import { DashboardLayout } from "@/components/dashboard-layout"
import { EmailVerificationBanner } from "@/components/email-verification-banner"

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <EmailVerificationBanner />

        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 flex items-center justify-center">
            <div className="text-center">
              <h3 className="font-semibold text-orange-900">Live Streams</h3>
              <p className="text-2xl font-bold text-orange-600">24</p>
            </div>
          </div>
          <div className="aspect-video rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex items-center justify-center">
            <div className="text-center">
              <h3 className="font-semibold text-blue-900">Total Views</h3>
              <p className="text-2xl font-bold text-blue-600">1.2M</p>
            </div>
          </div>
          <div className="aspect-video rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center">
            <div className="text-center">
              <h3 className="font-semibold text-green-900">Revenue</h3>
              <p className="text-2xl font-bold text-green-600">$45.2K</p>
            </div>
          </div>
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">RA</span>
            </div>
            <h2 className="text-2xl font-bold">Welcome to RunAsh AI</h2>
            <p className="text-muted-foreground max-w-md">
              Your AI-powered live streaming platform dashboard. Manage your streams, analyze performance, and grow your
              audience.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
