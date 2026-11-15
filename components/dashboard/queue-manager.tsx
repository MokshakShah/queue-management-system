"use client"

import { useState } from "react"
import {
  ArrowRight,
  Check,
  Clock3,
  MoveDown,
  MoveUp,
  Plus,
  Search,
  Ticket,
  UsersRound,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { DemoQueue } from "@/lib/demo-data"

export type QueueManagerProps = {
  queues: DemoQueue[]
  selectedQueueId: string
  onSelectQueue: (queueId: string) => void
  onOpenAddPerson: () => void
  onOpenAddQueue: () => void
  onCallNext: (queueId: string) => void
  onCompleteCurrent: (queueId: string) => void
  onMoveToken: (queueId: string, tokenId: string, direction: -1 | 1) => void
  onCancelToken: (queueId: string, tokenId: string) => void
}

export function QueueManager({
  queues,
  selectedQueueId,
  onSelectQueue,
  onOpenAddPerson,
  onOpenAddQueue,
  onCallNext,
  onCompleteCurrent,
  onMoveToken,
  onCancelToken,
}: QueueManagerProps) {
  const [search, setSearch] = useState("")
  const queue = queues.find((item) => item.id === selectedQueueId) ?? queues[0]

  if (!queue) return null

  const waitingTokens = queue.tokens.filter((token) => token.status === "waiting")
  const servingToken = queue.tokens.find((token) => token.status === "in_service")
  const nextToken = waitingTokens[0]
  const normalizedSearch = search.trim().toLowerCase()
  const visibleTokens = waitingTokens.filter((token) =>
    `${token.personName} ${token.tokenNumber}`.toLowerCase().includes(normalizedSearch),
  )

  return (
    <section id="queue-manager" aria-labelledby="queue-manager-title" className="scroll-mt-6">
      <Card className="rounded-2xl border border-[#e8ece7] bg-white shadow-[0_1px_2px_rgba(22,44,38,0.03)] [--card-spacing:0px]">
        <CardHeader className="flex flex-col gap-3 border-b border-[#eef1ed] px-4 pt-4 pb-4 sm:px-5 sm:pt-5 sm:pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle id="queue-manager-title" className="text-[15px] font-semibold tracking-[-0.03em]">Queue manager</CardTitle>
              <Badge variant="outline" className="h-5 rounded-full border-emerald-200 bg-emerald-50 px-2 text-[9px] font-semibold text-emerald-700">LIVE</Badge>
            </div>
            <CardDescription className="mt-1 text-[11px]">Manage arrivals, order, and service in one place.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 rounded-lg border-[#e4e9e4] px-2.5 text-[11px]" onClick={onOpenAddQueue}>
              <Plus aria-hidden="true" />
              Add queue
            </Button>
            <Button size="sm" className="h-8 rounded-lg px-2.5 text-[11px]" onClick={onOpenAddPerson}>
              <Plus aria-hidden="true" />
              Add person
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex gap-1 overflow-x-auto border-b border-[#eef1ed] px-4 pt-2.5 sm:px-5" aria-label="Choose a queue">
            {queues.map((item) => {
              const selected = item.id === queue.id
              const waitingCount = item.tokens.filter((token) => token.status === "waiting").length

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelectQueue(item.id)}
                  className={`relative flex shrink-0 items-center gap-2 rounded-t-lg px-3 py-2.5 text-[11px] font-medium transition-colors ${selected ? "text-primary" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`}
                >
                  <span className={`size-2 rounded-full ${item.dotClass}`} aria-hidden="true" />
                  {item.name}
                  <span className={`rounded-md px-1.5 py-0.5 text-[9px] tabular-nums ${selected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{waitingCount}</span>
                  {selected && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary" aria-hidden="true" />}
                </button>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.8fr)]">
            <div className="min-w-0 p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-[13px] font-semibold text-foreground">{queue.name} queue</h3>
                  <p className="mt-1 text-[10px] text-muted-foreground">{waitingTokens.length} {waitingTokens.length === 1 ? "person" : "people"} waiting · Avg. wait {queue.averageWaitMinutes} min</p>
                </div>
                <label className="relative w-full sm:w-[188px]">
                  <span className="sr-only">Search people in {queue.name}</span>
                  <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search people..." className="h-8 rounded-lg border-[#e7ebe6] bg-[#fcfdfb] pl-8 text-[10px] shadow-none placeholder:text-muted-foreground/70" />
                </label>
              </div>

              {visibleTokens.length > 0 ? (
                <div className="flex flex-col">
                  <div className="grid grid-cols-[34px_minmax(0,1fr)_54px_82px] gap-2 border-b border-[#edf0ec] px-1 pb-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/75 sm:grid-cols-[36px_minmax(0,1fr)_70px_108px]">
                    <span>Pos.</span>
                    <span>Person</span>
                    <span className="text-right sm:text-left">Wait</span>
                    <span className="text-right">Actions</span>
                  </div>
                  <ol aria-label={`${queue.name} people waiting`} className="flex flex-col">
                    {visibleTokens.map((token) => {
                      const position = waitingTokens.findIndex((item) => item.id === token.id)
                      const initials = token.personName.split(" ").map((part) => part[0]).slice(0, 2).join("")

                      return (
                        <li key={token.id} className="grid grid-cols-[34px_minmax(0,1fr)_54px_82px] items-center gap-2 border-b border-[#f0f2ef] px-1 py-2.5 last:border-0 sm:grid-cols-[36px_minmax(0,1fr)_70px_108px]">
                          <span className="flex size-7 items-center justify-center rounded-lg bg-[#f1f5f1] text-[10px] font-semibold tabular-nums text-muted-foreground">{String(position + 1).padStart(2, "0")}</span>
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span className="hidden size-7 shrink-0 items-center justify-center rounded-full bg-[#eaf2ed] text-[9px] font-semibold text-primary sm:flex" aria-hidden="true">{initials}</span>
                            <div className="min-w-0">
                              <div className="truncate text-[11px] font-medium text-foreground">{token.personName}</div>
                              <div className="mt-0.5 truncate text-[9px] text-muted-foreground">{token.tokenNumber} <span className="mx-0.5 text-muted-foreground/50">·</span> {token.arrival}</div>
                            </div>
                          </div>
                          <span className="text-right text-[10px] tabular-nums text-muted-foreground sm:text-left">{token.waitingMinutes < 1 ? "Now" : `${token.waitingMinutes}m`}</span>
                          <div className="flex items-center justify-end gap-0.5">
                            <Button variant="ghost" size="icon-sm" className="size-7 text-muted-foreground hover:text-primary" aria-label={`Move ${token.personName} up`} disabled={position === 0} onClick={() => onMoveToken(queue.id, token.id, -1)}>
                              <MoveUp aria-hidden="true" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" className="size-7 text-muted-foreground hover:text-primary" aria-label={`Move ${token.personName} down`} disabled={position === waitingTokens.length - 1} onClick={() => onMoveToken(queue.id, token.id, 1)}>
                              <MoveDown aria-hidden="true" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" className="size-7 text-muted-foreground hover:text-rose-600" aria-label={`Cancel ${token.personName}'s token ${token.tokenNumber}`} onClick={() => onCancelToken(queue.id, token.id)}>
                              <X aria-hidden="true" />
                            </Button>
                          </div>
                        </li>
                      )
                    })}
                  </ol>
                </div>
              ) : (
                <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-[#dfe6df] bg-[#fbfcfa] px-6 text-center">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-[#edf4ee] text-primary"><UsersRound className="size-4" aria-hidden="true" /></span>
                  <p className="mt-3 text-[12px] font-medium text-foreground">{normalizedSearch ? "No matching people" : "This queue is clear"}</p>
                  <p className="mt-1 max-w-[220px] text-[10px] leading-4 text-muted-foreground">{normalizedSearch ? "Try another name or token number." : "Add someone to create the first token in this queue."}</p>
                  {!normalizedSearch && <Button size="sm" variant="outline" className="mt-3 h-7 rounded-lg text-[10px]" onClick={onOpenAddPerson}><Plus aria-hidden="true" /> Add person</Button>}
                </div>
              )}
            </div>

            <aside aria-label="Service controls" className="border-t border-[#eef1ed] bg-[#fafbf9] p-4 sm:p-5 lg:border-t-0 lg:border-l">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Service desk</p>
                  <h3 className="mt-1 text-[13px] font-semibold text-foreground">Now serving</h3>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700">
                  <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" /> Desk 01
                </span>
              </div>

              <div className="mt-4 rounded-xl border border-[#e7ece6] bg-white p-3.5 shadow-[0_1px_2px_rgba(22,44,38,0.03)]">
                {servingToken ? (
                  <>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="h-5 rounded-full border-sky-200 bg-sky-50 px-2 text-[9px] font-medium text-sky-700">In service</Badge>
                      <span className="text-[10px] font-semibold tabular-nums text-foreground">{servingToken.tokenNumber}</span>
                    </div>
                    <p className="mt-3 text-[14px] font-semibold tracking-[-0.02em] text-foreground">{servingToken.personName}</p>
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground"><Clock3 className="size-3" aria-hidden="true" /> Arrived {servingToken.arrival}</p>
                    <Button className="mt-4 h-8 w-full rounded-lg text-[10px]" onClick={() => onCompleteCurrent(queue.id)}>
                      <Check aria-hidden="true" /> Mark complete
                    </Button>
                  </>
                ) : nextToken ? (
                  <>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="h-5 rounded-full border-amber-200 bg-amber-50 px-2 text-[9px] font-medium text-amber-700">Ready to call</Badge>
                      <span className="text-[10px] font-semibold tabular-nums text-foreground">{nextToken.tokenNumber}</span>
                    </div>
                    <p className="mt-3 text-[14px] font-semibold tracking-[-0.02em] text-foreground">{nextToken.personName}</p>
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground"><Clock3 className="size-3" aria-hidden="true" /> Waiting {nextToken.waitingMinutes < 1 ? "just now" : `${nextToken.waitingMinutes} min`}</p>
                    <Button className="mt-4 h-8 w-full rounded-lg text-[10px]" onClick={() => onCallNext(queue.id)}>
                      Call next <ArrowRight aria-hidden="true" />
                    </Button>
                  </>
                ) : (
                  <div className="py-3 text-center">
                    <span className="mx-auto flex size-9 items-center justify-center rounded-xl bg-[#edf4ee] text-primary"><Check className="size-4" aria-hidden="true" /></span>
                    <p className="mt-2.5 text-[11px] font-medium text-foreground">All caught up</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">No one is waiting in this queue.</p>
                  </div>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-[#e9ede8] bg-white p-3">
                  <p className="text-[9px] text-muted-foreground">Waiting</p>
                  <p className="mt-1.5 text-[18px] font-semibold tracking-[-0.04em] text-foreground">{String(waitingTokens.length).padStart(2, "0")}</p>
                </div>
                <div className="rounded-xl border border-[#e9ede8] bg-white p-3">
                  <p className="text-[9px] text-muted-foreground">Avg. wait</p>
                  <p className="mt-1.5 text-[18px] font-semibold tracking-[-0.04em] text-foreground">{queue.averageWaitMinutes}<span className="ml-1 text-[10px] font-medium text-muted-foreground">min</span></p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-[#eef5ef] p-3">
                <Ticket className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
                <p className="text-[9px] leading-4 text-[#436158]">Calling a token moves the first person in line into service. Reorder or cancel waiting tokens at any time.</p>
              </div>
            </aside>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
