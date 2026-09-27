import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useOrderAutoAdvance, STATUS_STEPS } from '../utils/orderSimulator'
import OrderStatusStepper from '../components/OrderStatusStepper'

export default function OrderTrackingPage() {
  const { order, advanceStatus } = useCart()

  useOrderAutoAdvance(order, advanceStatus)

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-stone-600 dark:text-stone-400">No active order yet.</p>
        <Link
          to="/"
          className="mt-3 inline-block rounded-lg bg-ember-500 px-4 py-2 text-sm font-semibold text-midnight-950"
        >
          Browse the menu
        </Link>
      </div>
    )
  }

  const currentLabel = STATUS_STEPS.find((step) => step.key === order.status)?.label

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Order {order.id}</h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          Placed by {order.customerName} — delivering to {order.address}
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-midnight-700 dark:bg-midnight-800">
        <OrderStatusStepper status={order.status} />
        <p
          className={`mt-4 text-center text-sm ${
            order.status === 'DELIVERED' ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-ember-400'
          }`}
        >
          Current status: {currentLabel}
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-midnight-700 dark:bg-midnight-800">
        <h2 className="font-semibold text-stone-900 dark:text-stone-100">Order summary</h2>
        <ul className="mt-3 space-y-2">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm text-stone-700 dark:text-stone-300">
              <span>
                {item.icon} {item.name} × {item.qty}
              </span>
              <span className="font-mono">${(item.price * item.qty).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-stone-200 pt-3 font-semibold text-stone-900 dark:border-midnight-700 dark:text-stone-100">
          <span>Total</span>
          <span className="font-mono">${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
