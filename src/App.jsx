import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import CartDrawer from './components/CartDrawer'
import MenuPage from './pages/MenuPage'
import OrderTrackingPage from './pages/OrderTrackingPage'

function App() {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div className="min-h-screen bg-stone-50 transition-colors dark:bg-midnight-950">
      <NavBar cartOpen={cartOpen} onCartClick={() => setCartOpen(true)} />

      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/track" element={<OrderTrackingPage />} />
      </Routes>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}

export default App
