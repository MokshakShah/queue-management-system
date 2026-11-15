"use client"

import { useState, type FormEvent } from "react"
import { CalendarDays, Plus, Sparkles, Ticket } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { AnalyticsPanels } from "@/components/dashboard/analytics-panels"
import { MetricsOverview } from "@/components/dashboard/metrics-overview"
import { QueueManager } from "@/components/dashboard/queue-manager"
import { QueueSidebar } from "@/components/dashboard/queue-sidebar"
import { INITIAL_QUEUES, type DemoQueue, type QueueToken } from "@/lib/demo-data"

export function QueueDashboard() {
  const [queues, setQueues] = useState<DemoQueue[]>(() => INITIAL_QUEUES)
  const [selectedQueueId, setSelectedQueueId] = useState("general")
  const [servedToday, setServedToday] = useState(128)
  const [dialog, setDialog] = useState<"person" | "queue" | null>(null)
  const [queueError, setQueueError] = useState("")
  const waitingByQueue = Object.fromEntries(
    queues.map((queue) => [queue.id, queue.tokens.filter((token) => token.status === "waiting").length]),
  )
  const peopleWaiting = Object.values(waitingByQueue).reduce((total, count) => total + count, 0)

  function addPerson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const personName = formData.get("personName")

    if (typeof personName !== "string" || !personName.trim()) return

    setQueues((currentQueues) => currentQueues.map((queue) => {
      if (queue.id !== selectedQueueId) return queue

      const sequence = queue.nextNumber
      const token: QueueToken = {
        id: `${queue.id}-${sequence}`,
        tokenNumber: `${queue.code}-${String(sequence).padStart(3, "0")}`,
        personName: personName.trim(),
        status: "waiting",
        arrival: "Just now",
        waitingMinutes: 0,
      }

      return { ...queue, nextNumber: sequence + 1, tokens: [...queue.tokens, token] }
    }))
    event.currentTarget.reset()
    setDialog(null)
  }

  function addQueue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const queueName = formData.get("queueName")

    if (typeof queueName !== "string" || !queueName.trim()) return
    const name = queueName.trim()

    if (queues.some((queue) => queue.name.toLowerCase() === name.toLowerCase())) {
      setQueueError("A queue with that name already exists.")
      return
    }

    const code = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "Q"
    const newQueue: DemoQueue = {
      id: `queue-${Date.now()}`,
      name,
      code,
      dotClass: "bg-teal-500",
      averageWaitMinutes: 0,
      nextNumber: 1,
      tokens: [],
    }

    setQueues((currentQueues) => [...currentQueues, newQueue])
    setSelectedQueueId(newQueue.id)
    setQueueError("")
    setDialog(null)
  }

  function moveToken(queueId: string, tokenId: string, direction: -1 | 1) {
    setQueues((currentQueues) => currentQueues.map((queue) => {
      if (queue.id !== queueId) return queue

      const waitingTokens = queue.tokens.filter((token) => token.status === "waiting")
      const currentIndex = waitingTokens.findIndex((token) => token.id === tokenId)
      const nextIndex = currentIndex + direction

      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= waitingTokens.length) return queue

      ;[waitingTokens[currentIndex], waitingTokens[nextIndex]] = [waitingTokens[nextIndex], waitingTokens[currentIndex]]
      let waitingIndex = 0
      const tokens = queue.tokens.map((token) => token.status === "waiting" ? waitingTokens[waitingIndex++] : token)

      return { ...queue, tokens }
    }))
  }

  function cancelToken(queueId: string, tokenId: string) {
    setQueues((currentQueues) => currentQueues.map((queue) => queue.id !== queueId ? queue : {
      ...queue,
      tokens: queue.tokens.map((token) => token.id === tokenId && token.status === "waiting" ? { ...token, status: "cancelled" } : token),
    }))
  }

  function callNext(queueId: string) {
    setQueues((currentQueues) => currentQueues.map((queue) => {
      if (queue.id !== queueId || queue.tokens.some((token) => token.status === "in_service")) return queue
      const nextToken = queue.tokens.find((token) => token.status === "waiting")
      if (!nextToken) return queue

      return {
        ...queue,
        tokens: queue.tokens.map((token) => token.id === nextToken.id ? { ...token, status: "in_service" } : token),
      }
    }))
  }

  function completeCurrent(queueId: string) {
    const queue = queues.find((item) => item.id === queueId)
    const servingToken = queue?.tokens.find((token) => token.status === "in_service")
    if (!servingToken) return

    setQueues((currentQueues) => currentQueues.map((item) => item.id !== queueId ? item : {
      ...item,
      tokens: item.tokens.map((token) => token.id === servingToken.id ? { ...token, status: "completed" } : token),
    }))
    setServedToday((count) => count + 1)
  }

  function openQueueDialog() {
    setQueueError("")
    setDialog("queue")
  }

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      <QueueSidebar
        queues={queues}
        selectedQueueId={selectedQueueId}
        waitingByQueue={waitingByQueue}
        onSelectQueue={setSelectedQueueId}
      />

      <div className="min-w-0 flex-1">
        <header className="flex h-[58px] items-center justify-between border-b border-[#e9ede8] bg-white/80 px-4 backdrop-blur-sm sm:px-6 lg:hidden">
          <a href="#overview" className="flex items-center gap-2.5" aria-label="Queueflow dashboard">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Ticket className="size-4" aria-hidden="true" /></span>
            <span className="text-[15px] font-semibold tracking-[-0.04em]">queueflow</span>
          </a>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-semibold text-amber-800">DEMO MODE</span>
        </header>

        <main id="overview" className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 hidden items-center gap-2 text-[10px] text-muted-foreground lg:flex">
                <span>Northside Health</span><span aria-hidden="true">/</span><span className="text-foreground">Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-[25px] font-semibold leading-tight tracking-[-0.06em] sm:text-[29px]">Good morning, Maya</h1>
                <span className="hidden rounded-full border border-[#e8ece7] bg-white px-2 py-1 text-[9px] font-medium text-muted-foreground sm:inline-flex">Front desk</span>
              </div>
              <p className="mt-1.5 max-w-[560px] text-[11px] leading-5 text-muted-foreground sm:text-xs">Keep the line moving. Here&apos;s what&apos;s happening across your queues today.</p>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="hidden items-center gap-2 rounded-xl border border-[#e8ece7] bg-white px-3 py-2 text-[10px] text-muted-foreground sm:flex">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                <span>Today · All teams</span>
              </div>
              <Button size="sm" className="h-9 rounded-xl px-3 text-[11px]" onClick={() => setDialog("person")}>
                <Plus aria-hidden="true" /> Add person
              </Button>
            </div>
          </header>

          <div role="status" className="flex items-start gap-3 rounded-xl border border-[#f0dfb9] bg-[#fff9eb] px-3.5 py-3 text-[#705726] sm:items-center sm:px-4">
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#f8eacb] sm:mt-0"><Sparkles className="size-3.5" aria-hidden="true" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold sm:text-[11px]">Demo workspace · changes are temporary</p>
              <p className="mt-0.5 text-[9px] leading-4 text-[#866f45] sm:text-[10px]">Queue actions work in this session, but refresh resets the sample data. Login and database saving are not enabled.</p>
            </div>
            <span className="hidden rounded-full border border-[#ead8ad] px-2 py-1 text-[9px] font-semibold sm:inline-flex">PREVIEW</span>
          </div>

          <MetricsOverview peopleWaiting={peopleWaiting} servedToday={servedToday} liveQueues={queues.length} />
          <AnalyticsPanels />
          <QueueManager
            queues={queues}
            selectedQueueId={selectedQueueId}
            onSelectQueue={setSelectedQueueId}
            onOpenAddPerson={() => setDialog("person")}
            onOpenAddQueue={openQueueDialog}
            onCallNext={callNext}
            onCompleteCurrent={completeCurrent}
            onMoveToken={moveToken}
            onCancelToken={cancelToken}
          />

          <footer className="flex flex-col items-center justify-between gap-2 pb-2 pt-1 text-[9px] text-muted-foreground sm:flex-row">
            <span>Queueflow · Interactive demo</span>
            <span>Sample names and analytics are illustrative.</span>
          </footer>
        </main>
      </div>

      <Dialog open={dialog === "person"} onOpenChange={(open) => setDialog(open ? "person" : null)}>
        <DialogContent className="rounded-2xl border border-[#e8ece7] p-5 sm:max-w-[390px]">
          <DialogHeader>
            <DialogTitle className="text-[17px] font-semibold tracking-[-0.035em]">Add someone to {queues.find((queue) => queue.id === selectedQueueId)?.name ?? "queue"}</DialogTitle>
            <DialogDescription className="text-[11px] leading-5">Create a new token and place it at the end of the waiting line.</DialogDescription>
          </DialogHeader>
          <form onSubmit={addPerson} className="mt-2 flex flex-col gap-3">
            <label htmlFor="personName" className="text-[10px] font-medium text-foreground">Person&apos;s name</label>
            <Input id="personName" name="personName" autoFocus required maxLength={80} placeholder="e.g. Jordan Lee" className="h-9 rounded-lg text-[11px]" />
            <DialogFooter className="mt-2 border-t-0 bg-transparent p-0">
              <Button type="button" variant="outline" size="sm" className="h-8 rounded-lg text-[10px]" onClick={() => setDialog(null)}>Cancel</Button>
              <Button type="submit" size="sm" className="h-8 rounded-lg text-[10px]"><Plus aria-hidden="true" /> Create token</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "queue"} onOpenChange={(open) => setDialog(open ? "queue" : null)}>
        <DialogContent className="rounded-2xl border border-[#e8ece7] p-5 sm:max-w-[390px]">
          <DialogHeader>
            <DialogTitle className="text-[17px] font-semibold tracking-[-0.035em]">Create a queue</DialogTitle>
            <DialogDescription className="text-[11px] leading-5">Give this line a clear name. You can add people as soon as it&apos;s created.</DialogDescription>
          </DialogHeader>
          <form onSubmit={addQueue} className="mt-2 flex flex-col gap-3">
            <label htmlFor="queueName" className="text-[10px] font-medium text-foreground">Queue name</label>
            <Input id="queueName" name="queueName" autoFocus required maxLength={36} placeholder="e.g. Pharmacy pickup" aria-invalid={Boolean(queueError)} onChange={() => setQueueError("")} className="h-9 rounded-lg text-[11px]" />
            {queueError && <p role="alert" className="text-[10px] text-destructive">{queueError}</p>}
            <DialogFooter className="mt-2 border-t-0 bg-transparent p-0">
              <Button type="button" variant="outline" size="sm" className="h-8 rounded-lg text-[10px]" onClick={() => setDialog(null)}>Cancel</Button>
              <Button type="submit" size="sm" className="h-8 rounded-lg text-[10px]"><Plus aria-hidden="true" /> Create queue</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
