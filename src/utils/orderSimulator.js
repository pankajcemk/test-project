import { useEffect } from 'react'

export const STATUS_STEPS = [
  { key: 'PLACED', label: 'Order Placed' },
  { key: 'PREPARING', label: 'Preparing' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' },
]

export function nextStatus(status) {
  const index = STATUS_STEPS.findIndex((step) => step.key === status)
  if (index === -1 || index === STATUS_STEPS.length - 1) return null
  return STATUS_STEPS[index + 1].key
}

/** Advances an order's status every `intervalMs` until it reaches DELIVERED, for demo purposes. */
export function useOrderAutoAdvance(order, advanceStatus, intervalMs = 5000) {
  useEffect(() => {
    if (!order || order.status === 'DELIVERED') return

    const timer = setInterval(() => {
      const upcoming = nextStatus(order.status)
      if (upcoming) advanceStatus(upcoming)
    }, intervalMs)

    return () => clearInterval(timer)
  }, [order, advanceStatus, intervalMs])
}
