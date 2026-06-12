import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    LayoutDashboard, ShoppingBag, Users, DollarSign,
    Package, Search, Filter, RefreshCw, LogOut, Moon, Sun,
    ChevronLeft, ChevronRight, Check, X, ShieldAlert,
    Trash2, Archive, Plus, Eye, CheckCircle2, AlertTriangle, FileText
} from 'lucide-react'

export default function SellerDashboard() {
    const { user, logout, api } = useAuth()
    const navigate = useNavigate()

    // UI state
    const [isDark, setIsDark] = useState(() => localStorage.getItem('vf_dark_mode') === 'true')
    const [loadingStats, setLoadingStats] = useState(true)
    const [loadingOrders, setLoadingOrders] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [orders, setOrders] = useState([])
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        pendingShipments: 0,
        deliveredOrders: 0,
        momGrowthRate: 0
    })

    // Search and Filter States
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalOrdersCount, setTotalOrdersCount] = useState(0)

    // Form Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null)
    const [newOrderForm, setNewOrderForm] = useState({
        ProductName: '',
        Category: 'Electronics',
        Brand: '',
        Quantity: 1,
        UnitPrice: '',
        PaymentMethod: 'UPI',
        CustomerName: '',
        City: '',
        State: '',
        Country: 'India'
    })

    const toggleTheme = () => {
        const next = !isDark
        setIsDark(next)
        localStorage.setItem('vf_dark_mode', String(next))
    }

    // Fetch Stats
    const fetchStats = useCallback(async () => {
        setLoadingStats(true)
        try {
            const { data } = await api.get('/dashboard/overview')
            if (data.success) {
                setStats(data.data)
            }
        } catch (err) {
            console.error('Error fetching dashboard stats:', err)
        } finally {
            setLoadingStats(false)
        }
    }, [api])

    // Fetch Orders with pagination & search & filter
    const fetchOrders = useCallback(async () => {
        setLoadingOrders(true)
        try {
            const params = {
                page: currentPage,
                limit: 8,
                sortBy: 'OrderDate',
                sortOrder: 'desc'
            }
            if (searchTerm.trim()) params.search = searchTerm.trim()
            if (statusFilter) params.status = statusFilter
            if (categoryFilter) params.category = categoryFilter

            const { data } = await api.get('/orders', { params })
            if (data.success) {
                setOrders(data.data || [])
                setTotalPages(data.totalPages || 1)
                setTotalOrdersCount(data.total || 0)
            }
        } catch (err) {
            console.error('Error fetching orders:', err)
        } finally {
            setLoadingOrders(false)
        }
    }, [api, currentPage, searchTerm, statusFilter, categoryFilter])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    useEffect(() => {
        fetchOrders()
    }, [fetchOrders])

    // Handle logout
    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    // Update order status
    const handleUpdateStatus = useCallback(async (orderId, newStatus) => {
        setActionLoading(true)
        try {
            const { data } = await api.patch(`/orders/${orderId}`, { OrderStatus: newStatus })
            if (data.success) {
                // Refresh list & stats
                fetchOrders()
                fetchStats()
            }
        } catch (err) {
            alert('Failed to update status: ' + (err.response?.data?.message || err.message))
        } finally {
            setActionLoading(false)
        }
    }, [api, fetchOrders, fetchStats])

    // Cancel order
    const handleCancelOrder = useCallback(async (orderId) => {
        if (!confirm('Are you sure you want to cancel this order?')) return
        setActionLoading(true)
        try {
            const { data } = await api.patch(`/orders/${orderId}/cancel`)
            if (data.success) {
                fetchOrders()
                fetchStats()
            }
        } catch (err) {
            alert('Failed to cancel order: ' + (err.response?.data?.message || err.message))
        } finally {
            setActionLoading(false)
        }
    }, [api, fetchOrders, fetchStats])

    // Archive order
    const handleArchiveOrder = useCallback(async (orderId) => {
        setActionLoading(true)
        try {
            const { data } = await api.patch(`/orders/${orderId}/archive`)
            if (data.success) {
                fetchOrders()
                fetchStats()
            }
        } catch (err) {
            alert('Failed to archive order: ' + (err.response?.data?.message || err.message))
        } finally {
            setActionLoading(false)
        }
    }, [api, fetchOrders, fetchStats])

    // Delete order
    const handleDeleteOrder = useCallback(async (orderId) => {
        if (!confirm('Are you sure you want to permanently delete this order?')) return
        setActionLoading(true)
        try {
            await api.delete(`/orders/${orderId}`)
            fetchOrders()
            fetchStats()
        } catch (err) {
            alert('Failed to delete order: ' + (err.response?.data?.message || err.message))
        } finally {
            setActionLoading(false)
        }
    }, [api, fetchOrders, fetchStats])

    // Duplicate order
    const handleDuplicateOrder = useCallback(async (orderId) => {
        setActionLoading(true)
        try {
            const { data } = await api.post(`/orders/${orderId}/duplicate`)
            if (data.success) {
                fetchOrders()
                fetchStats()
            }
        } catch (err) {
            alert('Failed to duplicate order: ' + (err.response?.data?.message || err.message))
        } finally {
            setActionLoading(false)
        }
    }, [api, fetchOrders, fetchStats])

    // Handle Create Order
    const handleCreateOrderSubmit = async (e) => {
        e.preventDefault()
        setActionLoading(true)
        try {
            // Compute Total Amount
            const qty = Number(newOrderForm.Quantity)
            const price = Number(newOrderForm.UnitPrice)
            const total = qty * price

            const orderPayload = {
                OrderID: 'ORD' + Math.floor(1000000 + Math.random() * 9000000),
                CustomerID: 'CUST' + Math.floor(10000 + Math.random() * 90000),
                CustomerName: newOrderForm.CustomerName || 'Guest User',
                ProductID: 'P' + Math.floor(10000 + Math.random() * 90000),
                ProductName: newOrderForm.ProductName,
                Category: newOrderForm.Category,
                Brand: newOrderForm.Brand || 'Generic',
                Quantity: qty,
                UnitPrice: price,
                TotalAmount: total,
                PaymentMethod: newOrderForm.PaymentMethod,
                OrderDate: new Date(),
                OrderStatus: 'Pending',
                City: newOrderForm.City || 'Unknown',
                State: newOrderForm.State || 'Unknown',
                Country: newOrderForm.Country,
                SellerID: user?._id || 'SELL00001'
            }

            const { data } = await api.post('/orders', orderPayload)
            if (data.success) {
                setIsCreateModalOpen(false)
                setNewOrderForm({
                    ProductName: '',
                    Category: 'Electronics',
                    Brand: '',
                    Quantity: 1,
                    UnitPrice: '',
                    PaymentMethod: 'UPI',
                    CustomerName: '',
                    City: '',
                    State: '',
                    Country: 'India'
                })
                fetchOrders()
                fetchStats()
            }
        } catch (err) {
            alert('Failed to create order: ' + (err.response?.data?.message || err.message))
        } finally {
            setActionLoading(false)
        }
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
            
            {/* Background pattern */}
            <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none" />

            {/* Top Navigation */}
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
                                SELLER PORTAL
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
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                {user?.name || 'Seller'} ({user?.role})
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
                {/* Intro Title */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="font-['Outfit'] text-3xl font-extrabold tracking-tight">
                            Seller Dashboard
                        </h1>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                            Monitor system order metrics, customer distribution, and process catalog transactions.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2.5 rounded-xl btn-gold text-sm font-bold flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <Plus className="h-4 w-4" /> Create Manual Order
                    </button>
                </div>

                {/* Stats Cards Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Revenue Card */}
                    <div className="p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                         style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">Total Gross Revenue</span>
                                {loadingStats ? (
                                    <div className="h-7 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mt-1" />
                                ) : (
                                    <h2 className="font-['Outfit'] text-2xl font-black mt-1">
                                        {formatCurrency(stats.totalRevenue)}
                                    </h2>
                                )}
                            </div>
                            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold">
                            <span className={`px-1.5 py-0.5 rounded ${stats.momGrowthRate >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {stats.momGrowthRate >= 0 ? '+' : ''}{stats.momGrowthRate}%
                            </span>
                            <span style={{ color: 'var(--text-muted)' }}>Month over Month Growth</span>
                        </div>
                    </div>

                    {/* Total Orders */}
                    <div className="p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                         style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">Total Orders</span>
                                {loadingStats ? (
                                    <div className="h-7 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mt-1" />
                                ) : (
                                    <h2 className="font-['Outfit'] text-2xl font-black mt-1">
                                        {stats.totalOrders?.toLocaleString()}
                                    </h2>
                                )}
                            </div>
                            <div className="p-2 rounded-xl bg-[#24324A]/10 text-blue-500 border border-blue-500/20">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold">
                            <span className="text-emerald-500 font-bold">
                                {stats.deliveredOrders?.toLocaleString()}
                            </span>
                            <span style={{ color: 'var(--text-muted)' }}>Orders completely delivered</span>
                        </div>
                    </div>

                    {/* Pending Shipments */}
                    <div className="p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                         style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">Pending & Processing</span>
                                {loadingStats ? (
                                    <div className="h-7 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mt-1" />
                                ) : (
                                    <h2 className="font-['Outfit'] text-2xl font-black mt-1">
                                        {stats.pendingShipments?.toLocaleString()}
                                    </h2>
                                )}
                            </div>
                            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
                                <Package className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold">
                            <span className="text-orange-500 font-bold">Needs Action</span>
                            <span style={{ color: 'var(--text-muted)' }}>Require shipping label generation</span>
                        </div>
                    </div>

                    {/* Total Customers */}
                    <div className="p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                         style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">Total Customers</span>
                                {loadingStats ? (
                                    <div className="h-7 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mt-1" />
                                ) : (
                                    <h2 className="font-['Outfit'] text-2xl font-black mt-1">
                                        {stats.totalCustomers?.toLocaleString()}
                                    </h2>
                                )}
                            </div>
                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold">
                            <span className="text-emerald-500 font-bold">Registered Users</span>
                            <span style={{ color: 'var(--text-muted)' }}>Linked customer profiles</span>
                        </div>
                    </div>
                </div>

                {/* Filters and Search Bar */}
                <div className="p-6 rounded-2xl border mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                     style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
                    <div className="flex-1 flex items-center gap-3 relative">
                        <Search className="h-4.5 w-4.5 text-neutral-400 absolute left-3" />
                        <input
                            type="text"
                            placeholder="Search orders by customer or product..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border outline-none text-sm transition-all focus:border-[var(--gold-accent)]"
                            style={{ 
                                backgroundColor: 'var(--input-bg)',
                                borderColor: 'var(--input-border)',
                                color: 'var(--input-text)'
                            }}
                        />
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Status Select */}
                        <div className="flex items-center gap-1.5">
                            <Filter className="h-4 w-4 text-neutral-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                className="px-3 py-2 rounded-xl border text-xs outline-none cursor-pointer"
                                style={{ 
                                    backgroundColor: 'var(--input-bg)',
                                    borderColor: 'var(--input-border)',
                                    color: 'var(--input-text)'
                                }}
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Returned">Returned</option>
                            </select>
                        </div>

                        {/* Category Select */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                            className="px-3 py-2 rounded-xl border text-xs outline-none cursor-pointer"
                            style={{ 
                                backgroundColor: 'var(--input-bg)',
                                borderColor: 'var(--input-border)',
                                color: 'var(--input-text)'
                            }}
                        >
                            <option value="">All Categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Home & Kitchen">Home & Kitchen</option>
                            <option value="Books">Books</option>
                            <option value="Sports & Outdoors">Sports & Outdoors</option>
                            <option value="Toys & Games">Toys & Games</option>
                            <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                            <option value="Health & Household">Health & Household</option>
                            <option value="Automotive">Automotive</option>
                        </select>

                        {/* Reset Buttons */}
                        {(searchTerm || statusFilter || categoryFilter) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('')
                                    setStatusFilter('')
                                    setCategoryFilter('')
                                    setCurrentPage(1)
                                }}
                                className="text-[10px] font-bold uppercase tracking-wider text-rose-500 hover:underline cursor-pointer"
                            >
                                Clear Filters
                            </button>
                        )}

                        <button
                            onClick={() => { fetchOrders(); fetchStats(); }}
                            className="p-2 rounded-xl border flex items-center justify-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            style={{ borderColor: 'var(--card-border)' }}
                            title="Refresh Data"
                        >
                            <RefreshCw className={`h-4.5 w-4.5 text-neutral-500 ${loadingOrders ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Orders List Container */}
                <div className="rounded-2xl border overflow-hidden transition-all duration-300"
                     style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
                    
                    {loadingOrders ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-3">
                            <RefreshCw className="h-8 w-8 text-neutral-400 animate-spin" />
                            <span className="text-sm text-neutral-400">Retrieving secure orders dataset from MongoDB...</span>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-3">
                            <ShoppingBag className="h-10 w-10 text-neutral-300" />
                            <h3 className="font-['Outfit'] text-lg font-bold">No Orders Found</h3>
                            <p className="text-xs text-neutral-400 max-w-sm text-center">
                                Try refining your search parameters or manual category filters.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b text-[10px] font-bold uppercase tracking-wider transition-colors bg-black/[0.01] dark:bg-white/[0.01]"
                                        style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
                                        <th className="px-6 py-4.5">Order ID</th>
                                        <th className="px-6 py-4.5">Customer</th>
                                        <th className="px-6 py-4.5">Product & Category</th>
                                        <th className="px-6 py-4.5">Date</th>
                                        <th className="px-6 py-4.5">Total Amount</th>
                                        <th className="px-6 py-4.5">Payment</th>
                                        <th className="px-6 py-4.5">Status</th>
                                        <th className="px-6 py-4.5 text-right">Actions</th>
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

                                        return (
                                            <tr key={o.OrderID} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
                                                <td className="px-6 py-4 font-mono font-bold">{o.OrderID}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-neutral-800 dark:text-neutral-100">{o.CustomerName}</div>
                                                    <div className="text-[10px] text-neutral-400">{o.CustomerID}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold">{o.ProductName}</div>
                                                    <div className="text-[10px] text-neutral-400">{o.Category} • {o.Brand}</div>
                                                </td>
                                                <td className="px-6 py-4 text-neutral-500">
                                                    {new Date(o.OrderDate).toLocaleDateString('en-IN', {
                                                        day: '2-digit', month: 'short', year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 font-bold">
                                                    {formatCurrency(o.TotalAmount)}
                                                    <div className="text-[9px] text-neutral-400 font-normal">
                                                        {o.Quantity} x {formatCurrency(o.UnitPrice)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-[10px] font-medium text-neutral-400">
                                                    {o.PaymentMethod}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                                                        {o.OrderStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {/* Status modification dropdown/buttons */}
                                                        {o.OrderStatus === 'Pending' && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(o.OrderID, 'Processing')}
                                                                disabled={actionLoading}
                                                                className="p-1 rounded-lg border border-blue-500/20 text-blue-500 hover:bg-blue-500/10 cursor-pointer transition-colors"
                                                                title="Mark Processing"
                                                            >
                                                                <Check className="h-3.5 w-3.5" />
                                                            </button>
                                                        )}
                                                        {o.OrderStatus === 'Processing' && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(o.OrderID, 'Shipped')}
                                                                disabled={actionLoading}
                                                                className="p-1 rounded-lg border border-violet-500/20 text-violet-500 hover:bg-violet-500/10 cursor-pointer transition-colors"
                                                                title="Mark Shipped"
                                                            >
                                                                <Package className="h-3.5 w-3.5" />
                                                            </button>
                                                        )}
                                                        {o.OrderStatus === 'Shipped' && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(o.OrderID, 'Delivered')}
                                                                disabled={actionLoading}
                                                                className="p-1 rounded-lg border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 cursor-pointer transition-colors"
                                                                title="Mark Delivered"
                                                            >
                                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        )}
                                                        
                                                        {o.OrderStatus !== 'Cancelled' && o.OrderStatus !== 'Delivered' && (
                                                            <button
                                                                onClick={() => handleCancelOrder(o.OrderID)}
                                                                disabled={actionLoading}
                                                                className="p-1 rounded-lg border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors"
                                                                title="Cancel Order"
                                                            >
                                                                <X className="h-3.5 w-3.5" />
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => setSelectedOrderDetails(o)}
                                                            className="p-1 rounded-lg border border-neutral-500/20 text-neutral-400 hover:bg-neutral-500/10 cursor-pointer transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                        </button>

                                                        <button
                                                            onClick={() => handleDuplicateOrder(o.OrderID)}
                                                            disabled={actionLoading}
                                                            className="p-1 rounded-lg border border-amber-500/20 text-amber-500 hover:bg-amber-500/10 cursor-pointer transition-colors"
                                                            title="Duplicate Order"
                                                        >
                                                            <Plus className="h-3.5 w-3.5" />
                                                        </button>

                                                        <button
                                                            onClick={() => handleArchiveOrder(o.OrderID)}
                                                            disabled={actionLoading}
                                                            className="p-1 rounded-lg border border-neutral-500/20 text-neutral-400 hover:bg-neutral-500/10 cursor-pointer transition-colors"
                                                            title="Archive Order"
                                                        >
                                                            <Archive className="h-3.5 w-3.5" />
                                                        </button>

                                                        <button
                                                            onClick={() => handleDeleteOrder(o.OrderID)}
                                                            disabled={actionLoading}
                                                            className="p-1 rounded-lg border border-rose-500/30 text-rose-600 hover:bg-rose-500/15 cursor-pointer transition-colors"
                                                            title="Permanently Delete"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {!loadingOrders && totalPages > 1 && (
                        <div className="p-4 border-t flex items-center justify-between gap-4 transition-colors"
                             style={{ borderColor: 'var(--card-border)' }}>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase">
                                Showing Page {currentPage} of {totalPages} ({totalOrdersCount} Total Records)
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all disabled:opacity-30 disabled:pointer-events-none"
                                    style={{ borderColor: 'var(--card-border)' }}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all disabled:opacity-30 disabled:pointer-events-none"
                                    style={{ borderColor: 'var(--card-border)' }}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* CREATE ORDER MODAL */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl relative overflow-hidden transition-all bg-[#FAF7F5] dark:bg-[#1B0B0E]"
                         style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
                        <h3 className="font-['Outfit'] text-xl font-bold mb-4 flex items-center gap-2">
                            <Plus className="h-5 w-5 text-amber-500" /> Create Manual Order
                        </h3>
                        <form onSubmit={handleCreateOrderSubmit} className="space-y-4 text-xs font-semibold">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 text-neutral-400 uppercase tracking-wider text-[9px]">Customer Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. John Doe"
                                        value={newOrderForm.CustomerName}
                                        onChange={(e) => setNewOrderForm(p => ({ ...p, CustomerName: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl border outline-none text-xs focus:border-[var(--gold-accent)]"
                                        style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)' }}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-neutral-400 uppercase tracking-wider text-[9px]">Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Drone Mini"
                                        value={newOrderForm.ProductName}
                                        onChange={(e) => setNewOrderForm(p => ({ ...p, ProductName: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl border outline-none text-xs focus:border-[var(--gold-accent)]"
                                        style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)' }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block mb-1 text-neutral-400 uppercase tracking-wider text-[9px]">Category</label>
                                    <select
                                        value={newOrderForm.Category}
                                        onChange={(e) => setNewOrderForm(p => ({ ...p, Category: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl border outline-none text-xs"
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
                                        placeholder="e.g. Sony"
                                        value={newOrderForm.Brand}
                                        onChange={(e) => setNewOrderForm(p => ({ ...p, Brand: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl border outline-none text-xs"
                                        style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)' }}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-neutral-400 uppercase tracking-wider text-[9px]">Payment Method</label>
                                    <select
                                        value={newOrderForm.PaymentMethod}
                                        onChange={(e) => setNewOrderForm(p => ({ ...p, PaymentMethod: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl border outline-none text-xs"
                                        style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)' }}
                                    >
                                        <option value="Credit Card">Credit Card</option>
                                        <option value="Debit Card">Debit Card</option>
                                        <option value="UPI">UPI</option>
                                        <option value="Amazon Pay">Amazon Pay</option>
                                        <option value="Cash on Delivery">Cash on Delivery</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 text-neutral-400 uppercase tracking-wider text-[9px]">Unit Price (INR)</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        placeholder="e.g. 500"
                                        value={newOrderForm.UnitPrice}
                                        onChange={(e) => setNewOrderForm(p => ({ ...p, UnitPrice: e.target.value }))}
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
                                        value={newOrderForm.Quantity}
                                        onChange={(e) => setNewOrderForm(p => ({ ...p, Quantity: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl border outline-none text-xs focus:border-[var(--gold-accent)]"
                                        style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)' }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block mb-1 text-neutral-400 uppercase tracking-wider text-[9px]">City</label>
                                    <input
                                        type="text"
                                        placeholder="Mumbai"
                                        value={newOrderForm.City}
                                        onChange={(e) => setNewOrderForm(p => ({ ...p, City: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl border outline-none text-xs"
                                        style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)' }}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-neutral-400 uppercase tracking-wider text-[9px]">State</label>
                                    <input
                                        type="text"
                                        placeholder="MH"
                                        value={newOrderForm.State}
                                        onChange={(e) => setNewOrderForm(p => ({ ...p, State: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl border outline-none text-xs"
                                        style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)' }}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-neutral-400 uppercase tracking-wider text-[9px]">Country</label>
                                    <input
                                        type="text"
                                        placeholder="India"
                                        value={newOrderForm.Country}
                                        onChange={(e) => setNewOrderForm(p => ({ ...p, Country: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl border outline-none text-xs"
                                        style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)' }}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
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
                                    Submit Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DETAILS VIEW MODAL */}
            {selectedOrderDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-md rounded-2xl border p-6 shadow-2xl relative overflow-hidden transition-all bg-[#FAF7F5] dark:bg-[#1B0B0E]"
                         style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
                        <h3 className="font-['Outfit'] text-xl font-bold mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-amber-500" /> Order Details Invoice
                        </h3>
                        <div className="space-y-3.5 text-xs text-left">
                            <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--card-border)' }}>
                                <span className="text-neutral-400">Order ID:</span>
                                <span className="font-mono font-bold">{selectedOrderDetails.OrderID}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--card-border)' }}>
                                <span className="text-neutral-400">Customer ID:</span>
                                <span>{selectedOrderDetails.CustomerID}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--card-border)' }}>
                                <span className="text-neutral-400">Customer Name:</span>
                                <span className="font-bold">{selectedOrderDetails.CustomerName}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--card-border)' }}>
                                <span className="text-neutral-400">Product Name:</span>
                                <span className="font-bold text-amber-500">{selectedOrderDetails.ProductName}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--card-border)' }}>
                                <span className="text-neutral-400">Category / Brand:</span>
                                <span>{selectedOrderDetails.Category} / {selectedOrderDetails.Brand}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--card-border)' }}>
                                <span className="text-neutral-400">Quantity & Price:</span>
                                <span>{selectedOrderDetails.Quantity} x {formatCurrency(selectedOrderDetails.UnitPrice)}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--card-border)' }}>
                                <span className="text-neutral-400">Total Amount:</span>
                                <span className="font-black text-sm">{formatCurrency(selectedOrderDetails.TotalAmount)}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--card-border)' }}>
                                <span className="text-neutral-400">Shipping Destination:</span>
                                <span>{selectedOrderDetails.City}, {selectedOrderDetails.State}, {selectedOrderDetails.Country}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--card-border)' }}>
                                <span className="text-neutral-400">Order Status:</span>
                                <span className="font-bold uppercase tracking-wider text-amber-500">{selectedOrderDetails.OrderStatus}</span>
                            </div>
                            <div className="flex justify-between pb-1">
                                <span className="text-neutral-400">Created At:</span>
                                <span>{new Date(selectedOrderDetails.createdAt || selectedOrderDetails.OrderDate).toLocaleString()}</span>
                            </div>

                            <div className="pt-4 flex items-center justify-end">
                                <button
                                    onClick={() => setSelectedOrderDetails(null)}
                                    className="px-4 py-2 rounded-xl btn-gold text-xs font-bold cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
