"use client"

import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ArrowDownRight, CalendarDays, MoreHorizontal } from "lucide-react"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { QUEUE_LENGTH_TREND, WAIT_TIME_TREND } from "@/lib/demo-data"

const queueLengthConfig = {
  waiting: { label: "Peak people waiting", color: "var(--chart-1)" },
} satisfies ChartConfig

const waitConfig = {
  wait: { label: "Avg. wait (min)", color: "var(--chart-3)" },
} satisfies ChartConfig

export function AnalyticsPanels() {
  return (
    <section id="analytics" aria-labelledby="analytics-heading" className="scroll-mt-6">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">This week</p>
          <h2 id="analytics-heading" className="mt-1 text-[17px] font-semibold tracking-[-0.035em] text-foreground">Queue analytics</h2>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#e7ebe6] bg-white px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground shadow-sm sm:text-[11px]">
          <CalendarDays className="size-3" aria-hidden="true" /> Last 7 days
        </span>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.25fr_0.9fr]">
        <Card className="rounded-2xl border border-[#e8ece7] bg-white shadow-[0_1px_2px_rgba(22,44,38,0.03)] [--card-spacing:0px]">
          <CardHeader className="flex flex-row items-start justify-between px-4 pt-4 pb-0 sm:px-5 sm:pt-5">
            <div>
              <CardTitle className="text-[13px] font-semibold">Queue length trend</CardTitle>
              <CardDescription className="mt-1 text-[10px] sm:text-[11px]">Peak people waiting across all queues</CardDescription>
            </div>
            <CardAction>
              <MoreHorizontal className="-mr-1 -mt-1 size-4 text-muted-foreground/60" aria-hidden="true" />
            </CardAction>
          </CardHeader>
          <CardContent className="px-3 pt-2 pb-3 sm:px-4">
            <ChartContainer config={queueLengthConfig} className="h-[194px] w-full sm:h-[204px]">
              <AreaChart accessibilityLayer data={QUEUE_LENGTH_TREND} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="queueLengthFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-waiting)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--color-waiting)" stopOpacity={0.015} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 5" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tickMargin={10} padding={{ left: 8, right: 8 }} tick={{ fontSize: 10 }} />
                <YAxis hide domain={[0, 40]} />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Area type="monotone" dataKey="waiting" stroke="var(--color-waiting)" strokeWidth={2.5} fill="url(#queueLengthFill)" />
              </AreaChart>
            </ChartContainer>
            <div className="flex items-center gap-1.5 px-2 text-[10px] text-muted-foreground">
              <i className="size-2 rounded-full bg-chart-1" aria-hidden="true" />
              Peak queue length
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#e8ece7] bg-white shadow-[0_1px_2px_rgba(22,44,38,0.03)] [--card-spacing:0px]">
          <CardHeader className="flex flex-row items-start justify-between px-4 pt-4 pb-0 sm:px-5 sm:pt-5">
            <div>
              <CardTitle className="text-[13px] font-semibold">Average wait time</CardTitle>
              <CardDescription className="mt-1 text-[10px] sm:text-[11px]">Minutes before service begins</CardDescription>
            </div>
            <CardAction>
              <MoreHorizontal className="-mr-1 -mt-1 size-4 text-muted-foreground/60" aria-hidden="true" />
            </CardAction>
          </CardHeader>
          <CardContent className="px-3 pt-2 pb-3 sm:px-4">
            <div className="mb-1 flex items-baseline gap-2 px-2">
              <span className="text-[25px] font-semibold tracking-[-0.06em] text-foreground">12.4</span>
              <span className="text-[10px] text-muted-foreground">min average</span>
              <span className="ml-auto inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700"><ArrowDownRight className="size-3" aria-hidden="true" /> 11.6%</span>
            </div>
            <ChartContainer config={waitConfig} className="h-[168px] w-full sm:h-[178px]">
              <LineChart accessibilityLayer data={WAIT_TIME_TREND} margin={{ left: 8, right: 10, top: 12, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 5" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tickMargin={10} padding={{ left: 8, right: 8 }} tick={{ fontSize: 10 }} />
                <YAxis hide domain={[0, 20]} />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Line type="monotone" dataKey="wait" stroke="var(--color-wait)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--color-wait)", strokeWidth: 0 }} activeDot={{ r: 4 }} />
              </LineChart>
            </ChartContainer>
            <p className="px-2 text-[10px] text-muted-foreground">Sample trend · down 7 minutes since Monday</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
