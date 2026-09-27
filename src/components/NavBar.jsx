import { NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import ThemeToggle from './ThemeToggle'

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-ember-500 text-midnight-950'
      : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-midnight-700'
  }`

export default function NavBar({ onCartClick, cartOpen }) {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur dark:border-midnight-700 dark:bg-midnight-900/95">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌙</span>
          <span className="text-lg font-bold text-amber-700 dark:text-ember-400">Nightbite Eats</span>
        </div>

        <nav className="flex items-center gap-2">
          <NavLink to="/" className={linkClass}>
            Menu
          </NavLink>
          <NavLink to="/track" className={linkClass}>
            Track Order
          </NavLink>

          <button
            type="button"
            onClick={onCartClick}
            aria-haspopup="dialog"
            aria-expanded={cartOpen}
            className="relative ml-2 flex items-center gap-1 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 dark:border-midnight-600 dark:text-stone-200 dark:hover:bg-midnight-700"
          >
            🛒 Cart
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ember-500 text-xs font-bold text-midnight-950">
                {itemCount}
              </span>
            )}
          </button>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
