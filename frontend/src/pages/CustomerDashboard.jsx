import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    ShoppingBag, DollarSign, Calendar, Tag, ShieldCheck,
    Plus, LogOut, Moon, Sun, RefreshCw, X, CheckCircle2,
    Clock, Trash2, ArrowRight, Star
} from 'lucide-react'

export default function CustomerDashboard() {
    const { user, logout, api } = useAuth()
    const navigate = useNavigate()

    // UI state
    const [isDark, setIsDark] = useState(() => localStorage.getItem('vf_dark_mode') === 'true')
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [orders, setOrders] = useState([])
    
    // Stats calculated from customer's orders
    const [customerStats, setCustomerStats] = useState({
        totalSpent: 0,
        orderCount: 0,
        avgSpent: 0
    })

    // Simulated purchase state
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)
    const [buyForm, setBuyForm] = useState({
        ProductName: '',
        Category: 'Electronics',
        Brand: '',
        Quantity: 1,
        UnitPrice: '',
        PaymentMethod: 'Credit Card',
        City: 'Mumbai',
        State: 'MH',
        Country: 'India'
    })

    const toggleTheme = () => {
        const next = !isDark
        setIsDark(next)
        localStorage.setItem('vf_dark_mode', String(next))
    }

    const fetchCustomerOrders = useCallback(async () => {
        setLoading(true)
        try {
            // Fetch all orders matching this CustomerID
            const { data } = await api.get('/orders', {
                params: {
                    customerID: user?._id,
                    limit: 100 // fetch a generous list to calculate client-side stats
                }
            })
            if (data.success) {
                const customerOrders = data.data || []
                setOrders(customerOrders)

                // Calculate metrics
                const count = customerOrders.length
                const total = customerOrders.reduce((sum, order) => {
                    // Ignore cancelled/returned orders in total spent calculation if desired
                    if (order.OrderStatus !== 'Cancelled') {
                        return sum + (order.TotalAmount || 0)
                    }
                    return sum
                }, 0)
                const avg = count > 0 ? total / count : 0

                setCustomerStats({
                    totalSpent: total,
                    orderCount: count,
                    avgSpent: avg
                })
            }
        } catch (err) {
            console.error('Error fetching customer orders:', err)
        } finally {
            setLoading(false)
        }
    }, [api, user?._id])

    useEffect(() => {
        if (user?._id) {
            fetchCustomerOrders()
        }
    }, [user?._id, fetchCustomerOrders])

    // Cancel order
    const handleCancelOrder = async (orderId) => {
        if (!confirm('Are you sure you want to cancel this order?')) return
        setActionLoading(true)
        try {
            const { data } = await api.patch(`/orders/${orderId}/cancel`)
            if (data.success) {
                fetchCustomerOrders()
            }
        } catch (err) {
            alert('Failed to cancel order: ' + (err.response?.data?.message || err.message))
        } finally {
            setActionLoading(false)
        }
    }

    // Place simulated order
    const handleBuySubmit = async (e) => {
        e.preventDefault()
        setActionLoading(true)
        try {
            const qty = Number(buyForm.Quantity)
            const price = Number(buyForm.UnitPrice)
            const total = qty * price

            const orderPayload = {
                OrderID: 'ORD' + Math.floor(1000000 + Math.random() * 9000000),
                CustomerID: user?._id || 'CUST_TEMP',
                CustomerName: user?.name || 'Customer Name',
                ProductID: 'P' + Math.floor(10000 + Math.random() * 90000),
                ProductName: buyForm.ProductName,
                Category: buyForm.Category,
                Brand: buyForm.Brand || 'Amazon Store',
                Quantity: qty,
                UnitPrice: price,
                TotalAmount: total,
                PaymentMethod: buyForm.PaymentMethod,
                OrderDate: new Date(),
                OrderStatus: 'Pending',
                City: buyForm.City,
                State: buyForm.State,
                Country: buyForm.Country,
                SellerID: 'SELL' + Math.floor(10000 + Math.random() * 90000)
            }

            const { data } = await api.post('/orders', orderPayload)
            if (data.success) {
                setIsBuyModalOpen(false)
                setBuyForm({
                    ProductName: '',
                    Category: 'Electronics',
                    Brand: '',
                    Quantity: 1,
                    UnitPrice: '',
                    PaymentMethod: 'Credit Card',
                    City: 'Mumbai',
                    State: 'MH',
                    Country: 'India'
                })
                fetchCustomerOrders()
            }
        } catch (err) {
            alert('Failed to place order: ' + (err.response?.data?.message || err.message))
        } finally {
            setActionLoading(false)
        }
    }

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val || 0)
    }

    return (
        <div className={`min-h-screen font-['Inter'] relative transition-colors duration-300 ${isDark ? 'theme-dark bg-[#1B0B0E] text-[#F7EFEF]' : 'bg-[#FAF7F5] text-[#1F1F1F]'}`}>
            
            {/* Background design */}
            <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none" />

            {/* Navigation Header */}
            <header className="sticky top-0 z-40 bg-white/70 dark:bg-black/50 backdrop-blur-xl border-b transition-colors"
                    style={{ borderColor: 'var(--card-border)' }}>
                <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl flex items-center justify-center border shadow-sm"
                             style={{ backgroundColor: 'var(--logo-bg)', borderColor: 'var(--logo-border)' }}>
                            <svg className="h-5 w-5" style={{ color: 'var(--gold-accent)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                <line x1="12" y1="22.08" x2="12" y2="12" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-['Outfit'] text-lg font-bold tracking-tight">VenderFlow</div>
                            <div className="text-[7px] font-black tracking-widest uppercase" style={{ color: 'var(--gold-accent)' }}>
                                CUSTOMER PORTAL
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="h-8.5 w-8.5 rounded-lg border flex items-center justify-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            style={{ borderColor: 'var(--card-border)' }}
                        >
                            {isDark ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5 text-neutral-600" />}
                        </button>

                        <div className="h-8.5 px-3 rounded-lg border flex items-center gap-2"
                             style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--badge-bg)' }}>
                            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                {user?.name || 'Customer'}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="h-8.5 px-3 rounded-lg border flex items-center gap-1.5 cursor-pointer text-rose-500 border-rose-500/20 hover:bg-rose-500/5 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="text-xs font-semibold">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                {/* Header title */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="font-['Outfit'] text-3xl font-extrabold tracking-tight">
                            Welcome, {user?.name || 'Customer'}
                        </h1>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                            Track your personal Amazon order status, history, and simulate buying new products instantly.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsBuyModalOpen(true)}
                        className="px-5 py-3 rounded-xl btn-gold text-sm font-bold flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <Plus className="h-4.5 w-4.5" /> Simulate Purchase
                    </button>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    {/* Spent Card */}
                    <div className="p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 relative"
                         style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">Total Spent</span>
                                <h2 className="font-['Outfit'] text-3xl font-black mt-1">
                                    {formatCurrency(customerStats.totalSpent)}
                                </h2>
                            </div>
                            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                <DollarSign className="h-5.5 w-5.5" />
                            </div>
                        </div>
                        <p className="text-[9px] text-neutral-400 mt-4 font-semibold uppercase">
                            * Excludes cancelled transactions
                        </p>
                    </div>

                    {/* Total Orders Card */}
                    <div className="p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 relative"
                         style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">Orders Placed</span>
                                <h2 className="font-['Outfit'] text-3xl font-black mt-1">
                                    {customerStats.orderCount}
                                </h2>
                            </div>
                            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                <ShoppingBag className="h-5.5 w-5.5" />
                            </div>
                        </div>
                        <p className="text-[9px] text-neutral-400 mt-4 font-semibold uppercase">
                            Total lifetime shopping count
                        </p>
                    </div>

                    {/* Average spend per order */}
                    <div className="p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 relative"
                         style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">Avg. Order Value</span>
                                <h2 className="font-['Outfit'] text-3xl font-black mt-1">
                                    {formatCurrency(customerStats.avgSpent)}
                                </h2>
                            </div>
                            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                <Star className="h-5.5 w-5.5" />
                            </div>
                        </div>
                        <p className="text-[9px] text-neutral-400 mt-4 font-semibold uppercase">
                            Calculated across all orders
                        </p>
                    </div>
                </div>

                {/* Orders History list */}
                <h3 className="font-['Outfit'] text-lg font-bold mb-4 flex items-center gap-2">
                    <Clock className="h-4.5 w-4.5 text-neutral-400" /> Your Order History
                </h3>

                <div className="rounded-2xl border overflow-hidden transition-all duration-300"
                     style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
                    
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-3">
                            <RefreshCw className="h-8 w-8 text-neutral-400 animate-spin" />
                            <span className="text-sm text-neutral-400">Loading your purchase records from database...</span>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4 text-center">
                            <div className="h-12 w-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                                <ShoppingBag className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-['Outfit'] text-base font-bold">No Orders Placed Yet</h4>
                                <p className="text-xs text-neutral-400 mt-1 max-w-sm">
                                    You haven't bought anything yet. Use the purchase simulator to instantly place a test order!
                                </p>
                            </div>
                            <button
                                onClick={() => setIsBuyModalOpen(true)}
                                className="px-4 py-2 rounded-xl btn-gold text-xs font-bold cursor-pointer"
                            >
                                Simulate Your First Purchase
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b text-[10px] font-bold uppercase tracking-wider transition-colors bg-black/[0.01] dark:bg-white/[0.01]"
                                        style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
                                        <th className="px-6 py-4">Order ID</th>
                                        <th className="px-6 py-4">Product Name</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Quantity</th>
                                        <th className="px-6 py-4">Total Price</th>
                                        <th className="px-6 py-4">Order Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-xs transition-colors"
                                       style={{ divideColor: 'var(--card-border)' }}>
                                    {orders.map((o) => {
                                        let statusColor = 'bg-slate-500/10 text-slate-500'
                                        if (o.OrderStatus === 'Delivered') statusColor = 'bg-emerald-500/10 text-emerald-500'
                                        else if (o.OrderStatus === 'Pending') statusColor = 'bg-amber-500/10 text-amber-500'
                                        else if (o.OrderStatus === 'Processing') statusColor = 'bg-blue-500/10 text-blue-500'
                                        else if (o.OrderStatus === 'Shipped') statusColor = 'bg-violet-500/10 text-violet-500'
                                        else if (o.OrderStatus === 'Cancelled') statusColor = 'bg-rose-500/10 text-rose-500'
                                        else if (o.OrderStatus === 'Returned') statusColor = 'bg-orange-500/10 text-orange-500'

                                        const canCancel = o.OrderStatus === 'Pending' || o.OrderStatus === 'Processing'

                                        return (
                                            <tr key={o.OrderID} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
                                                <td className="px-6 py-4.5 font-mono font-bold">{o.OrderID}</td>
                                                <td className="px-6 py-4.5 font-semibold">{o.ProductName}</td>
                                                <td className="px-6 py-4.5 text-neutral-400">{o.Category}</td>
                                                <td className="px-6 py-4.5 font-medium">{o.Quantity} units</td>
                                                <td className="px-6 py-4.5 font-bold">
                                                    {formatCurrency(o.TotalAmount)}
                                                    <div className="text-[10px] text-neutral-400 font-normal">
                                                        {formatCurrency(o.UnitPrice)} each
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4.5 text-neutral-500">
                                                    {new Date(o.OrderDate).toLocaleDateString('en-IN', {
                                                        day: '2-digit', month: 'short', year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4.5">
                                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${statusColor}`}>
                                                        {o.OrderStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4.5 text-right">
                                                    {canCancel ? (
                                                        <button
                                                            onClick={() => handleCancelOrder(o.OrderID)}
                                                            disabled={actionLoading}
                                                            className="px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500/5 cursor-pointer text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                                                        >
                                                            Cancel Order
                                                        </button>
                                                    ) : (
                                                        <span className="text-[10px] text-neutral-400 italic">Locked</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* BUY MODAL */}
            {isBuyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-md rounded-2xl border p-6 shadow-2xl relative overflow-hidden transition-all bg-[#FAF7F5] dark:bg-[#1B0B0E]"
                         style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
                        <h3 className="font-['Outfit'] text-xl font-bold mb-4 flex items-center gap-2">
                            <Plus className="h-5 w-5 text-amber-500" /> Simulate Product Purchase
                        </h3>
                        <form onSubmit={handleBuySubmit} className="space-y-4 text-xs font-semibold">
                            <div>
                                <label className="block mb-1 text-neutral-400 uppercase tracking-wider text-[9px]">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Drone Mini, Keyboard, Coffee Mug"
                                    value={buyForm.ProductName}
                                    onChange={(e) => setBuyForm(p => ({ ...p, ProductName: e.target.value }))}
                                    className="w-full p-2.5 rounded-xl border outline-none text-xs focus:border-[var(--gold-accent)]"
                                    style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)' }}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 text-neutral-400 uppercase tracking-wider text-[9px]">Category</label>
                                    <select
                                        value={buyForm.Category}
                                        onChange={(e) => setBuyForm(p => ({ ...p, Category: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl border outline-none text-xs cursor-pointer"
                                        style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)' }}
                                    >
                                        <option value="Electronics">Electronics</option>
                                        <option value="Clothing">Clothing</option>
                                        <option value="Home & Kitchen">Home & Kitchen</option>
                                        <option value="Books">Books</option>
                                        <option value="Sports & Outdoors">Sports & Outdoors</option>
                                        <option value="Toys & Games">Toys & Games</option>
                                        <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-1 text-neutral-400 uppercase tracking-wider text-[9px]">Brand</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Sony, BrightLux"
                                        value={buyForm.Brand}
                                        onChange={(e) => setBuyForm(p => ({ ...p, Brand: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl border outline-none text-xs focus:border-[var(--gold-accent)]"
                                        style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)' }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 text-neutral-400 uppercase tracking-wider text-[9px]">Unit Price (INR)</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        placeholder="e.g. 1500"
                                        value={buyForm.UnitPrice}
                                        onChange={(e) => setBuyForm(p => ({ ...p, UnitPrice: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl border outline-none text-xs focus:border-[var(--gold-accent)]"
                                        style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)' }}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-neutral-400 uppercase tracking-wider text-[9px]">Quantity</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={buyForm.Quantity}
                                        onChange={(e) => setBuyForm(p => ({ ...p, Quantity: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl border outline-none text-xs focus:border-[var(--gold-accent)]"
                                        style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1 text-neutral-400 uppercase tracking-wider text-[9px]">Payment Method</label>
                                <select
                                    value={buyForm.PaymentMethod}
                                    onChange={(e) => setBuyForm(p => ({ ...p, PaymentMethod: e.target.value }))}
                                    className="w-full p-2.5 rounded-xl border outline-none text-xs cursor-pointer"
                                    style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)' }}
                                >
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Debit Card">Debit Card</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Amazon Pay">Amazon Pay</option>
                                    <option value="Cash on Delivery">Cash on Delivery</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block mb-1 text-neutral-400 uppercase tracking-wider text-[9px]">City</label>
                                    <input
                                        type="text"
                                        value={buyForm.City}
                                        onChange={(e) => setBuyForm(p => ({ ...p, City: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl border outline-none text-xs focus:border-[var(--gold-accent)]"
                                        style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)' }}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-neutral-400 uppercase tracking-wider text-[9px]">State</label>
                                    <input
                                        type="text"
                                        value={buyForm.State}
                                        onChange={(e) => setBuyForm(p => ({ ...p, State: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl border outline-none text-xs focus:border-[var(--gold-accent)]"
                                        style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)' }}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-neutral-400 uppercase tracking-wider text-[9px]">Country</label>
                                    <input
                                        type="text"
                                        value={buyForm.Country}
                                        onChange={(e) => setBuyForm(p => ({ ...p, Country: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl border outline-none text-xs focus:border-[var(--gold-accent)]"
                                        style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)' }}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsBuyModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border font-bold text-xs cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                    style={{ borderColor: 'var(--card-border)' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="px-5 py-2.5 rounded-xl btn-gold text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                    {actionLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : null}
                                    Confirm Purchase
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
