import { STATUS_STEPS } from '../utils/orderSimulator'

export default function OrderStatusStepper({ status }) {
  const activeIndex = STATUS_STEPS.findIndex((step) => step.key === status)
  const isDelivered = activeIndex === STATUS_STEPS.length - 1

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:items-center">
      {STATUS_STEPS.map((step, index) => {
        const done = index <= activeIndex
        const isLast = index === STATUS_STEPS.length - 1
        return (
          <li key={step.key} className="flex flex-1 items-center gap-3 sm:flex-col sm:gap-2">
            <div className="flex items-center gap-3 sm:flex-col sm:gap-2">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                  done
                    ? isDelivered
                      ? 'bg-green-600 text-white dark:bg-green-500 dark:text-midnight-950'
                      : 'bg-ember-500 text-midnight-950'
                    : 'bg-stone-200 text-stone-500 dark:bg-midnight-700 dark:text-stone-500'
                }`}
              >
                {done ? '✓' : index + 1}
              </span>
              <span
                className={`text-sm ${done ? 'text-stone-900 dark:text-stone-100' : 'text-stone-500'}`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`h-6 w-0.5 flex-none sm:h-0.5 sm:w-full sm:flex-1 ${
                  index < activeIndex
                    ? isDelivered
                      ? 'bg-green-600 dark:bg-green-500'
                      : 'bg-ember-500'
                    : 'bg-stone-200 dark:bg-midnight-700'
                }`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
