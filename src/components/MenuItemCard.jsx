export default function MenuItemCard({ item, onAdd }) {
  return (
    <div className="flex flex-col rounded-xl border border-stone-200 bg-white p-4 dark:border-midnight-700 dark:bg-midnight-800">
      <div className="flex items-start justify-between">
        <span className="text-3xl">{item.icon}</span>
        <span className="font-mono text-amber-700 dark:text-ember-400">${item.price.toFixed(2)}</span>
      </div>
      <h3 className="mt-2 font-semibold text-stone-900 dark:text-stone-100">{item.name}</h3>
      <p className="mt-1 flex-1 text-sm text-stone-600 dark:text-stone-400">{item.description}</p>
      <button
        type="button"
        onClick={() => onAdd(item)}
        className="mt-3 rounded-lg bg-ember-500 px-3 py-2 text-sm font-semibold text-midnight-950 transition-colors hover:bg-amber-600 dark:hover:bg-ember-400"
      >
        Add to cart
      </button>
    </div>
  )
}
