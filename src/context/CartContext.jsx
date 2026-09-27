import { createContext, useContext, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

const initialState = {
  items: [], // { id, name, price, icon, qty }
  order: null, // set on checkout: { id, items, total, customerName, address, placedAt, status }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((item) => item.id === action.item.id)
      const items = existing
        ? state.items.map((item) =>
            item.id === action.item.id ? { ...item, qty: item.qty + 1 } : item,
          )
        : [...state.items, { ...action.item, qty: 1 }]
      return { ...state, items }
    }
    case 'REMOVE_ITEM': {
      return { ...state, items: state.items.filter((item) => item.id !== action.id) }
    }
    case 'UPDATE_QTY': {
      const items = state.items
        .map((item) => (item.id === action.id ? { ...item, qty: action.qty } : item))
        .filter((item) => item.qty > 0)
      return { ...state, items }
    }
    case 'CHECKOUT': {
      const total = state.items.reduce((sum, item) => sum + item.price * item.qty, 0)
      const order = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        items: state.items,
        total,
        customerName: action.customerName,
        address: action.address,
        placedAt: new Date().toISOString(),
        status: 'PLACED',
      }
      return { ...state, items: [], order }
    }
    case 'ADVANCE_STATUS': {
      if (!state.order) return state
      return { ...state, order: { ...state.order, status: action.status } }
    }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const value = useMemo(() => {
    const itemCount = state.items.reduce((sum, item) => sum + item.qty, 0)
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.qty, 0)
    return {
      items: state.items,
      order: state.order,
      itemCount,
      subtotal,
      addItem: (item) => dispatch({ type: 'ADD_ITEM', item }),
      removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', id }),
      updateQty: (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty }),
      checkout: (customerName, address) => dispatch({ type: 'CHECKOUT', customerName, address }),
      advanceStatus: (status) => dispatch({ type: 'ADVANCE_STATUS', status }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
