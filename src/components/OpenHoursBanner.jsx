import { useEffect, useState } from 'react'

const OPEN_HOUR = 18 // 6:00 PM
const CLOSE_HOUR = 3 // 3:00 AM

function isOpenNow(date) {
  const hour = date.getHours()
  return hour >= OPEN_HOUR || hour < CLOSE_HOUR
}

function getNextBoundary(date, open) {
  const boundary = new Date(date)
  if (open) {
    // currently open, counting down to the next 3:00 AM close
    boundary.setHours(CLOSE_HOUR, 0, 0, 0)
    if (boundary <= date) boundary.setDate(boundary.getDate() + 1)
  } else {
    // currently closed, counting down to the next 6:00 PM open
    boundary.setHours(OPEN_HOUR, 0, 0, 0)
    if (boundary <= date) boundary.setDate(boundary.getDate() + 1)
  }
  return boundary
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours}h ${minutes}m ${seconds}s`
}

export default function OpenHoursBanner() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const open = isOpenNow(now)
  const boundary = getNextBoundary(now, open)
  const remaining = formatDuration(boundary - now)

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
        open
          ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-ember-600/50 dark:bg-ember-500/10 dark:text-ember-400'
          : 'border-stone-200 bg-stone-100 text-stone-600 dark:border-midnight-600 dark:bg-midnight-800 dark:text-stone-400'
      }`}
    >
      <span className="font-medium">
        {open ? '🟢 Open now — kitchen closes at 3:00 AM' : '🔴 Closed — opens at 6:00 PM'}
      </span>
      <span className="font-mono text-xs sm:text-sm">
        {open ? 'Closing in' : 'Opening in'} {remaining}
      </span>
    </div>
  )
}
