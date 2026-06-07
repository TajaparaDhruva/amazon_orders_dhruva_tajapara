import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Server, 
  Activity, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Shield, 
  Play,
  RotateCcw
} from 'lucide-react'

// Pre-defined sample data for simulation
const CUSTOMERS = ['Aarav Mehta', 'Emily Watson', 'David Chen', 'Sarah Jenkins', 'Carlos Santan', 'Priya Sharma', 'John Doe']
const PRODUCTS = [
  { name: 'Echo Dot (5th Gen)', category: 'Electronics', price: 49.99, brand: 'Amazon' },
  { name: 'Kindle Paperwhite', category: 'Books', price: 139.99, brand: 'Amazon' },
  { name: 'Fire TV Stick 4K', category: 'Electronics', price: 39.99, brand: 'Amazon' },
  { name: 'Instant Pot Duo 7-in-1', category: 'Home & Kitchen', price: 89.99, brand: 'Instant Pot' },
  { name: 'Fitbit Charge 6', category: 'Fitness', price: 159.99, brand: 'Fitbit' },
  { name: 'Logitech MX Master 3S', category: 'Electronics', price: 99.99, brand: 'Logitech' },
  { name: 'Sony WH-1000XM4', category: 'Electronics', price: 348.00, brand: 'Sony' }
]
const COUNTRIES = ['India', 'United States', 'Germany', 'United Kingdom', 'Japan', 'Canada']
const STATUSES = ['Delivered', 'Processing', 'Shipped', 'Pending', 'Cancelled', 'Returned']
const PAYMENT_METHODS = ['UPI', 'Credit Card', 'Debit Card', 'Amazon Pay', 'Net Banking']

function App() {
  const [apiStatus, setApiStatus] = useState('checking')
  const [apiMessage, setApiMessage] = useState('')
  const [simulatedOrders, setSimulatedOrders] = useState([
    {
      orderId: 'ORD-987123',
      customerName: 'Aarav Mehta',
      productName: 'Sony WH-1000XM4',
      category: 'Electronics',
      quantity: 1,
      totalAmount: 348.00,
      country: 'India',
      paymentMethod: 'UPI',
      orderStatus: 'Delivered',
      orderDate: new Date(Date.now() - 3600000 * 2).toLocaleTimeString()
    },
    {
      orderId: 'ORD-543210',
      customerName: 'Emily Watson',
      productName: 'Kindle Paperwhite',
      category: 'Books',
      quantity: 2,
      totalAmount: 279.98,
      country: 'United States',
      paymentMethod: 'Credit Card',
      orderStatus: 'Processing',
      orderDate: new Date(Date.now() - 3600000 * 5).toLocaleTimeString()
    },
    {
      orderId: 'ORD-123456',
      customerName: 'David Chen',
      productName: 'Instant Pot Duo 7-in-1',
      category: 'Home & Kitchen',
      quantity: 1,
      totalAmount: 89.99,
      country: 'Canada',
      paymentMethod: 'Debit Card',
      orderStatus: 'Shipped',
      orderDate: new Date(Date.now() - 3600000 * 12).toLocaleTimeString()
    }
  ])

  // Check API health
  useEffect(() => {
    fetch('/api/v1/')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then(data => {
        setApiStatus('connected')
        setApiMessage(data.message || 'Connected')
      })
      .catch(() => {
        setApiStatus('disconnected')
        setApiMessage('Could not connect to backend server. Make sure backend is running on port 5000.')
      })
  }, [])

  // Calculate dynamic stats
  const totalOrders = simulatedOrders.length
  const totalRevenue = simulatedOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Simulate generating a new order
  const handleSimulateOrder = () => {
    const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)]
    const qty = Math.floor(Math.random() * 3) + 1
    const amount = Number((product.price * qty).toFixed(2))
    
    const newOrder = {
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)],
      productName: product.name,
      category: product.category,
      quantity: qty,
      totalAmount: amount,
      country: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
      paymentMethod: PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)],
      orderStatus: STATUSES[Math.floor(Math.random() * STATUSES.length)],
      orderDate: new Date().toLocaleTimeString()
    }

    setSimulatedOrders(prev => [newOrder, ...prev])
  }

  // Reset simulation
  const handleResetSimulation = () => {
    setSimulatedOrders([])
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-[#090d16]/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 p-[2px] shadow-lg shadow-indigo-500/20">
              <div className="h-full w-full bg-[#090d16] rounded-[10px] flex items-center justify-center font-bold text-transparent bg-clip-text bg-gradient-to-tr from-indigo-400 to-emerald-300 text-xl tracking-wider">
                VF
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                VenderFlow 
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  v1.0.0
                </span>
              </h1>
              <p className="text-[10px] text-slate-400">Order & Analytics Console</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <span className="text-indigo-400 font-semibold cursor-pointer">Dashboard</span>
            <span className="hover:text-slate-200 cursor-not-allowed opacity-50 flex items-center gap-1">
              Orders 
              <span className="text-[9px] px-1 bg-slate-800 text-slate-400 rounded">Lock</span>
            </span>
            <span className="hover:text-slate-200 cursor-not-allowed opacity-50 flex items-center gap-1">
              Analytics 
              <span className="text-[9px] px-1 bg-slate-800 text-slate-400 rounded">Lock</span>
            </span>
            <span className="hover:text-slate-200 cursor-not-allowed opacity-50 flex items-center gap-1">
              Sellers 
              <span className="text-[9px] px-1 bg-slate-800 text-slate-400 rounded">Lock</span>
            </span>
          </nav>

          <div className="flex items-center gap-4">
            {/* Tech logos */}
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400">Stack:</span>
              <img src={viteLogo} className="h-4 w-4 animate-pulse" alt="Vite" />
              <img src={reactLogo} className="h-4 w-4 animate-spin [animation-duration:8s]" alt="React" />
            </div>

            {/* API Connection Indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${
              apiStatus === 'connected' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : apiStatus === 'checking' 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              <Server className="h-3.5 w-3.5" />
              <span className="font-medium capitalize">API: {apiStatus}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="max-w-7xl mx-auto px-6 py-10 relative">
        {/* Welcome Banner */}
        <div className="mb-10 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <TrendingUp className="h-48 w-48 text-indigo-500" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/20 mb-4">
              <CheckCircle className="h-3.5 w-3.5" /> Feature 1 Completed Successfully
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
              React + Vite + Tailwind CSS <br/>
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                Initialization Complete
              </span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
              Welcome to the foundation of **VenderFlow**, the e-commerce order management and analytics platform. 
              The React 18 UI environment has been initialized, Tailwind CSS v3 styling configured, and 
              the hot-module replacement (HMR) development server is active.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleSimulateOrder}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 text-sm"
              >
                <Play className="h-4 w-4 fill-current" /> Simulate Order Flow
              </button>
              <a 
                href="#tracker" 
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-5 py-2.5 rounded-xl border border-slate-750 transition-all text-sm"
              >
                View Feature Roadmaps <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* API connection warning banner if offline */}
        {apiStatus === 'disconnected' && (
          <div className="mb-10 bg-amber-500/10 border border-amber-500/20 text-amber-300 px-6 py-4 rounded-xl flex items-start gap-3 text-sm">
            <Activity className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Backend Connection Notice: </span>
              {apiMessage} You can start the backend by opening another terminal and running <code className="bg-slate-900 px-1.5 py-0.5 rounded text-rose-400 font-mono text-xs">npm run dev</code> inside the <code className="bg-slate-900 px-1.5 py-0.5 rounded text-rose-400 font-mono text-xs">backend</code> folder.
            </div>
          </div>
        )}

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-6 rounded-2xl shadow-xl hover:border-indigo-500/30 hover:shadow-indigo-500/5 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Simulated Revenue</span>
              <div className="h-8 w-8 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="text-slate-500 text-xs mt-1">Updated in real-time from clicks</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-6 rounded-2xl shadow-xl hover:border-emerald-500/30 hover:shadow-emerald-500/5 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Simulated Orders</span>
              <div className="h-8 w-8 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">{totalOrders}</h3>
            <p className="text-slate-500 text-xs mt-1">Count of simulated transactions</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-6 rounded-2xl shadow-xl hover:border-purple-500/30 hover:shadow-purple-500/5 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Avg Order Value</span>
              <div className="h-8 w-8 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">${avgOrderValue.toFixed(2)}</h3>
            <p className="text-slate-500 text-xs mt-1">Mean purchase amount</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-6 rounded-2xl shadow-xl hover:border-pink-500/30 hover:shadow-pink-500/5 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Customers</span>
              <div className="h-8 w-8 bg-pink-500/10 text-pink-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">1,024</h3>
            <p className="text-slate-500 text-xs mt-1">Standard dataset coverage</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Orders Simulator (Left/Middle) */}
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 shadow-xl flex flex-col min-h-[450px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Interactive Order Simulation</h3>
                <p className="text-xs text-slate-400">Generate real-time state mutations to test component rendering</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleSimulateOrder}
                  className="bg-indigo-600/90 hover:bg-indigo-500 hover:shadow-indigo-500/5 hover:shadow-lg text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Play className="h-3 w-3 fill-current" /> Add Order
                </button>
                <button 
                  onClick={handleResetSimulation}
                  disabled={simulatedOrders.length === 0}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2 rounded-lg transition-all active:scale-95 flex items-center gap-1.5 border border-slate-700 disabled:opacity-40 disabled:pointer-events-none"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              </div>
            </div>

            {/* Simulated Orders List */}
            <div className="flex-1 overflow-x-auto rounded-xl border border-slate-800 bg-[#070b12]/50">
              {simulatedOrders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-10 text-slate-500">
                  <ShoppingBag className="h-12 w-12 stroke-1 mb-3 text-slate-650" />
                  <p className="text-sm font-semibold">No orders generated</p>
                  <p className="text-xs text-slate-600 mt-1">Click "Add Order" to simulate standard transactions.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                      <th className="p-4 font-semibold">Order ID</th>
                      <th className="p-4 font-semibold">Customer</th>
                      <th className="p-4 font-semibold">Product</th>
                      <th className="p-4 font-semibold text-right">Amount</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {simulatedOrders.map((order, idx) => (
                      <tr 
                        key={order.orderId} 
                        className={`hover:bg-slate-900/30 transition-colors ${
                          idx === 0 ? 'bg-indigo-500/[0.03] animate-[fadeIn_0.5s_ease-out]' : ''
                        }`}
                      >
                        <td className="p-4 font-mono font-bold text-indigo-400">{order.orderId}</td>
                        <td className="p-4 font-medium text-slate-200">{order.customerName}</td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-300">{order.productName}</div>
                          <div className="text-[10px] text-slate-500">{order.category}</div>
                        </td>
                        <td className="p-4 text-right font-semibold text-white">${order.totalAmount.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : order.orderStatus === 'Processing'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : order.orderStatus === 'Shipped'
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                              : order.orderStatus === 'Pending'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            <span className={`h-1 w-1 rounded-full mr-1.5 ${
                              order.orderStatus === 'Delivered'
                                ? 'bg-emerald-400'
                                : order.orderStatus === 'Processing'
                                ? 'bg-blue-400'
                                : order.orderStatus === 'Shipped'
                                ? 'bg-indigo-400'
                                : order.orderStatus === 'Pending'
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`} />
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 font-mono">{order.orderDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Progress Tracker (Right) */}
          <div id="tracker" className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2">Development Tracker</h3>
            <p className="text-xs text-slate-400 mb-6">MERN stack roadmap and current milestone status</p>

            <div className="space-y-6">
              
              {/* Feature 1 */}
              <div className="relative pl-6 border-l-2 border-indigo-500">
                <div className="absolute -left-[9px] top-0 h-4 w-4 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <CheckCircle className="h-3 w-3 text-white fill-current" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    Feature 1: React Init
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20 font-mono">
                      Done
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Setup React 18, Vite bundler, configuration directories, and Tailwind CSS v3 integration.
                  </p>
                  <div className="mt-2 text-[10px] text-slate-500 font-mono">
                    Files: main.jsx, App.jsx, vite.config.js
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative pl-6 border-l-2 border-slate-800">
                <div className="absolute -left-[9px] top-0 h-4 w-4 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center">
                  <Clock className="h-3 w-3 text-slate-500" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-400">
                    Feature 2: Authentication
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Implement user register/login, Redux store slices for credentials, and token-based protected routes.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative pl-6 border-l-2 border-slate-800">
                <div className="absolute -left-[9px] top-0 h-4 w-4 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center">
                  <Clock className="h-3 w-3 text-slate-500" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-400">
                    Feature 3: Orders Browser
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Integrate Axios clients to query backend REST endpoints. Enable pagination, advanced search, and filtering.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-0 h-4 w-4 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center">
                  <Clock className="h-3 w-3 text-slate-500" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-400">
                    Feature 4: Analytics
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Integrate Recharts visualizers for admin insight charts: revenue trends, order status distribution, and top sellers.
                  </p>
                </div>
              </div>

            </div>

            {/* Architecture Card */}
            <div className="mt-8 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-indigo-400" /> System Architecture
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                All requests will be routed to the local Express backend on port 5000 using Vite's development proxy.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-900 bg-[#070a10] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} VenderFlow Console. Built with React 18 & Tailwind CSS v3.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="https://vite.dev" target="_blank" className="hover:text-slate-350 transition-colors">Vite Docs</a>
            <a href="https://react.dev" target="_blank" className="hover:text-slate-350 transition-colors">React Docs</a>
            <a href="https://tailwindcss.com" target="_blank" className="hover:text-slate-350 transition-colors">Tailwind Docs</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
