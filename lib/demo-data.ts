export type QueueTokenStatus = "waiting" | "in_service" | "completed" | "cancelled"

export type QueueToken = {
  id: string
  tokenNumber: string
  personName: string
  status: QueueTokenStatus
  arrival: string
  waitingMinutes: number
}

export type DemoQueue = {
  id: string
  name: string
  code: string
  dotClass: string
  averageWaitMinutes: number
  nextNumber: number
  tokens: QueueToken[]
}

export const INITIAL_QUEUES: DemoQueue[] = [
  {
    id: "general",
    name: "General",
    code: "G",
    dotClass: "bg-emerald-500",
    averageWaitMinutes: 12,
    nextNumber: 48,
    tokens: [
      { id: "g-041", tokenNumber: "G-041", personName: "Milo Chen", status: "in_service", arrival: "9:34 AM", waitingMinutes: 8 },
      { id: "g-042", tokenNumber: "G-042", personName: "Asha Patel", status: "waiting", arrival: "9:41 AM", waitingMinutes: 6 },
      { id: "g-043", tokenNumber: "G-043", personName: "Noah Williams", status: "waiting", arrival: "9:44 AM", waitingMinutes: 4 },
      { id: "g-044", tokenNumber: "G-044", personName: "Sofia Rivera", status: "waiting", arrival: "9:47 AM", waitingMinutes: 3 },
      { id: "g-045", tokenNumber: "G-045", personName: "Eli Thompson", status: "waiting", arrival: "9:51 AM", waitingMinutes: 2 },
      { id: "g-046", tokenNumber: "G-046", personName: "Amara Okafor", status: "waiting", arrival: "9:53 AM", waitingMinutes: 1 },
      { id: "g-047", tokenNumber: "G-047", personName: "Theo Martin", status: "waiting", arrival: "9:55 AM", waitingMinutes: 0 },
    ],
  },
  {
    id: "appointments",
    name: "Appointments",
    code: "A",
    dotClass: "bg-sky-500",
    averageWaitMinutes: 7,
    nextNumber: 32,
    tokens: [
      { id: "a-028", tokenNumber: "A-028", personName: "Imani Brooks", status: "in_service", arrival: "9:40 AM", waitingMinutes: 5 },
      { id: "a-029", tokenNumber: "A-029", personName: "Leo Nakamura", status: "waiting", arrival: "9:49 AM", waitingMinutes: 2 },
      { id: "a-030", tokenNumber: "A-030", personName: "Grace Kim", status: "waiting", arrival: "9:52 AM", waitingMinutes: 1 },
      { id: "a-031", tokenNumber: "A-031", personName: "Omar Hassan", status: "waiting", arrival: "9:56 AM", waitingMinutes: 0 },
    ],
  },
  {
    id: "returns",
    name: "Returns",
    code: "R",
    dotClass: "bg-amber-500",
    averageWaitMinutes: 16,
    nextNumber: 19,
    tokens: [
      { id: "r-015", tokenNumber: "R-015", personName: "June Park", status: "in_service", arrival: "9:29 AM", waitingMinutes: 13 },
      { id: "r-016", tokenNumber: "R-016", personName: "Camila Santos", status: "waiting", arrival: "9:42 AM", waitingMinutes: 7 },
      { id: "r-017", tokenNumber: "R-017", personName: "Ethan Clarke", status: "waiting", arrival: "9:50 AM", waitingMinutes: 2 },
      { id: "r-018", tokenNumber: "R-018", personName: "Zara Ahmed", status: "waiting", arrival: "9:55 AM", waitingMinutes: 0 },
    ],
  },
]

export const QUEUE_LENGTH_TREND = [
  { day: "Mon", waiting: 24 },
  { day: "Tue", waiting: 30 },
  { day: "Wed", waiting: 27 },
  { day: "Thu", waiting: 33 },
  { day: "Fri", waiting: 29 },
  { day: "Sat", waiting: 18 },
  { day: "Sun", waiting: 14 },
]

export const WAIT_TIME_TREND = [
  { day: "Mon", wait: 15 },
  { day: "Tue", wait: 13 },
  { day: "Wed", wait: 14 },
  { day: "Thu", wait: 11 },
  { day: "Fri", wait: 12 },
  { day: "Sat", wait: 9 },
  { day: "Sun", wait: 8 },
]
