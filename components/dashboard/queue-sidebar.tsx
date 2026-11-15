import { BarChart3, LayoutDashboard, Ticket } from "lucide-react"

import { cn } from "@/lib/utils"
import type { DemoQueue } from "@/lib/demo-data"

type QueueSidebarProps = {
  queues: DemoQueue[]
  selectedQueueId: string
  waitingByQueue: Record<string, number>
  onSelectQueue: (queueId: string) => void
}

const navigation = [
  { label: "Dashboard", href: "#overview", icon: LayoutDashboard },
  { label: "Analytics", href: "#analytics", icon: BarChart3 },
  { label: "Queue manager", href: "#queue-manager", icon: Ticket },
]

export function QueueSidebar({
  queues,
  selectedQueueId,
  waitingByQueue,
  onSelectQueue,
}: QueueSidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col bg-sidebar px-4 py-5 text-sidebar-foreground lg:flex">
      <a href="#overview" className="mb-10 flex items-center gap-3 px-2" aria-label="Queueflow dashboard">
        <span className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Ticket className="size-[18px]" strokeWidth={2.4} aria-hidden="true" />
        </span>
        <span className="text-[17px] font-semibold tracking-[-0.04em]">queueflow</span>
      </a>

      <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/45">
        Workspace
      </div>
      <nav aria-label="Main navigation" className="flex flex-col gap-1">
        {navigation.map(({ label, href, icon: Icon }, index) => (
          <a
            key={href}
            href={href}
            className={cn(
              "flex h-10 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              index === 0 && "bg-sidebar-accent text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-[17px] opacity-85" aria-hidden="true" />
            <span>{label}</span>
            {label === "Queue manager" && (
              <span className="ml-auto rounded-md bg-sidebar-foreground/10 px-1.5 py-0.5 text-[10px] tabular-nums text-sidebar-foreground/75">
                {queues.length}
              </span>
            )}
          </a>
        ))}
      </nav>

      <div className="mt-9 flex items-center justify-between px-2 pb-2">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/45">
          Your queues
        </div>
        <span className="text-[10px] text-sidebar-foreground/40">{queues.length}</span>
      </div>
      <div className="flex flex-col gap-1">
        {queues.map((queue) => {
          const selected = queue.id === selectedQueueId

          return (
            <button
              key={queue.id}
              type="button"
              onClick={() => onSelectQueue(queue.id)}
              aria-pressed={selected}
              className={cn(
                "flex h-9 items-center gap-3 rounded-xl px-3 text-left text-[12px] transition-colors hover:bg-sidebar-accent/80",
                selected && "bg-sidebar-accent text-sidebar-accent-foreground",
                !selected && "text-sidebar-foreground/75",
              )}
            >
              <span className={cn("size-2 rounded-full", queue.dotClass)} aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate">{queue.name}</span>
              <span className="text-[10px] tabular-nums text-sidebar-foreground/50">
                {waitingByQueue[queue.id] ?? 0}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-auto rounded-2xl border border-sidebar-border bg-sidebar-accent/50 p-3.5">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-sidebar-primary/15 text-[11px] font-semibold text-sidebar-primary">
            MJ
          </span>
          <div className="min-w-0">
            <div className="truncate text-xs font-medium">Maya Johnson</div>
            <div className="mt-0.5 text-[10px] text-sidebar-foreground/55">Demo manager</div>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-sidebar-border pt-3 text-[10px] text-sidebar-foreground/55">
          <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
          Northside Health · Demo
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 px-2 py-1.5 text-[10px] text-sidebar-foreground/45">
        <span className="size-1.5 rounded-full bg-sidebar-primary" aria-hidden="true" />
        Preview environment · demo data only
      </div>
    </aside>
  )
}
