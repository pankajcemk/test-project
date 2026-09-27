export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            active === category
              ? 'bg-ember-500 text-midnight-950'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-midnight-800 dark:text-stone-300 dark:hover:bg-midnight-700'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
