import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function CartDrawer({ open, onClose }) {
  const { items, subtotal, updateQty, removeItem, checkout } = useCart()
  const [checkingOut, setCheckingOut] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const navigate = useNavigate()
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!open) return

    previousFocusRef.current = document.activeElement
    dialogRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = dialogRef.current?.querySelectorAll(FOCUSABLE_SELECTOR)
      if (!focusable || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim() || !address.trim() || items.length === 0) return
    checkout(name.trim(), address.trim())
    setCheckingOut(false)
    setName('')
    setAddress('')
    onClose()
    navigate('/track')
  }

  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-black/50" onClick={onClose}>
      <aside
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
        className="flex h-full w-full max-w-sm flex-col border-l border-stone-200 bg-white p-4 dark:border-midnight-700 dark:bg-midnight-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 id="cart-heading" className="text-lg font-bold text-stone-900 dark:text-stone-100">
            Your Cart
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-sm text-stone-500">Your cart is empty. Go add some late-night snacks!</p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border border-stone-200 p-2 dark:border-midnight-700"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{item.name}</p>
                    <p className="text-xs text-stone-600 dark:text-stone-400">${item.price.toFixed(2)} each</p>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={item.qty}
                    onChange={(event) => updateQty(item.id, Number(event.target.value))}
                    aria-label={`Quantity for ${item.name}`}
                    className="w-14 rounded border border-stone-300 bg-white px-1 py-1 text-center text-sm text-stone-900 dark:border-midnight-600 dark:bg-midnight-800 dark:text-stone-100"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="text-stone-500 hover:text-red-600 dark:hover:text-red-400"
                  >
                    🗑
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 border-t border-stone-200 pt-4 dark:border-midnight-700">
          <div className="flex justify-between text-sm text-stone-700 dark:text-stone-300">
            <span>Subtotal</span>
            <span className="font-mono">${subtotal.toFixed(2)}</span>
          </div>

          {!checkingOut ? (
            <button
              type="button"
              disabled={items.length === 0}
              onClick={() => setCheckingOut(true)}
              className="mt-3 w-full rounded-lg bg-ember-500 px-3 py-2 text-sm font-semibold text-midnight-950 hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-ember-400"
            >
              Checkout
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="mt-3 space-y-2">
              <input
                type="text"
                placeholder="Your name"
                aria-label="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 dark:border-midnight-600 dark:bg-midnight-800 dark:text-stone-100 dark:placeholder:text-stone-500"
              />
              <input
                type="text"
                placeholder="Delivery address"
                aria-label="Delivery address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                required
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 dark:border-midnight-600 dark:bg-midnight-800 dark:text-stone-100 dark:placeholder:text-stone-500"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-ember-500 px-3 py-2 text-sm font-semibold text-midnight-950 hover:bg-amber-600 dark:hover:bg-ember-400"
              >
                Place Order
              </button>
            </form>
          )}
        </div>
      </aside>
    </div>
  )
}
