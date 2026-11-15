import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Ticket,
  UsersRound,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

type MetricsOverviewProps = {
  peopleWaiting: number
  servedToday: number
  liveQueues: number
}

export function MetricsOverview({
  peopleWaiting,
  servedToday,
  liveQueues,
}: MetricsOverviewProps) {
  const metrics = [
    {
      label: "People waiting",
      value: String(peopleWaiting).padStart(2, "0"),
      helper: "across all queues",
      change: "4.8%",
      positive: false,
      icon: UsersRound,
      iconClass: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Avg. wait time",
      value: "12m 24s",
      helper: "vs. 14m yesterday",
      change: "11.6%",
      positive: true,
      icon: Clock3,
      iconClass: "bg-sky-50 text-sky-700",
    },
    {
      label: "Served today",
      value: String(servedToday),
      helper: "since 8:00 AM",
      change: "8.2%",
      positive: true,
      icon: CheckCircle2,
      iconClass: "bg-violet-50 text-violet-700",
    },
    {
      label: "Active queues",
      value: String(liveQueues).padStart(2, "0"),
      helper: "all systems running",
      change: "Live",
      positive: true,
      icon: Ticket,
      iconClass: "bg-amber-50 text-amber-700",
    },
  ]

  return (
    <section aria-label="Today's queue metrics" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {metrics.map(({ label, value, helper, change, positive, icon: Icon, iconClass }) => (
        <Card key={label} className="rounded-2xl border border-[#e8ece7] bg-white shadow-[0_1px_2px_rgba(22,44,38,0.03)] [--card-spacing:0px]">
          <CardContent className="p-4 sm:p-[18px]">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">{label}</p>
                <p className="mt-2 text-[22px] font-semibold leading-none tracking-[-0.055em] text-foreground sm:text-[25px]">{value}</p>
              </div>
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
                <Icon className="size-4" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="truncate text-[10px] text-muted-foreground sm:text-[11px]">{helper}</span>
              <span className={`inline-flex shrink-0 items-center gap-0.5 text-[10px] font-semibold ${positive ? "text-emerald-700" : "text-amber-700"}`}>
                {change !== "Live" && (positive ? <ArrowDownRight className="size-3" aria-hidden="true" /> : <ArrowUpRight className="size-3" aria-hidden="true" />)}
                {change}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
