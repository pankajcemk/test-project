import { useMemo, useState } from 'react'
import OpenHoursBanner from '../components/OpenHoursBanner'
import CategoryTabs from '../components/CategoryTabs'
import MenuItemCard from '../components/MenuItemCard'
import { CATEGORIES, MENU_ITEMS } from '../data/menu'
import { useCart } from '../context/CartContext'

export default function MenuPage() {
  const [category, setCategory] = useState('All')
  const { addItem } = useCart()

  const filteredItems = useMemo(
    () => (category === 'All' ? MENU_ITEMS : MENU_ITEMS.filter((item) => item.category === category)),
    [category],
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      <OpenHoursBanner />

      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Late-Night Menu</h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">Fuel up whenever the craving hits.</p>
      </div>

      <CategoryTabs categories={CATEGORIES} active={category} onChange={setCategory} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <MenuItemCard key={item.id} item={item} onAdd={addItem} />
        ))}
      </div>
    </div>
  )
}
