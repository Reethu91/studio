
import Link from "next/link"
import {
  Home,
  LineChart,
  Package,
  Package2,
  Users,
  ChevronRight,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 relative group">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('https://picsum.photos/seed/analytics/1920/1080')" }}
        data-ai-hint="charts graphs"
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>
       <aside className="fixed inset-y-0 left-0 z-10 w-14 flex-col border-r bg-background/80 backdrop-blur-sm sm:flex transition-all duration-300 ease-in-out group-hover:w-56">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5 h-full">
           <Link
              href="/dashboard"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base mb-4"
            >
              <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
              <span className="sr-only">CropClaim AI</span>
            </Link>
            <div className="flex flex-col items-start gap-2 w-full">
              <Link
                href="/dashboard"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-5 w-5" />
                <span className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Dashboard</span>
              </Link>
              <Link
                href="/customers"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <Users className="h-5 w-5" />
                <span className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Customers</span>
              </Link>
              <Link
                href="/analytics"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-accent text-accent-foreground transition-all hover:text-primary"
              >
                <LineChart className="h-5 w-5" />
                <span className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Analytics</span>
              </Link>
            </div>
          <div className="mt-auto flex items-center justify-center p-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <ChevronRight className="h-6 w-6 transform rotate-180" />
          </div>
        </nav>
      </aside>
       <main className="flex flex-1 flex-col gap-4 p-4 sm:py-4 z-10 items-center justify-center sm:pl-14 transition-all duration-300 ease-in-out group-hover:sm:pl-56">
        <Card className="bg-background/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-3xl">Analytics</CardTitle>
                <CardDescription>
                This feature is coming soon.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>The analytics dashboard is currently under development. Stay tuned!</p>
            </CardContent>
        </Card>
      </main>
    </div>
  )
}

    