import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    LayoutDashboard, ShoppingBag, Users, Package,
    Bell, ChevronDown, LogOut, Moon, Sun, Plus,
    TrendingUp, Eye, Star, Clock, RefreshCw, X,
    Check, Truck, CheckCircle2, AlertTriangle, ExternalLink,
    BarChart2, ArrowUpRight, ArrowDownRight, Sparkles,
    Shield, CheckCircle, RotateCcw, TrendingDown,
    Search, SlidersHorizontal, Download, Edit2, MoreHorizontal,
    ChevronLeft, ChevronRight, MapPin
} from 'lucide-react'

import { ALL_PRODUCTS } from '../data/dashboardData'

// ─── Mock / Fallback Data ──────────────────────────────────────────────────────
const MOCK_STATS = {
    totalRevenue: 54320,
    totalOrders: 156,
    totalCustomers: 128,
    pendingOrders: 12,
    productViews: 2350,
    storeRating: 4.6,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    customersGrowth: 10.2,
    viewsGrowth: 15.7,
    deliveredOrders: 98,
    processingOrders: 34,
    cancelledOrders: 12
}

const MOCK_RECENT_ORDERS = [
    { OrderID: 'VF10234', ProductName: 'Electric Kettle', description: '1.8L | Black', OrderDate: new Date('2026-06-25T10:30:00'), TotalAmount: 83, OrderStatus: 'Delivered', image: 'https://images.unsplash.com/photo-1577334716219-3375b050d7a3?w=100&q=80' },
    { OrderID: 'VF10221', ProductName: 'Office Chair', description: 'Ergonomic | Black', OrderDate: new Date('2026-06-18T16:15:00'), TotalAmount: 5499, OrderStatus: 'Processing', image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=100&q=80' },
    { OrderID: 'VF10198', ProductName: 'Casual Sneakers', description: 'White | Size 8', OrderDate: new Date('2026-07-01T11:20:00'), TotalAmount: 849, OrderStatus: 'Shipped', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80' },
    { OrderID: 'VF10175', ProductName: 'Leather Backpack', description: 'Brown | 15 Inch', OrderDate: new Date('2026-07-02T09:45:00'), TotalAmount: 1199, OrderStatus: 'Confirmed', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&q=80' },
]

const TOP_PRODUCTS = [
    { rank: 1, name: 'Electric Kettle', desc: '1.8L | Black', sales: 120, maxSales: 120, image: 'https://images.unsplash.com/photo-1577334716219-3375b050d7a3?w=100&q=80' },
    { rank: 2, name: 'Office Chair', desc: 'Ergonomic | Black', sales: 85, maxSales: 120, image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=100&q=80' },
    { rank: 3, name: 'Leather Backpack', desc: 'Brown | 15 Inch', sales: 64, maxSales: 120, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&q=80' },
    { rank: 4, name: 'Puzzle 1000pc', desc: 'Multicolor', sales: 52, maxSales: 120, image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=100&q=80' },
]

// Chart data per filter option
const CHART_DATA = {
    'This Week':  { points: [9500,  11200, 10800, 13400, 18200, 15600, 14800], days: ['20 May','21 May','22 May','23 May','24 May','25 May','26 May'] },
    'Last Week':  { points: [7200,  8400,  9100,  8700,  11300, 10500, 9800 ], days: ['13 May','14 May','15 May','16 May','17 May','18 May','19 May'] },
    'This Month': { points: [42000, 58000, 51000, 67000, 73000, 61000, 78000], days: ['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6','Week 7'] },
    'Last Month': { points: [38000, 45000, 49000, 44000, 55000, 52000, 61000], days: ['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6','Week 7'] },
    'This Year':  { points: [120000,98000,145000,132000,168000,155000,189000], days: ['Jan','Feb','Mar','Apr','May','Jun','Jul'] },
}

// ─── Mock Full Orders List ────────────────────────────────────────────────────
const MOCK_ALL_ORDERS = [
    { OrderID:'VF10234', customer:'Riya Kapoor',    email:'riy***@gmail.com', phone:'+91 98765 43210', initials:'RK', color:'#f97316', items:[{name:'Electric Kettle',img:'https://images.unsplash.com/photo-1577334716219-3375b050d7a3?w=80&q=80'},{name:'Office Chair',img:'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=80&q=80'}], itemCount:2, amount:5582, payment:'Online', payBadge:'Paid',   OrderStatus:'Processing', statusNote:'Order is being prepared', OrderDate:new Date('2024-05-25T10:30:00') },
    { OrderID:'VF10233', customer:'Aman Mehta',    email:'aman***@gmail.com',phone:'+91 87654 32109', initials:'AM', color:'#22c55e', items:[{name:'Leather Backpack',img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=80&q=80'}],                                                                                          itemCount:1, amount:1199, payment:'Online', payBadge:'Paid',   OrderStatus:'Pending',    statusNote:'Awaiting confirmation',   OrderDate:new Date('2024-05-25T09:15:00') },
    { OrderID:'VF10232', customer:'Sneha Patel',   email:'sneh***@gmail.com', phone:'+91 91234 56789', initials:'SP', color:'#a855f7', items:[{name:'Casual Sneakers',img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=80'},{name:'Electric Kettle',img:'https://images.unsplash.com/photo-1577334716219-3375b050d7a3?w=80&q=80'},{name:'Puzzle Set',img:'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=80&q=80'}], itemCount:3, amount:2447, payment:'Cash on Delivery', payBadge:'COD', OrderStatus:'Confirmed', statusNote:'Order confirmed', OrderDate:new Date('2024-05-24T18:45:00') },
    { OrderID:'VF10231', customer:'Vivek Gupta',   email:'vive***@gmail.com', phone:'+91 99887 76655', initials:'VG', color:'#3b82f6', items:[{name:'Office Chair',img:'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=80&q=80'}],                                                                                                 itemCount:1, amount:5499, payment:'Online', payBadge:'Paid',   OrderStatus:'Delivered', statusNote:'Delivered on 24 May',     OrderDate:new Date('2024-05-24T16:20:00') },
    { OrderID:'VF10230', customer:'Neha Joshi',    email:'neha***@gmail.com', phone:'+91 78965 43211', initials:'NJ', color:'#ec4899', items:[{name:'Leather Backpack',img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=80&q=80'},{name:'Puzzle Set',img:'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=80&q=80'}],  itemCount:2, amount:1648, payment:'Online', payBadge:'Paid',   OrderStatus:'Cancelled',  statusNote:'Cancelled by customer',   OrderDate:new Date('2024-05-23T11:30:00') },
    { OrderID:'VF10229', customer:'Raj Sharma',    email:'raj***@gmail.com',  phone:'+91 88765 43210', initials:'RS', color:'#14b8a6', items:[{name:'Casual Sneakers',img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=80'}],                                                                                                 itemCount:1, amount:849,  payment:'UPI',    payBadge:'Paid',   OrderStatus:'Shipped',   statusNote:'Out for delivery',        OrderDate:new Date('2024-05-23T08:10:00') },
    { OrderID:'VF10228', customer:'Priya Singh',   email:'pri***@gmail.com',  phone:'+91 77654 32109', initials:'PS', color:'#f59e0b', items:[{name:'Electric Kettle',img:'https://images.unsplash.com/photo-1577334716219-3375b050d7a3?w=80&q=80'},{name:'Leather Backpack',img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=80&q=80'}], itemCount:2, amount:2398, payment:'Credit Card', payBadge:'Paid', OrderStatus:'Delivered', statusNote:'Delivered on 22 May',     OrderDate:new Date('2024-05-22T14:55:00') },
    { OrderID:'VF10227', customer:'Arjun Nair',    email:'arj***@gmail.com',  phone:'+91 66543 21098', initials:'AN', color:'#6366f1', items:[{name:'Office Chair',img:'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=80&q=80'},{name:'Casual Sneakers',img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=80'}], itemCount:2, amount:6348, payment:'Online', payBadge:'Paid',  OrderStatus:'Processing', statusNote:'Preparing shipment',      OrderDate:new Date('2024-05-22T10:20:00') },
    { OrderID:'VF10226', customer:'Kavya Reddy',   email:'kav***@gmail.com',  phone:'+91 55432 10987', initials:'KR', color:'#10b981', items:[{name:'Puzzle Set',img:'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=80&q=80'}],                                                                                                 itemCount:1, amount:499,  payment:'UPI',    payBadge:'Paid',   OrderStatus:'Confirmed', statusNote:'Confirmed, preparing',    OrderDate:new Date('2024-05-21T17:35:00') },
    { OrderID:'VF10225', customer:'Mohit Verma',   email:'moh***@gmail.com',  phone:'+91 44321 09876', initials:'MV', color:'#f43f5e', items:[{name:'Electric Kettle',img:'https://images.unsplash.com/photo-1577334716219-3375b050d7a3?w=80&q=80'}],                                                                                                 itemCount:1, amount:83,   payment:'COD',    payBadge:'COD',    OrderStatus:'Pending',   statusNote:'Awaiting payment',        OrderDate:new Date('2024-05-21T09:05:00') },
]

// ─── Mock Customers List ─────────────────────────────────────────────────
const MOCK_CUSTOMERS = [
    { id:'c1',  name:'Riya Kapoor',  initials:'RK', color:'#f97316', email:'riya.kapoor@email.com',  phone:'+91 98765 43210', city:'Rajkot',     state:'Gujarat',     orders:5,  totalSpent:5582,  status:'Active',   badge:'New',    joinedDate:new Date('2024-05-25') },
    { id:'c2',  name:'Aman Mehta',   initials:'AM', color:'#22c55e', email:'aman.mehta@email.com',   phone:'+91 87654 32109', city:'Ahmedabad',  state:'Gujarat',     orders:3,  totalSpent:3247,  status:'Active',   badge:null,     joinedDate:new Date('2024-05-24') },
    { id:'c3',  name:'Sneha Patel',  initials:'SP', color:'#a855f7', email:'sneha.patel@email.com',  phone:'+91 91234 56789', city:'Surat',      state:'Gujarat',     orders:8,  totalSpent:9862,  status:'Active',   badge:'Repeat', joinedDate:new Date('2024-05-20') },
    { id:'c4',  name:'Vivek Gupta',  initials:'VG', color:'#3b82f6', email:'vivek.gupta@email.com',  phone:'+91 99887 76655', city:'Vadodara',   state:'Gujarat',     orders:2,  totalSpent:1498,  status:'Inactive', badge:null,     joinedDate:new Date('2024-05-18') },
    { id:'c5',  name:'Neha Joshi',   initials:'NJ', color:'#ec4899', email:'neha.joshi@email.com',   phone:'+91 78965 43211', city:'Jamnagar',   state:'Gujarat',     orders:4,  totalSpent:2987,  status:'Active',   badge:null,     joinedDate:new Date('2024-05-15') },
    { id:'c6',  name:'Raj Sharma',   initials:'RS', color:'#14b8a6', email:'raj.sharma@email.com',   phone:'+91 88765 43210', city:'Mumbai',     state:'Maharashtra', orders:6,  totalSpent:7340,  status:'Active',   badge:'Repeat', joinedDate:new Date('2024-05-12') },
    { id:'c7',  name:'Priya Singh',  initials:'PS', color:'#f59e0b', email:'priya.singh@email.com',  phone:'+91 77654 32109', city:'Pune',       state:'Maharashtra', orders:9,  totalSpent:12450, status:'Active',   badge:'Repeat', joinedDate:new Date('2024-05-10') },
    { id:'c8',  name:'Arjun Nair',   initials:'AN', color:'#6366f1', email:'arjun.nair@email.com',   phone:'+91 66543 21098', city:'Chennai',    state:'Tamil Nadu',  orders:1,  totalSpent:849,   status:'Active',   badge:'New',    joinedDate:new Date('2024-05-08') },
    { id:'c9',  name:'Kavya Reddy',  initials:'KR', color:'#10b981', email:'kavya.reddy@email.com',  phone:'+91 55432 10987', city:'Hyderabad',  state:'Telangana',   orders:7,  totalSpent:8920,  status:'Active',   badge:'Repeat', joinedDate:new Date('2024-05-05') },
    { id:'c10', name:'Mohit Verma',  initials:'MV', color:'#f43f5e', email:'mohit.verma@email.com',  phone:'+91 44321 09876', city:'Delhi',      state:'Delhi',       orders:3,  totalSpent:2130,  status:'Inactive', badge:null,     joinedDate:new Date('2024-05-03') },
    { id:'c11', name:'Ankita Das',   initials:'AD', color:'#0ea5e9', email:'ankita.das@email.com',   phone:'+91 33210 98765', city:'Kolkata',    state:'West Bengal', orders:5,  totalSpent:4670,  status:'Active',   badge:null,     joinedDate:new Date('2024-05-01') },
    { id:'c12', name:'Siddharth K',  initials:'SK', color:'#d97706', email:'siddharth.k@email.com',  phone:'+91 22109 87654', city:'Bangalore',  state:'Karnataka',   orders:12, totalSpent:18230, status:'Active',   badge:'Repeat', joinedDate:new Date('2024-04-28') },
]

// Nav links
const NAV_LINKS = ['Dashboard', 'Products', 'Orders', 'Customers', 'Analytics']

export default function SellerDashboard() {
    const { user, logout, api } = useAuth()
    const navigate = useNavigate()

    const [isDark, setIsDark] = useState(() => localStorage.getItem('vf_dark_mode') === 'true')
    const [weekFilter, setWeekFilter] = useState('This Week')
    const [weekDropOpen, setWeekDropOpen] = useState(false)
    const weekDropRef = useRef(null)
    const [activeNav, setActiveNav] = useState('Dashboard')
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [loadingStats, setLoadingStats] = useState(true)
    const [loadingOrders, setLoadingOrders] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [stats, setStats] = useState(MOCK_STATS)
    const [products, setProducts] = useState(ALL_PRODUCTS)
    const [recentOrders, setRecentOrders] = useState(MOCK_RECENT_ORDERS)

    // Products page state
    const [prodSearch, setProdSearch] = useState('')
    const [prodCategory, setProdCategory] = useState('All Categories')
    const [prodStatus, setProdStatus] = useState('All Status')
    const [prodPage, setProdPage] = useState(1)
    const [selectedRows, setSelectedRows] = useState([])
    const [activeToggles, setActiveToggles] = useState(() => {
        const map = {}
        ALL_PRODUCTS.forEach(p => { map[p.id] = p.stock !== 0 })
        return map
    })
    const PROD_PER_PAGE = 5

    // Seller product list (local, mutable)
    const AUGMENTED = ALL_PRODUCTS.map((p, i) => ({
        ...p,
        sku: `VK-${1001 + i}`,
        stock: [120,85,0,12,32,5,67,200,14,30,3,50,40,22,11,28,8,60,35,90][i] ?? 25,
    }))
    const [sellerProducts, setSellerProducts] = useState(AUGMENTED)

    // Product modals state
    const [prodModal, setProdModal] = useState(null)        // null | { mode:'add'|'edit', product? }
    const [viewModal, setViewModal]   = useState(null)      // null | product
    const [moreMenu, setMoreMenu]     = useState(null)      // null | { prodId, x, y }
    const [deleteConfirm, setDeleteConfirm] = useState(null) // null | product object

    // Orders page state
    const [ordSearch, setOrdSearch]       = useState('')
    const [ordStatus, setOrdStatus]       = useState('All Status')
    const [ordPayment, setOrdPayment]     = useState('All Payment Status')
    const [ordPage, setOrdPage]           = useState(1)
    const [ordDetail, setOrdDetail]       = useState(null)  // null | order object (side drawer)
    const [allOrders, setAllOrders]       = useState(MOCK_ALL_ORDERS)
    const ORD_PER_PAGE = 5

    // Customers page state
    const [custSearch, setCustSearch]   = useState('')
    const [custStatus, setCustStatus]   = useState('All Status')
    const [custLocation, setCustLocation] = useState('All Locations')
    const [custPage, setCustPage]       = useState(1)
    const [custDetail, setCustDetail]   = useState(null) // null | customer
    const [customers, setCustomers]     = useState(MOCK_CUSTOMERS)
    const CUST_PER_PAGE = 5

    const EMPTY_PROD = { name:'', brand:'', category:'Electronics', subcategory:'', price:'', stock:'', image:'' }

    const openAdd  = () => setProdModal({ mode:'add',  product: { ...EMPTY_PROD } })
    const openEdit = (prod) => setProdModal({ mode:'edit', product: { ...prod } })

    const handleProdSave = () => {
        const p = prodModal.product
        if (!p.name || !p.price) return
        if (prodModal.mode === 'add') {
            const newP = { ...p, id: 'p-new-' + Date.now(), sku: `VK-${1001 + sellerProducts.length}`, price: Number(p.price), stock: Number(p.stock) || 0 }
            setSellerProducts(prev => [newP, ...prev])
            setActiveToggles(t => ({ ...t, [newP.id]: newP.stock > 0 }))
        } else {
            setSellerProducts(prev => prev.map(x => x.id === p.id ? { ...x, ...p, price: Number(p.price), stock: Number(p.stock) } : x))
        }
        setProdModal(null)
    }

    const handleProdDelete = (prodId) => {
        setSellerProducts(prev => prev.filter(p => p.id !== prodId))
        setMoreMenu(null)
        setDeleteConfirm(null)
    }

    const handleProdDuplicate = (prod) => {
        const dup = { ...prod, id: 'p-dup-' + Date.now(), name: prod.name + ' (Copy)', sku: `VK-${1001 + sellerProducts.length}` }
        setSellerProducts(prev => [dup, ...prev])
        setActiveToggles(t => ({ ...t, [dup.id]: dup.stock > 0 }))
        setMoreMenu(null)
    }

    // CSV Export
    const handleExport = () => {
        const headers = ['SKU','Name','Brand','Category','Price','Stock','Status']
        const rows = sellerProducts.map(p => [
            p.sku, `"${p.name}"`, `"${p.brand || ''}"`, p.category,
            p.price, p.stock,
            p.stock === 0 ? 'Out of Stock' : p.stock < 15 ? 'Low Stock' : 'In Stock'
        ])
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url  = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = 'products_export.csv'; a.click()
        URL.revokeObjectURL(url)
    }

    const [newOrderForm, setNewOrderForm] = useState({
        ProductName: '', Category: 'Electronics', Brand: '',
        Quantity: 1, UnitPrice: '', PaymentMethod: 'UPI',
        CustomerName: '', City: '', State: '', Country: 'India'
    })

    const profileRef = useRef(null)

    const toggleTheme = () => {
        const next = !isDark
        setIsDark(next)
        localStorage.setItem('vf_dark_mode', String(next))
    }

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    // Close profile dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false)
            }
            if (weekDropRef.current && !weekDropRef.current.contains(e.target)) {
                setWeekDropOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    // Fetch database products on mount
    useEffect(() => {
        const fetchDBProducts = async () => {
            try {
                const { data } = await api.get('/products')
                if (data.success && data.data && data.data.length > 0) {
                    setProducts(data.data)
                }
            } catch (err) {
                console.error('Error fetching database products:', err)
            }
        }
        if (api) {
            fetchDBProducts()
        }
    }, [api])

    // Fetch Stats
    const fetchStats = useCallback(async () => {
        setLoadingStats(true)
        try {
            const { data } = await api.get('/dashboard/overview')
            if (data.success) {
                setStats({ ...MOCK_STATS, ...data.data })
            }
        } catch {
            setStats(MOCK_STATS)
        } finally {
            setLoadingStats(false)
        }
    }, [api])

    // Fetch Recent Orders
    const fetchOrders = useCallback(async () => {
        setLoadingOrders(true)
        try {
            const { data } = await api.get('/orders', { params: { limit: 4, sortBy: 'OrderDate', sortOrder: 'desc' } })
            if (data.success && data.data?.length > 0) {
                setRecentOrders(data.data.map(o => {
                    const cleanName = o.ProductName.split('(')[0].trim().toLowerCase()
                    const matchedProduct = products.find(p => 
                        p.id === o.ProductID || 
                        p.name.toLowerCase().includes(cleanName) ||
                        cleanName.includes(p.name.toLowerCase())
                    )
                    return {
                        ...o,
                        image: matchedProduct ? matchedProduct.image : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80',
                        description: matchedProduct ? `${matchedProduct.brand} | ${matchedProduct.category}` : o.Brand || 'Standard Edition'
                    }
                }))
            } else {
                setRecentOrders(MOCK_RECENT_ORDERS)
            }
        } catch {
            setRecentOrders(MOCK_RECENT_ORDERS)
        } finally {
            setLoadingOrders(false)
        }
    }, [api, products])

    useEffect(() => { fetchStats() }, [fetchStats])
    useEffect(() => { fetchOrders() }, [fetchOrders])

    // Update order status
    const handleUpdateStatus = useCallback(async (orderId, newStatus) => {
        setActionLoading(true)
        try {
            await api.patch(`/orders/${orderId}`, { OrderStatus: newStatus })
            fetchOrders(); fetchStats()
        } catch (err) {
            alert('Failed: ' + (err.response?.data?.message || err.message))
        } finally {
            setActionLoading(false)
        }
    }, [api, fetchOrders, fetchStats])

    // Create manual order
    const handleCreateOrderSubmit = async (e) => {
        e.preventDefault()
        setActionLoading(true)
        try {
            const qty = Number(newOrderForm.Quantity)
            const price = Number(newOrderForm.UnitPrice)
            await api.post('/orders', {
                OrderID: 'ORD' + Math.floor(1000000 + Math.random() * 9000000),
                CustomerID: 'CUST' + Math.floor(10000 + Math.random() * 90000),
                CustomerName: newOrderForm.CustomerName || 'Guest',
                ProductID: 'P' + Math.floor(10000 + Math.random() * 90000),
                ProductName: newOrderForm.ProductName,
                Category: newOrderForm.Category,
                Brand: newOrderForm.Brand || 'Generic',
                Quantity: qty, UnitPrice: price, TotalAmount: qty * price,
                PaymentMethod: newOrderForm.PaymentMethod,
                OrderDate: new Date(), OrderStatus: 'Pending',
                City: newOrderForm.City || 'Unknown',
                State: newOrderForm.State || 'Unknown',
                Country: newOrderForm.Country,
                SellerID: user?._id || 'SELL00001'
            })
            setIsCreateModalOpen(false)
            setNewOrderForm({ ProductName: '', Category: 'Electronics', Brand: '', Quantity: 1, UnitPrice: '', PaymentMethod: 'UPI', CustomerName: '', City: '', State: '', Country: 'India' })
            fetchOrders(); fetchStats()
        } catch (err) {
            alert('Failed: ' + (err.response?.data?.message || err.message))
        } finally {
            setActionLoading(false)
        }
    }

    const formatCurrency = (val) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0)

    // ─── SVG Line Chart (reactive to weekFilter) ─────────────────────────────────
    const chartW = 500, chartH = 180
    const activeChartData = CHART_DATA[weekFilter] || CHART_DATA['This Week']
    const chartPoints = activeChartData.points
    const chartDays   = activeChartData.days
    const maxVal = Math.max(...chartPoints) * 1.1
    const minVal = 0
    const pts = chartPoints.map((v, i) => ({
        x: (i / (chartPoints.length - 1)) * chartW,
        y: chartH - ((v - minVal) / (maxVal - minVal)) * chartH
    }))
    const pathD = pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ')
    const areaD = `${pathD} L${chartW},${chartH} L0,${chartH} Z`
    // Dynamic Y-axis labels based on max value
    const yMax = Math.max(...chartPoints)
    const yStep = yMax / 4
    const yLabels = [yMax, yMax * 0.75, yMax * 0.5, yMax * 0.25, 0].map(v =>
        v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : v >= 1000 ? `₹${Math.round(v/1000)}K` : `₹${Math.round(v)}`
    )

    // ─── Donut Chart ─────────────────────────────────────────────────────────────
    const total = stats.totalOrders || 156
    const delivered = stats.deliveredOrders || 98
    const shipped = stats.shippedOrders || 0
    const pending = stats.pendingOrders || 12
    const cancelled = stats.cancelledOrders || 12
    const returned = stats.returnedOrders || 0
    const processing = stats.processingOrders || 34
    const confirmed = stats.confirmedOrders || 0

    const donutSegments = [
        { value: delivered,   color: '#10b981', label: 'Delivered',   pct: ((delivered / total) * 100).toFixed(1) },
        { value: shipped,     color: '#a855f7', label: 'Shipped',     pct: ((shipped / total) * 100).toFixed(1) },
        { value: pending,     color: '#f59e0b', label: 'Pending',     pct: ((pending / total) * 100).toFixed(1) },
        { value: cancelled,   color: '#f43f5e', label: 'Cancelled',   pct: ((cancelled / total) * 100).toFixed(1) },
        { value: returned,    color: '#ec4899', label: 'Returned',    pct: ((returned / total) * 100).toFixed(1) },
        { value: processing,  color: '#3b82f6', label: 'Processing',  pct: ((processing / total) * 100).toFixed(1) },
        { value: confirmed,   color: '#14b8a6', label: 'Confirmed',   pct: ((confirmed / total) * 100).toFixed(1) },
    ].filter(seg => seg.value > 0)
    const DONUT_R = 70, DONUT_CX = 90, DONUT_CY = 90, STROKE_W = 22
    let cumAngle = -90
    const donutArcs = donutSegments.map(seg => {
        const angle = (seg.value / total) * 360
        const startAngle = cumAngle
        const endAngle = cumAngle + angle
        cumAngle = endAngle
        const toRad = (a) => (a * Math.PI) / 180
        const x1 = DONUT_CX + DONUT_R * Math.cos(toRad(startAngle))
        const y1 = DONUT_CY + DONUT_R * Math.sin(toRad(startAngle))
        const x2 = DONUT_CX + DONUT_R * Math.cos(toRad(endAngle))
        const y2 = DONUT_CY + DONUT_R * Math.sin(toRad(endAngle))
        const largeArc = angle > 180 ? 1 : 0
        return { ...seg, d: `M${x1},${y1} A${DONUT_R},${DONUT_R} 0 ${largeArc} 1 ${x2},${y2}` }
    })

    // Status badge colors
    const statusBadge = (s) => {
        if (s === 'Delivered') return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
        if (s === 'Processing') return 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
        if (s === 'Shipped') return 'bg-violet-500/10 text-violet-600 border border-violet-500/20'
        if (s === 'Confirmed') return 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
        if (s === 'Cancelled') return 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
        return 'bg-neutral-500/10 text-neutral-500 border border-neutral-500/20'
    }

    // Initials helper
    const initials = (name) => (name || 'VD').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

    return (
        <div className={`min-h-screen font-['Inter'] transition-colors duration-300 ${isDark ? 'theme-dark bg-[#1B0B0E] text-[#F7EFEF]' : 'bg-[#FAF7F5] text-[#1F1F1F]'}`}>

            {/* ── HEADER ─────────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-40 bg-[var(--card-bg)] border-b border-[var(--card-border)] shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

                    {/* Logo */}
                    <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => navigate('/dashboard/seller')}>
                        <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-[var(--gold-accent)] shadow-md">
                            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                <line x1="12" y1="22.08" x2="12" y2="12" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-['Outfit'] text-lg font-extrabold leading-none tracking-tight">VenderFlow</div>
                            <div className="text-[8px] font-black tracking-widest text-[var(--gold-accent)] uppercase mt-0.5">Your Store. Your Growth.</div>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {NAV_LINKS.map(link => (
                            <button
                                key={link}
                                onClick={() => setActiveNav(link)}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    activeNav === link
                                        ? 'bg-[var(--gold-bg-pill)] text-[var(--gold-accent)] border border-[var(--gold-accent)]/20'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-right-panel)] hover:text-[var(--text-primary)]'
                                }`}
                            >
                                {link === 'Dashboard' && <LayoutDashboard className="h-3.5 w-3.5" />}
                                {link === 'Products' && <Package className="h-3.5 w-3.5" />}
                                {link === 'Orders' && <ShoppingBag className="h-3.5 w-3.5" />}
                                {link === 'Customers' && <Users className="h-3.5 w-3.5" />}
                                {link === 'Analytics' && <BarChart2 className="h-3.5 w-3.5" />}
                                {link}
                            </button>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button onClick={toggleTheme} className="h-9 w-9 rounded-xl border border-[var(--card-border)] flex items-center justify-center cursor-pointer hover:bg-[var(--bg-right-panel)] transition-colors">
                            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-neutral-500" />}
                        </button>

                        {/* Notifications */}
                        <button className="relative h-9 w-9 rounded-xl border border-[var(--card-border)] flex items-center justify-center cursor-pointer hover:bg-[var(--bg-right-panel)] transition-colors">
                            <Bell className="h-4 w-4 text-[var(--text-secondary)]" />
                            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">6</span>
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(o => !o)}
                                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border border-[var(--card-border)] cursor-pointer hover:bg-[var(--bg-right-panel)] transition-all"
                            >
                                <div className="h-7 w-7 rounded-lg bg-[var(--gold-accent)] text-white flex items-center justify-center text-[10px] font-black">
                                    {initials(user?.name)}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <div className="text-[11px] font-black text-[var(--text-primary)] leading-tight">{user?.name || 'Vendor Dhruva'}</div>
                                    <div className="text-[9px] font-semibold text-[var(--text-muted)]">Store Admin</div>
                                </div>
                                <ChevronDown className={`h-3.5 w-3.5 text-[var(--text-muted)] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-44 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-xl py-1.5 z-50">
                                    <button className="w-full text-left px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-right-panel)] flex items-center gap-2">
                                        <Eye className="h-3.5 w-3.5" /> My Profile
                                    </button>
                                    <hr className="border-[var(--card-border)] my-1 opacity-50" />
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/5 flex items-center gap-2">
                                        <LogOut className="h-3.5 w-3.5" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pt-8 pb-12 space-y-8">

            {/* ══════════════ PRODUCTS PAGE ══════════════ */}
            {activeNav === 'Products' && (() => {
                const PROD_CATEGORIES = ['All Categories', 'Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Automotive']
                const PROD_STATUSES   = ['All Status', 'Active', 'Out of Stock', 'Low Stock']

                const getStockLabel = (stock) => {
                    if (stock === 0) return { label: 'Out of Stock', cls: 'text-rose-500' }
                    if (stock < 15) return { label: 'Low Stock', cls: 'text-amber-500' }
                    return { label: 'In Stock', cls: 'text-emerald-500' }
                }

                const filtered = sellerProducts.filter(p => {
                    const matchSearch = p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
                        (p.sku || '').toLowerCase().includes(prodSearch.toLowerCase())
                    const matchCat = prodCategory === 'All Categories' || p.category === prodCategory
                    const stockInfo = getStockLabel(p.stock)
                    const matchStatus = prodStatus === 'All Status' || stockInfo.label === prodStatus ||
                        (prodStatus === 'Active' && p.stock > 0)
                    return matchSearch && matchCat && matchStatus
                })

                const totalPages = Math.max(1, Math.ceil(filtered.length / PROD_PER_PAGE))
                const safePage   = Math.min(prodPage, totalPages)
                const paginated  = filtered.slice((safePage - 1) * PROD_PER_PAGE, safePage * PROD_PER_PAGE)

                const totalRevenue = sellerProducts.reduce((s, p) => s + (p.price * (p.stock || 0)), 0)
                const activeCount  = sellerProducts.filter(p => p.stock > 0).length
                const outOfStock   = sellerProducts.filter(p => p.stock === 0).length
                const lowStock     = sellerProducts.filter(p => p.stock > 0 && p.stock < 15).length

                const PROD_STAT_CARDS = [
                    { label: 'Total Products',  value: sellerProducts.length, sub: 'All products in store',   icon: <Package className="h-5 w-5" />,       color: 'text-orange-500',  bg: 'bg-orange-500/10 border-orange-500/20' },
                    { label: 'Active Products',  value: activeCount,           sub: 'Currently active',        icon: <CheckCircle className="h-5 w-5" />,    color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                    { label: 'Out of Stock',     value: outOfStock,            sub: 'Not available',           icon: <AlertTriangle className="h-5 w-5" />, color: 'text-rose-500',    bg: 'bg-rose-500/10 border-rose-500/20' },
                    { label: 'Low Stock',        value: lowStock,              sub: 'Stock running low',       icon: <Clock className="h-5 w-5" />,          color: 'text-amber-500',   bg: 'bg-amber-500/10 border-amber-500/20' },
                    { label: 'Total Revenue',    value: `₹${(totalRevenue/1000).toFixed(1)}K`, sub: '↑ 12.5% vs last week', icon: <TrendingUp className="h-5 w-5" />, color: 'text-violet-500', bg: 'bg-violet-500/10 border-violet-500/20', isRevenue: true },
                ]

                const getCategoryColor = (cat) => {
                    const map = {
                        'Electronics':   'bg-blue-500/10 text-blue-600 border-blue-500/20',
                        'Fashion':       'bg-pink-500/10 text-pink-600 border-pink-500/20',
                        'Home & Living': 'bg-teal-500/10 text-teal-600 border-teal-500/20',
                        'Beauty':        'bg-rose-500/10 text-rose-600 border-rose-500/20',
                        'Sports':        'bg-green-500/10 text-green-600 border-green-500/20',
                        'Automotive':    'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
                        'Furniture':     'bg-amber-500/10 text-amber-600 border-amber-500/20',
                        'Footwear':      'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
                        'Bags':          'bg-orange-500/10 text-orange-600 border-orange-500/20',
                        'Toys & Games':  'bg-purple-500/10 text-purple-600 border-purple-500/20',
                        'Mobiles':       'bg-blue-500/10 text-blue-600 border-blue-500/20',
                        'Laptops':       'bg-sky-500/10 text-sky-600 border-sky-500/20',
                        'Headphones':    'bg-violet-500/10 text-violet-600 border-violet-500/20',
                        'Smart Watches': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
                        'Cameras':       'bg-neutral-500/10 text-neutral-600 border-neutral-500/20',
                        'Speakers':      'bg-teal-500/10 text-teal-600 border-teal-500/20',
                        'Accessories':   'bg-gray-500/10 text-gray-600 border-gray-500/20',
                        'TV & Audio':    'bg-purple-500/10 text-purple-600 border-purple-500/20',
                    }
                    return map[cat] || 'bg-neutral-500/10 text-neutral-600 border-neutral-500/20'
                }

                const allSelected = paginated.length > 0 && paginated.every(p => selectedRows.includes(p.id))
                const toggleAll = () => {
                    if (allSelected) setSelectedRows(r => r.filter(id => !paginated.find(p => p.id === id)))
                    else setSelectedRows(r => [...new Set([...r, ...paginated.map(p => p.id)])])
                }

                return (
                    <div className="space-y-6" onClick={() => moreMenu && setMoreMenu(null)}>

                        {/* Page Header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="font-['Outfit'] text-2xl font-black text-[var(--text-primary)] tracking-tight">Products</h1>
                                <p className="text-xs font-semibold text-[var(--text-muted)] mt-1">Manage and organize all products in your store.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleExport}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--card-border)] text-[var(--text-secondary)] text-xs font-bold hover:bg-[var(--bg-right-panel)] transition-colors cursor-pointer"
                                >
                                    <Download className="h-3.5 w-3.5" /> Export
                                </button>
                                <button
                                    onClick={openAdd}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white text-xs font-black transition-all shadow-md cursor-pointer"
                                >
                                    <Plus className="h-4 w-4" /> Add New Product
                                </button>
                            </div>
                        </div>

                        {/* Stat Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {PROD_STAT_CARDS.map((card, i) => (
                                <div key={i} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-xl border shrink-0 ${card.color} ${card.bg}`}>
                                            {card.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">{card.label}</div>
                                            <div className={`font-['Outfit'] text-2xl font-black ${card.color} leading-tight mt-0.5`}>{card.value}</div>
                                            <div className={`text-[10px] font-semibold mt-1 ${card.isRevenue ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`}>{card.sub}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Search & Filters */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
                                <input
                                    type="text"
                                    placeholder="Search products by name, SKU..."
                                    value={prodSearch}
                                    onChange={e => { setProdSearch(e.target.value); setProdPage(1) }}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-semibold text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--gold-accent)] transition-colors"
                                />
                            </div>
                            <div className="relative">
                                <select
                                    value={prodCategory}
                                    onChange={e => { setProdCategory(e.target.value); setProdPage(1) }}
                                    className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-semibold text-[var(--text-secondary)] outline-none focus:border-[var(--gold-accent)] cursor-pointer transition-colors"
                                >
                                    {PROD_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)] pointer-events-none" />
                            </div>
                            <div className="relative">
                                <select
                                    value={prodStatus}
                                    onChange={e => { setProdStatus(e.target.value); setProdPage(1) }}
                                    className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-semibold text-[var(--text-secondary)] outline-none focus:border-[var(--gold-accent)] cursor-pointer transition-colors"
                                >
                                    {PROD_STATUSES.map(s => <option key={s}>{s}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)] pointer-events-none" />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--card-border)] text-[var(--text-secondary)] text-xs font-bold hover:bg-[var(--bg-right-panel)] transition-colors cursor-pointer">
                                <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
                            </button>
                        </div>

                        {/* Product Table */}
                        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-sm">
                            {/* Table Header */}
                            <div className="grid items-center border-b border-[var(--card-border)] px-5 py-3 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider"
                                style={{ gridTemplateColumns: '28px 2fr 1.1fr 1.1fr 0.8fr 1.2fr 0.9fr 0.9fr' }}>
                                <div>
                                    <input type="checkbox" checked={allSelected} onChange={toggleAll}
                                        className="h-3.5 w-3.5 rounded accent-[var(--gold-accent)] cursor-pointer" />
                                </div>
                                <div>Product</div>
                                <div>SKU</div>
                                <div>Category</div>
                                <div>Price</div>
                                <div>Stock</div>
                                <div>Status</div>
                                <div className="text-right">Actions</div>
                            </div>

                            {/* Table Rows */}
                            <div className="divide-y divide-[var(--card-border)]/50">
                                {paginated.length === 0 ? (
                                    <div className="py-16 flex flex-col items-center gap-3 text-[var(--text-muted)]">
                                        <Package className="h-8 w-8 opacity-30" />
                                        <span className="text-xs font-semibold">No products found</span>
                                    </div>
                                ) : paginated.map(prod => {
                                    const stockInfo = getStockLabel(prod.stock)
                                    const isActive  = activeToggles[prod.id] ?? prod.stock > 0
                                    const isSelected = selectedRows.includes(prod.id)
                                    const menuOpen  = moreMenu?.prodId === prod.id
                                    return (
                                        <div
                                            key={prod.id}
                                            className={`grid items-center px-5 py-3.5 hover:bg-[var(--bg-right-panel)]/60 transition-colors ${isSelected ? 'bg-[var(--gold-bg-pill)]' : ''}`}
                                            style={{ gridTemplateColumns: '28px 2fr 1.1fr 1.1fr 0.8fr 1.2fr 0.9fr 0.9fr' }}
                                        >
                                            {/* Checkbox */}
                                            <div>
                                                <input type="checkbox" checked={isSelected}
                                                    onChange={() => setSelectedRows(r => r.includes(prod.id) ? r.filter(id => id !== prod.id) : [...r, prod.id])}
                                                    className="h-3.5 w-3.5 rounded accent-[var(--gold-accent)] cursor-pointer" />
                                            </div>
                                            {/* Product */}
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="h-11 w-11 rounded-xl overflow-hidden border border-[var(--card-border)] bg-[var(--bg-right-panel)] shrink-0 flex items-center justify-center p-1">
                                                    <img src={prod.image} alt={prod.name} className="h-full w-full object-contain"
                                                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'} />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-xs font-bold text-[var(--text-primary)] truncate max-w-[180px]">{prod.name.split('(')[0].trim()}</div>
                                                    <div className="text-[10px] font-semibold text-[var(--text-muted)] truncate max-w-[180px]">{prod.brand} | {prod.subcategory || prod.category}</div>
                                                </div>
                                            </div>
                                            {/* SKU */}
                                            <div className="text-[10px] font-mono font-bold text-[var(--text-secondary)]">{prod.sku}</div>
                                            {/* Category */}
                                            <div>
                                                <span className={`inline-block px-2.5 py-0.5 rounded-[6px] text-[9px] font-black border ${getCategoryColor(prod.subcategory || prod.category)}`}>
                                                    {prod.subcategory || prod.category}
                                                </span>
                                            </div>
                                            {/* Price */}
                                            <div className="text-xs font-black text-[var(--text-primary)]">₹{Number(prod.price).toLocaleString('en-IN')}</div>
                                            {/* Stock */}
                                            <div>
                                                <div className="text-xs font-black text-[var(--text-primary)]">{prod.stock}</div>
                                                <div className={`text-[10px] font-bold ${stockInfo.cls}`}>{stockInfo.label}</div>
                                            </div>
                                            {/* Toggle */}
                                            <div>
                                                <button
                                                    onClick={e => { e.stopPropagation(); setActiveToggles(t => ({ ...t, [prod.id]: !t[prod.id] })) }}
                                                    className={`relative h-5 w-9 rounded-full transition-colors duration-300 cursor-pointer ${isActive ? 'bg-[var(--gold-accent)]' : 'bg-[var(--card-border)]'}`}
                                                >
                                                    <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-300 ${isActive ? 'left-[18px]' : 'left-0.5'}`} />
                                                </button>
                                            </div>
                                            {/* Actions */}
                                            <div className="flex items-center justify-end gap-1 relative">
                                                {/* Edit */}
                                                <button
                                                    onClick={e => { e.stopPropagation(); openEdit(prod) }}
                                                    className="h-7 w-7 rounded-lg hover:bg-[var(--bg-right-panel)] flex items-center justify-center cursor-pointer transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                                                </button>
                                                {/* View */}
                                                <button
                                                    onClick={e => { e.stopPropagation(); setViewModal(prod) }}
                                                    className="h-7 w-7 rounded-lg hover:bg-[var(--bg-right-panel)] flex items-center justify-center cursor-pointer transition-colors"
                                                    title="View"
                                                >
                                                    <Eye className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                                                </button>
                                                {/* More */}
                                                <div className="relative">
                                                    <button
                                                        onClick={e => { e.stopPropagation(); setMoreMenu(prev => prev?.prodId === prod.id ? null : { prodId: prod.id }) }}
                                                        className="h-7 w-7 rounded-lg hover:bg-[var(--bg-right-panel)] flex items-center justify-center cursor-pointer transition-colors"
                                                        title="More"
                                                    >
                                                        <MoreHorizontal className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                                                    </button>
                                                    {menuOpen && (
                                                        <div
                                                            className="absolute right-0 top-8 z-50 w-44 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-2xl py-1.5 overflow-hidden"
                                                            onClick={e => e.stopPropagation()}
                                                        >
                                                            <button
                                                                onClick={() => { openEdit(prod); setMoreMenu(null) }}
                                                                className="w-full text-left px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-right-panel)] flex items-center gap-2 cursor-pointer"
                                                            >
                                                                <Edit2 className="h-3.5 w-3.5" /> Edit Product
                                                            </button>
                                                            <button
                                                                onClick={() => { setViewModal(prod); setMoreMenu(null) }}
                                                                className="w-full text-left px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-right-panel)] flex items-center gap-2 cursor-pointer"
                                                            >
                                                                <Eye className="h-3.5 w-3.5" /> View Details
                                                            </button>
                                                            <button
                                                                onClick={() => handleProdDuplicate(prod)}
                                                                className="w-full text-left px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-right-panel)] flex items-center gap-2 cursor-pointer"
                                                            >
                                                                <Plus className="h-3.5 w-3.5" /> Duplicate
                                                            </button>
                                                            <hr className="border-[var(--card-border)] my-1 opacity-60" />
                                                            <button
                                                                onClick={() => { setDeleteConfirm(prod); setMoreMenu(null) }}
                                                                className="w-full text-left px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/5 flex items-center gap-2 cursor-pointer"
                                                            >
                                                                <X className="h-3.5 w-3.5" /> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Pagination Footer */}
                            <div className="flex items-center justify-between px-5 py-3.5 border-t border-[var(--card-border)] bg-[var(--bg-right-panel)]/30">
                                <span className="text-[10px] font-semibold text-[var(--text-muted)]">
                                    Showing {filtered.length === 0 ? 0 : Math.min((safePage - 1) * PROD_PER_PAGE + 1, filtered.length)} to {Math.min(safePage * PROD_PER_PAGE, filtered.length)} of {filtered.length} products
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <button disabled={safePage === 1} onClick={() => setProdPage(p => Math.max(1, p - 1))}
                                        className="h-7 w-7 rounded-lg border border-[var(--card-border)] flex items-center justify-center hover:bg-[var(--bg-right-panel)] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors">
                                        <ChevronLeft className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                                    </button>
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        const page = i + 1
                                        return (
                                            <button key={page} onClick={() => setProdPage(page)}
                                                className={`h-7 w-7 rounded-lg text-[10px] font-black transition-colors cursor-pointer ${
                                                    safePage === page
                                                        ? 'bg-[var(--gold-accent)] text-white border border-[var(--gold-accent)]'
                                                        : 'border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--bg-right-panel)]'
                                                }`}>{page}</button>
                                        )
                                    })}
                                    {totalPages > 5 && <span className="text-[var(--text-muted)] text-xs font-bold">...</span>}
                                    {totalPages > 5 && (
                                        <button onClick={() => setProdPage(totalPages)}
                                            className={`h-7 w-7 rounded-lg text-[10px] font-black border cursor-pointer transition-colors ${
                                                safePage === totalPages ? 'bg-[var(--gold-accent)] text-white border-[var(--gold-accent)]' : 'border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--bg-right-panel)]'
                                            }`}>{totalPages}</button>
                                    )}
                                    <button disabled={safePage === totalPages} onClick={() => setProdPage(p => Math.min(totalPages, p + 1))}
                                        className="h-7 w-7 rounded-lg border border-[var(--card-border)] flex items-center justify-center hover:bg-[var(--bg-right-panel)] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors">
                                        <ChevronRight className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })()}

            {/* ══════════════ ORDERS PAGE ══════════════ */}
            {activeNav === 'Orders' && (() => {
                const ORD_STATUSES  = ['All Status','Pending','Processing','Confirmed','Shipped','Delivered','Cancelled']
                const ORD_PAYMENTS  = ['All Payment Status','Paid','COD','Pending']

                const filtered = allOrders.filter(o => {
                    const q = ordSearch.toLowerCase()
                    const matchQ = !q || o.OrderID.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)
                    const matchS = ordStatus  === 'All Status'         || o.OrderStatus === ordStatus
                    const matchP = ordPayment === 'All Payment Status'  || o.payBadge   === ordPayment
                    return matchQ && matchS && matchP
                })

                const totalPages = Math.max(1, Math.ceil(filtered.length / ORD_PER_PAGE))
                const safePage   = Math.min(ordPage, totalPages)
                const paginated  = filtered.slice((safePage - 1) * ORD_PER_PAGE, safePage * ORD_PER_PAGE)

                const ordStatBadge = (s) => {
                    if (s === 'Delivered')  return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/25'
                    if (s === 'Processing') return 'bg-blue-500/10 text-blue-600 border border-blue-500/25'
                    if (s === 'Shipped')    return 'bg-violet-500/10 text-violet-600 border border-violet-500/25'
                    if (s === 'Confirmed')  return 'bg-amber-500/10 text-amber-600 border border-amber-500/25'
                    if (s === 'Cancelled')  return 'bg-rose-500/10 text-rose-600 border border-rose-500/25'
                    if (s === 'Pending')    return 'bg-orange-500/10 text-orange-600 border border-orange-500/25'
                    return 'bg-neutral-500/10 text-neutral-500 border border-neutral-500/20'
                }
                const payBadgeStyle = (p) => {
                    if (p === 'Paid') return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    if (p === 'COD')  return 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                    return 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                }

                const ORDER_STAT_CARDS = [
                    { label:'Total Orders',  value: allOrders.length,                                           sub:'All time orders',         icon:<ShoppingBag className="h-5 w-5" />, color:'text-orange-500',  bg:'bg-orange-500/10 border-orange-500/20' },
                    { label:'Pending',       value: allOrders.filter(o=>o.OrderStatus==='Pending').length,      sub:'Awaiting processing',     icon:<Clock className="h-5 w-5" />,       color:'text-amber-500',   bg:'bg-amber-500/10 border-amber-500/20',  subColor:'text-amber-500' },
                    { label:'Processing',    value: allOrders.filter(o=>o.OrderStatus==='Processing').length,   sub:'Orders in process',       icon:<RefreshCw className="h-5 w-5" />,   color:'text-blue-500',    bg:'bg-blue-500/10 border-blue-500/20',    subColor:'text-blue-500' },
                    { label:'Delivered',     value: allOrders.filter(o=>o.OrderStatus==='Delivered').length,    sub:'Successfully delivered',  icon:<Truck className="h-5 w-5" />,       color:'text-emerald-500', bg:'bg-emerald-500/10 border-emerald-500/20' },
                    { label:'Cancelled',     value: allOrders.filter(o=>o.OrderStatus==='Cancelled').length,    sub:'Cancelled orders',        icon:<X className="h-5 w-5" />,           color:'text-rose-500',    bg:'bg-rose-500/10 border-rose-500/20',    subColor:'text-rose-500' },
                ]

                return (
                    <div className="space-y-6">

                        {/* Page Header */}
                        <div>
                            <h1 className="font-['Outfit'] text-2xl font-black text-[var(--text-primary)] tracking-tight">Orders</h1>
                            <p className="text-xs font-semibold text-[var(--text-muted)] mt-1">Track and manage all customer orders.</p>
                        </div>

                        {/* Stat Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {ORDER_STAT_CARDS.map((card, i) => (
                                <div key={i} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-xl border shrink-0 ${card.color} ${card.bg}`}>{card.icon}</div>
                                        <div className="min-w-0">
                                            <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">{card.label}</div>
                                            <div className={`font-['Outfit'] text-2xl font-black ${card.color} leading-tight mt-0.5`}>{card.value}</div>
                                            <div className={`text-[10px] font-semibold mt-1 ${card.subColor || 'text-[var(--text-muted)]'}`}>{card.sub}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Search & Filters */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
                                <input
                                    type="text" placeholder="Search by order ID, customer name..."
                                    value={ordSearch}
                                    onChange={e => { setOrdSearch(e.target.value); setOrdPage(1) }}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-semibold text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--gold-accent)] transition-colors"
                                />
                            </div>
                            <div className="relative">
                                <select value={ordStatus} onChange={e => { setOrdStatus(e.target.value); setOrdPage(1) }}
                                    className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-semibold text-[var(--text-secondary)] outline-none focus:border-[var(--gold-accent)] cursor-pointer transition-colors">
                                    {ORD_STATUSES.map(s => <option key={s}>{s}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)] pointer-events-none" />
                            </div>
                            <div className="relative">
                                <select value={ordPayment} onChange={e => { setOrdPayment(e.target.value); setOrdPage(1) }}
                                    className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-semibold text-[var(--text-secondary)] outline-none focus:border-[var(--gold-accent)] cursor-pointer transition-colors">
                                    {ORD_PAYMENTS.map(p => <option key={p}>{p}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)] pointer-events-none" />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--gold-accent)] text-[var(--gold-accent)] bg-[var(--gold-bg-pill)] text-xs font-bold hover:bg-[var(--gold-accent)] hover:text-white transition-colors cursor-pointer">
                                <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
                            </button>
                        </div>

                        {/* Orders Table */}
                        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-sm">
                            {/* Table Header */}
                            <div className="grid items-center border-b border-[var(--card-border)] px-5 py-3 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider bg-[var(--bg-right-panel)]/40"
                                style={{ gridTemplateColumns: '28px 1.2fr 1.8fr 1.4fr 0.8fr 0.9fr 1.1fr 1fr 0.6fr' }}>
                                <div />
                                <div>Order ID</div>
                                <div>Customer</div>
                                <div>Items</div>
                                <div>Amount</div>
                                <div>Payment</div>
                                <div>Status</div>
                                <div>Date</div>
                                <div className="text-right">Actions</div>
                            </div>

                            {/* Rows */}
                            <div className="divide-y divide-[var(--card-border)]/50">
                                {paginated.length === 0 ? (
                                    <div className="py-16 flex flex-col items-center gap-3 text-[var(--text-muted)]">
                                        <ShoppingBag className="h-8 w-8 opacity-30" />
                                        <span className="text-xs font-semibold">No orders found</span>
                                    </div>
                                ) : paginated.map(order => (
                                    <div key={order.OrderID}
                                        className="grid items-center px-5 py-3.5 hover:bg-[var(--bg-right-panel)]/60 transition-colors cursor-pointer"
                                        style={{ gridTemplateColumns: '28px 1.2fr 1.8fr 1.4fr 0.8fr 0.9fr 1.1fr 1fr 0.6fr' }}
                                        onClick={() => setOrdDetail(order)}
                                    >
                                        {/* Expand arrow */}
                                        <div className="text-[var(--text-muted)]">
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </div>

                                        {/* Order ID */}
                                        <div>
                                            <div className="text-xs font-black text-[var(--text-primary)]"># {order.OrderID}</div>
                                            <div className="text-[10px] font-semibold text-[var(--text-muted)] mt-0.5">{order.itemCount} item{order.itemCount > 1 ? 's' : ''}</div>
                                        </div>

                                        {/* Customer */}
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0"
                                                style={{ backgroundColor: order.color }}>
                                                {order.initials}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-xs font-bold text-[var(--text-primary)] truncate">{order.customer}</div>
                                                <div className="text-[10px] font-semibold text-[var(--text-muted)] truncate">{order.email}</div>
                                                <div className="text-[10px] font-semibold text-[var(--text-muted)]">{order.phone}</div>
                                            </div>
                                        </div>

                                        {/* Items thumbnails */}
                                        <div className="flex items-center gap-1.5">
                                            {order.items.slice(0, 2).map((item, ii) => (
                                                <div key={ii} className="h-9 w-9 rounded-xl overflow-hidden border border-[var(--card-border)] bg-[var(--bg-right-panel)] shrink-0 flex items-center justify-center p-0.5">
                                                    <img src={item.img} alt={item.name} className="h-full w-full object-contain rounded-lg"
                                                        onError={e => e.target.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&q=80'} />
                                                </div>
                                            ))}
                                            {order.items.length > 2 && (
                                                <div className="h-9 w-9 rounded-xl border border-[var(--card-border)] bg-[var(--bg-right-panel)] flex items-center justify-center text-[9px] font-black text-[var(--text-secondary)]">
                                                    +{order.items.length - 2}
                                                </div>
                                            )}
                                        </div>

                                        {/* Amount */}
                                        <div className="text-xs font-black text-[var(--text-primary)]">₹{order.amount.toLocaleString('en-IN')}</div>

                                        {/* Payment */}
                                        <div>
                                            <span className={`inline-block px-2 py-0.5 rounded-[6px] text-[9px] font-black border ${payBadgeStyle(order.payBadge)}`}>
                                                {order.payBadge}
                                            </span>
                                            <div className="text-[10px] font-semibold text-[var(--text-muted)] mt-0.5">{order.payment}</div>
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <span className={`inline-block px-2.5 py-0.5 rounded-[6px] text-[9px] font-black border ${ordStatBadge(order.OrderStatus)}`}>
                                                {order.OrderStatus}
                                            </span>
                                            <div className="text-[10px] font-semibold text-[var(--text-muted)] mt-0.5 truncate max-w-[110px]">{order.statusNote}</div>
                                        </div>

                                        {/* Date */}
                                        <div>
                                            <div className="text-[10px] font-bold text-[var(--text-primary)]">
                                                {new Date(order.OrderDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                                            </div>
                                            <div className="text-[9px] font-semibold text-[var(--text-muted)] mt-0.5">
                                                {new Date(order.OrderDate).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true})}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex justify-end" onClick={e => e.stopPropagation()}>
                                            <button
                                                onClick={() => setOrdDetail(order)}
                                                className="h-7 w-7 rounded-lg hover:bg-[var(--bg-right-panel)] flex items-center justify-center cursor-pointer transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Footer */}
                            <div className="flex items-center justify-between px-5 py-3.5 border-t border-[var(--card-border)] bg-[var(--bg-right-panel)]/30">
                                <span className="text-[10px] font-semibold text-[var(--text-muted)]">
                                    Showing {filtered.length === 0 ? 0 : Math.min((safePage-1)*ORD_PER_PAGE+1, filtered.length)} to {Math.min(safePage*ORD_PER_PAGE, filtered.length)} of {filtered.length} orders
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <button disabled={safePage === 1} onClick={() => setOrdPage(p => Math.max(1, p-1))}
                                        className="h-7 w-7 rounded-lg border border-[var(--card-border)] flex items-center justify-center hover:bg-[var(--bg-right-panel)] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors">
                                        <ChevronLeft className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                                    </button>
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        const page = i + 1
                                        return (
                                            <button key={page} onClick={() => setOrdPage(page)}
                                                className={`h-7 w-7 rounded-lg text-[10px] font-black transition-colors cursor-pointer ${
                                                    safePage === page
                                                        ? 'bg-[var(--gold-accent)] text-white border border-[var(--gold-accent)]'
                                                        : 'border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--bg-right-panel)]'
                                                }`}>{page}</button>
                                        )
                                    })}
                                    {totalPages > 5 && <span className="text-[var(--text-muted)] text-xs font-bold">...</span>}
                                    {totalPages > 5 && (
                                        <button onClick={() => setOrdPage(totalPages)}
                                            className={`h-7 w-7 rounded-lg text-[10px] font-black border cursor-pointer transition-colors ${
                                                safePage === totalPages ? 'bg-[var(--gold-accent)] text-white border-[var(--gold-accent)]' : 'border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--bg-right-panel)]'
                                            }`}>{totalPages}</button>
                                    )}
                                    <button disabled={safePage === totalPages} onClick={() => setOrdPage(p => Math.min(totalPages, p+1))}
                                        className="h-7 w-7 rounded-lg border border-[var(--card-border)] flex items-center justify-center hover:bg-[var(--bg-right-panel)] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors">
                                        <ChevronRight className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ── ORDER DETAIL DRAWER ────────────────────────────────── */}
                        {ordDetail && (() => {
                            const STATUS_STEPS = ['Pending','Processing','Confirmed','Shipped','Delivered']
                            const currentStepIdx = STATUS_STEPS.indexOf(ordDetail.OrderStatus)
                            const isCancelled = ordDetail.OrderStatus === 'Cancelled'
                            return (
                            <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setOrdDetail(null)}>
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                                <div
                                    className="relative w-full max-w-[420px] h-full flex flex-col shadow-2xl"
                                    style={{ background: 'var(--card-bg)', borderLeft: '1px solid var(--card-border)', overflowY: 'auto' }}
                                    onClick={e => e.stopPropagation()}
                                >
                                    {/* ── HERO HEADER ── */}
                                    {/* Sticky close bar */}
                                    <div className="sticky top-0 z-20 flex items-center justify-end px-4 pt-4 pb-0 pointer-events-none">
                                        <button
                                            onClick={() => setOrdDetail(null)}
                                            className="pointer-events-auto h-8 w-8 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] shadow-md flex items-center justify-center text-[var(--text-muted)] hover:text-rose-500 cursor-pointer transition-all hover:scale-110"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    <div className="relative overflow-hidden shrink-0 -mt-8" style={{ background: `linear-gradient(135deg, ${ordDetail.color}22 0%, ${ordDetail.color}08 100%)`, borderBottom: '1px solid var(--card-border)' }}>
                                        {/* Decorative blobs */}
                                        <div className="absolute top-0 right-0 h-28 w-28 rounded-full blur-3xl opacity-20" style={{ background: ordDetail.color }} />
                                        <div className="absolute bottom-0 left-0 h-16 w-16 rounded-full blur-2xl opacity-10" style={{ background: ordDetail.color }} />

                                        <div className="px-6 pt-6 pb-5 relative z-10">
                                            {/* Customer Avatar + Name */}
                                            <div className="flex items-center gap-4 mb-5">
                                                <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg shrink-0 ring-4 ring-white/20"
                                                    style={{ backgroundColor: ordDetail.color }}>
                                                    {ordDetail.initials}
                                                </div>
                                                <div>
                                                    <div className="font-['Outfit'] text-base font-black text-[var(--text-primary)]">{ordDetail.customer}</div>
                                                    <div className="text-[11px] font-semibold text-[var(--text-muted)]">{ordDetail.email}</div>
                                                    <div className="text-[11px] font-semibold text-[var(--text-muted)]">{ordDetail.phone}</div>
                                                </div>
                                            </div>

                                            {/* Order meta row */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Order ID</div>
                                                    <div className="font-['Outfit'] text-base font-black text-[var(--text-primary)] mt-0.5">#{ordDetail.OrderID}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Date</div>
                                                    <div className="text-xs font-bold text-[var(--text-primary)] mt-0.5">
                                                        {new Date(ordDetail.OrderDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                                                    </div>
                                                    <div className="text-[10px] font-semibold text-[var(--text-muted)]">
                                                        {new Date(ordDetail.OrderDate).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true})}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black border ${ordStatBadge(ordDetail.OrderStatus)}`}>
                                                        {ordDetail.OrderStatus}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── BODY ── */}
                                    <div className="p-5 space-y-4 flex-1">

                                        {/* Order Progress Timeline */}
                                        {!isCancelled && (
                                            <div className="bg-[var(--bg-right-panel)] border border-[var(--card-border)] rounded-2xl p-4">
                                                <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-4">Order Progress</div>
                                                <div className="flex items-center justify-between relative">
                                                    {/* Progress bar track */}
                                                    <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-[var(--card-border)] z-0" />
                                                    <div className="absolute top-3.5 left-0 h-0.5 z-0 transition-all duration-700 rounded-full"
                                                        style={{
                                                            width: currentStepIdx >= 0 ? `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` : '0%',
                                                            background: 'var(--gold-accent)'
                                                        }} />
                                                    {STATUS_STEPS.map((step, idx) => {
                                                        const done = currentStepIdx >= idx
                                                        const active = currentStepIdx === idx
                                                        return (
                                                            <div key={step} className="flex flex-col items-center gap-1.5 z-10">
                                                                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[9px] font-black transition-all duration-300 ${
                                                                    active ? 'bg-[var(--gold-accent)] text-white ring-4 ring-[var(--gold-accent)]/20 scale-110'
                                                                    : done ? 'bg-[var(--gold-accent)] text-white'
                                                                    : 'bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-[var(--text-muted)]'
                                                                }`}>
                                                                    {done && !active ? <Check className="h-3 w-3" /> : idx + 1}
                                                                </div>
                                                                <span className={`text-[8px] font-black text-center leading-tight ${done ? 'text-[var(--gold-accent)]' : 'text-[var(--text-muted)]'}`}>
                                                                    {step}
                                                                </span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Cancelled banner */}
                                        {isCancelled && (
                                            <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/20">
                                                <div className="h-8 w-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                                                    <X className="h-4 w-4 text-rose-500" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-black text-rose-500">Order Cancelled</div>
                                                    <div className="text-[10px] font-semibold text-rose-400/70 mt-0.5">{ordDetail.statusNote}</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Total + Payment — combined premium card */}
                                        <div className="relative rounded-2xl overflow-hidden border border-[var(--card-border)]"
                                            style={{ background: `linear-gradient(135deg, var(--gold-accent)14 0%, var(--card-bg) 60%)` }}>
                                            <div className="p-4 flex items-center justify-between">
                                                <div>
                                                    <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Total Amount</div>
                                                    <div className="font-['Outfit'] text-2xl font-black text-[var(--gold-accent)] mt-1">
                                                        ₹{ordDetail.amount.toLocaleString('en-IN')}
                                                    </div>
                                                    <div className="text-[10px] font-semibold text-[var(--text-muted)] mt-0.5">
                                                        {ordDetail.itemCount} item{ordDetail.itemCount > 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Payment</div>
                                                    <span className={`inline-block px-2.5 py-1 rounded-xl text-[10px] font-black border ${payBadgeStyle(ordDetail.payBadge)}`}>
                                                        {ordDetail.payBadge}
                                                    </span>
                                                    <div className="text-[10px] font-semibold text-[var(--text-muted)] mt-1">{ordDetail.payment}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className="bg-[var(--bg-right-panel)] border border-[var(--card-border)] rounded-2xl overflow-hidden">
                                            <div className="px-4 py-3 border-b border-[var(--card-border)] flex items-center justify-between">
                                                <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Items Ordered</div>
                                                <div className="text-[9px] font-black text-[var(--text-secondary)] bg-[var(--card-bg)] border border-[var(--card-border)] px-2 py-0.5 rounded-full">{ordDetail.itemCount}</div>
                                            </div>
                                            <div className="divide-y divide-[var(--card-border)]/50">
                                                {ordDetail.items.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3 px-4 py-3">
                                                        <div className="h-12 w-12 rounded-xl overflow-hidden border border-[var(--card-border)] bg-[var(--card-bg)] shrink-0 flex items-center justify-center p-1.5 shadow-sm">
                                                            <img src={item.img} alt={item.name} className="h-full w-full object-contain"
                                                                onError={e => e.target.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&q=80'} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-xs font-bold text-[var(--text-primary)] truncate">{item.name}</div>
                                                            <div className="text-[10px] font-semibold text-[var(--text-muted)] mt-0.5">Qty: 1</div>
                                                        </div>
                                                        <Package className="h-3.5 w-3.5 text-[var(--text-muted)] shrink-0" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Update Status */}
                                        <div className="bg-[var(--bg-right-panel)] border border-[var(--card-border)] rounded-2xl p-4">
                                            <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">Update Order Status</div>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['Pending','Processing','Confirmed','Shipped','Delivered','Cancelled'].map(s => {
                                                    const isActive = ordDetail.OrderStatus === s
                                                    const isCancelBtn = s === 'Cancelled'
                                                    return (
                                                        <button key={s}
                                                            onClick={() => {
                                                                setAllOrders(prev => prev.map(o => o.OrderID === ordDetail.OrderID ? {...o, OrderStatus: s} : o))
                                                                setOrdDetail(prev => ({...prev, OrderStatus: s}))
                                                            }}
                                                            className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-[10px] font-black border cursor-pointer transition-all ${
                                                                isActive
                                                                    ? isCancelBtn ? 'bg-rose-500/10 text-rose-600 border-rose-500/30 ring-2 ring-rose-500/20'
                                                                        : 'bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] border-[var(--gold-accent)]/30 ring-2 ring-[var(--gold-accent)]/20'
                                                                    : isCancelBtn ? 'border-rose-500/20 text-rose-500/60 hover:bg-rose-500/5 hover:text-rose-500 hover:border-rose-500/30'
                                                                        : 'border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)]'
                                                            }`}>
                                                            {isActive && <Check className="h-3 w-3 shrink-0" />}
                                                            {s}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        )()}
                    </div>
                )
            })()}

            {/* ══════════════ CUSTOMERS PAGE ══════════════ */}
            {activeNav === 'Customers' && (() => {
                const CUST_STATUSES   = ['All Status','Active','Inactive']
                const CUST_LOCATIONS  = ['All Locations','Gujarat','Maharashtra','Tamil Nadu','Delhi','Karnataka','Telangana','West Bengal']

                const filtered = customers.filter(c => {
                    const q = custSearch.toLowerCase()
                    const matchQ = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)
                    const matchS = custStatus   === 'All Status'    || c.status === custStatus
                    const matchL = custLocation === 'All Locations' || c.state  === custLocation
                    return matchQ && matchS && matchL
                })

                const totalPages = Math.max(1, Math.ceil(filtered.length / CUST_PER_PAGE))
                const safePage   = Math.min(custPage, totalPages)
                const paginated  = filtered.slice((safePage - 1) * CUST_PER_PAGE, safePage * CUST_PER_PAGE)

                const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0)
                const avgOrder   = Math.round(totalSpent / customers.reduce((s,c) => s + c.orders, 0))
                const repeatCust = customers.filter(c => c.badge === 'Repeat').length
                const newCust    = customers.filter(c => c.badge === 'New').length

                const STAT_CARDS = [
                    { label:'Total Customers',   value: customers.length,   sub:'All time customers',       icon:<Users className="h-5 w-5" />,     color:'text-orange-500',  bg:'bg-orange-500/10 border-orange-500/20' },
                    { label:'New This Month',     value: newCust,            sub:'Joined this month',        icon:<Users className="h-5 w-5" />,     color:'text-blue-500',    bg:'bg-blue-500/10 border-blue-500/20' },
                    { label:'Repeat Customers',   value: repeatCust,         sub:'Purchased more than once', icon:<ShoppingBag className="h-5 w-5" />, color:'text-emerald-500', bg:'bg-emerald-500/10 border-emerald-500/20' },
                    { label:'Total Spent',        value: `₹${totalSpent.toLocaleString('en-IN')}`, sub:'By all customers', icon:<TrendingUp className="h-5 w-5" />, color:'text-violet-500', bg:'bg-violet-500/10 border-violet-500/20' },
                    { label:'Average Order Value',value: `₹${avgOrder}`,     sub:'Per order',                icon:<Star className="h-5 w-5" />,      color:'text-amber-500',   bg:'bg-amber-500/10 border-amber-500/20' },
                ]

                const handleExportCust = () => {
                    const headers = ['Name','Email','Phone','City','State','Orders','Total Spent','Status','Joined']
                    const rows = customers.map(c => [c.name, c.email, c.phone, c.city, c.state, c.orders, c.totalSpent, c.status, c.joinedDate.toLocaleDateString('en-IN')])
                    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
                    const blob = new Blob([csv], { type: 'text/csv' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a'); a.href = url; a.download = 'customers_export.csv'; a.click()
                    URL.revokeObjectURL(url)
                }

                return (
                    <div className="space-y-6" onClick={() => custMoreMenu && setCustMoreMenu(null)}>

                        {/* Page Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="font-['Outfit'] text-2xl font-black text-[var(--text-primary)] tracking-tight">Customers</h1>
                                <p className="text-xs font-semibold text-[var(--text-muted)] mt-1">View and manage all your store customers.</p>
                            </div>
                            <button onClick={handleExportCust}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--gold-accent)] text-[var(--gold-accent)] text-xs font-bold hover:bg-[var(--gold-accent)] hover:text-white transition-all cursor-pointer">
                                <Download className="h-3.5 w-3.5" /> Export Customers
                            </button>
                        </div>

                        {/* Stat Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {STAT_CARDS.map((card, i) => (
                                <div key={i} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 hover:shadow-md transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-xl border shrink-0 ${card.color} ${card.bg}`}>{card.icon}</div>
                                        <div className="min-w-0">
                                            <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider leading-tight">{card.label}</div>
                                            <div className={`font-['Outfit'] text-xl font-black ${card.color} leading-tight mt-1`}>{card.value}</div>
                                            <div className="text-[10px] font-semibold text-[var(--text-muted)] mt-1">{card.sub}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Search & Filters */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
                                <input type="text" placeholder="Search by name, email or phone..."
                                    value={custSearch}
                                    onChange={e => { setCustSearch(e.target.value); setCustPage(1) }}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-semibold text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--gold-accent)] transition-colors" />
                            </div>
                            <div className="relative">
                                <select value={custStatus} onChange={e => { setCustStatus(e.target.value); setCustPage(1) }}
                                    className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-semibold text-[var(--text-secondary)] outline-none focus:border-[var(--gold-accent)] cursor-pointer transition-colors">
                                    {CUST_STATUSES.map(s => <option key={s}>{s}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)] pointer-events-none" />
                            </div>
                            <div className="relative">
                                <select value={custLocation} onChange={e => { setCustLocation(e.target.value); setCustPage(1) }}
                                    className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-semibold text-[var(--text-secondary)] outline-none focus:border-[var(--gold-accent)] cursor-pointer transition-colors">
                                    {CUST_LOCATIONS.map(l => <option key={l}>{l}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)] pointer-events-none" />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--gold-accent)] text-[var(--gold-accent)] bg-[var(--gold-bg-pill)] text-xs font-bold hover:bg-[var(--gold-accent)] hover:text-white transition-colors cursor-pointer">
                                <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
                            </button>
                        </div>

                        {/* Customer Table */}
                        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-sm">
                            {/* Table Header */}
                            <div className="grid items-center border-b border-[var(--card-border)] px-5 py-3 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider bg-[var(--bg-right-panel)]/40"
                                style={{ gridTemplateColumns: '2fr 1.6fr 1.2fr 0.7fr 1fr 0.8fr 1fr 0.6fr' }}>
                                <div>Customer</div>
                                <div>Contact</div>
                                <div>Location</div>
                                <div>Orders</div>
                                <div>Total Spent</div>
                                <div>Status</div>
                                <div>Joined On</div>
                                <div className="text-right">Actions</div>
                            </div>

                            {/* Rows */}
                            <div className="divide-y divide-[var(--card-border)]/50">
                                {paginated.length === 0 ? (
                                    <div className="py-16 flex flex-col items-center gap-3 text-[var(--text-muted)]">
                                        <Users className="h-8 w-8 opacity-30" />
                                        <span className="text-xs font-semibold">No customers found</span>
                                    </div>
                                ) : paginated.map(cust => (
                                    <div key={cust.id}
                                        className="grid items-center px-5 py-4 hover:bg-[var(--bg-right-panel)]/60 transition-colors cursor-pointer"
                                        style={{ gridTemplateColumns: '2fr 1.6fr 1.2fr 0.7fr 1fr 0.8fr 1fr 0.6fr' }}
                                        onClick={() => setCustDetail(cust)}
                                    >
                                        {/* Customer */}
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-9 w-9 rounded-full flex items-center justify-center text-white text-[11px] font-black shrink-0 shadow-sm"
                                                style={{ backgroundColor: cust.color }}>
                                                {cust.initials}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-bold text-[var(--text-primary)] truncate">{cust.name}</span>
                                                    {cust.badge && (
                                                        <span className={`shrink-0 px-1.5 py-0.5 rounded-[5px] text-[8px] font-black border ${
                                                            cust.badge === 'New'
                                                                ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                                                                : 'bg-violet-500/10 text-violet-600 border-violet-500/20'
                                                        }`}>{cust.badge}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact */}
                                        <div className="min-w-0">
                                            <div className="text-[10px] font-semibold text-[var(--text-secondary)] truncate">{cust.email}</div>
                                            <div className="text-[10px] font-semibold text-[var(--text-muted)] mt-0.5">{cust.phone}</div>
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-start gap-1">
                                            <MapPin className="h-3 w-3 text-[var(--text-muted)] mt-0.5 shrink-0" />
                                            <div>
                                                <div className="text-[10px] font-semibold text-[var(--text-secondary)] truncate">{cust.city}, {cust.state}</div>
                                            </div>
                                        </div>

                                        {/* Orders */}
                                        <div className="text-xs font-black text-[var(--text-primary)]">{cust.orders}</div>

                                        {/* Total Spent */}
                                        <div className="text-xs font-black text-[var(--text-primary)]">
                                            ₹{cust.totalSpent.toLocaleString('en-IN')}
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <span className={`inline-block px-2.5 py-1 rounded-xl text-[9px] font-black border ${
                                                cust.status === 'Active'
                                                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                                    : 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20'
                                            }`}>{cust.status}</span>
                                        </div>

                                        {/* Joined */}
                                        <div className="text-[10px] font-bold text-[var(--text-secondary)]">
                                            {cust.joinedDate.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                                            <button onClick={() => setCustDetail(cust)}
                                                className="h-7 w-7 rounded-lg hover:bg-[var(--bg-right-panel)] flex items-center justify-center cursor-pointer transition-colors" title="View Profile">
                                                <Eye className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                                            </button>
                                            <div className="relative">
                                                <button
                                                    onClick={e => { e.stopPropagation(); setCustMoreMenu(prev => prev?.custId === cust.id ? null : { custId: cust.id }) }}
                                                    className="h-7 w-7 rounded-lg hover:bg-[var(--bg-right-panel)] flex items-center justify-center cursor-pointer transition-colors"
                                                    title="Actions"
                                                >
                                                    <MoreHorizontal className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                                                </button>
                                                {custMoreMenu?.custId === cust.id && (
                                                    <div
                                                        className="absolute right-0 top-8 z-50 w-44 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-2xl py-1.5 overflow-hidden text-left"
                                                        onClick={e => e.stopPropagation()}
                                                    >
                                                        <button
                                                            onClick={() => { setCustDetail(cust); setCustMoreMenu(null) }}
                                                            className="w-full text-left px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-right-panel)] flex items-center gap-2 cursor-pointer border-none bg-transparent"
                                                        >
                                                            <Eye className="h-3.5 w-3.5 text-[var(--text-secondary)]" /> View Profile
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const next = cust.status === 'Active' ? 'Inactive' : 'Active'
                                                                setCustomers(prev => prev.map(c => c.id === cust.id ? {...c, status:next} : c))
                                                                setCustMoreMenu(null)
                                                            }}
                                                            className="w-full text-left px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-right-panel)] flex items-center gap-2 cursor-pointer border-none bg-transparent"
                                                        >
                                                            <RotateCcw className="h-3.5 w-3.5 text-[var(--text-secondary)]" /> Mark {cust.status === 'Active' ? 'Inactive' : 'Active'}
                                                        </button>
                                                        <hr className="border-[var(--card-border)] my-1 opacity-60" />
                                                        <button
                                                            onClick={() => { setCustDeleteConfirm(cust); setCustMoreMenu(null) }}
                                                            className="w-full text-left px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/5 flex items-center gap-2 cursor-pointer border-none bg-transparent"
                                                        >
                                                            <X className="h-3.5 w-3.5 text-rose-500" /> Delete Customer
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Footer */}
                            <div className="flex items-center justify-between px-5 py-3.5 border-t border-[var(--card-border)] bg-[var(--bg-right-panel)]/30">
                                <span className="text-[10px] font-semibold text-[var(--text-muted)]">
                                    Showing {filtered.length === 0 ? 0 : Math.min((safePage-1)*CUST_PER_PAGE+1, filtered.length)} to {Math.min(safePage*CUST_PER_PAGE, filtered.length)} of {filtered.length} customers
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <button disabled={safePage === 1} onClick={() => setCustPage(p => Math.max(1,p-1))}
                                        className="h-7 w-7 rounded-lg border border-[var(--card-border)] flex items-center justify-center hover:bg-[var(--bg-right-panel)] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">
                                        <ChevronLeft className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                                    </button>
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        const pg = i + 1
                                        return (
                                            <button key={pg} onClick={() => setCustPage(pg)}
                                                className={`h-7 w-7 rounded-lg text-[10px] font-black cursor-pointer transition-colors ${
                                                    safePage === pg
                                                        ? 'bg-[var(--gold-accent)] text-white border border-[var(--gold-accent)]'
                                                        : 'border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--bg-right-panel)]'
                                                }`}>{pg}</button>
                                        )
                                    })}
                                    {totalPages > 5 && <span className="text-xs font-bold text-[var(--text-muted)]">...</span>}
                                    {totalPages > 5 && (
                                        <button onClick={() => setCustPage(totalPages)}
                                            className={`h-7 w-7 rounded-lg text-[10px] font-black border cursor-pointer transition-colors ${
                                                safePage === totalPages ? 'bg-[var(--gold-accent)] text-white border-[var(--gold-accent)]' : 'border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--bg-right-panel)]'
                                            }`}>{totalPages}</button>
                                    )}
                                    <button disabled={safePage === totalPages} onClick={() => setCustPage(p => Math.min(totalPages, p+1))}
                                        className="h-7 w-7 rounded-lg border border-[var(--card-border)] flex items-center justify-center hover:bg-[var(--bg-right-panel)] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">
                                        <ChevronRight className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ── CUSTOMER DETAIL DRAWER ────────────────────── */}
                        {custDetail && (
                            <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setCustDetail(null)}>
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                                <div className="relative w-full max-w-[420px] h-full flex flex-col shadow-2xl"
                                    style={{ background:'var(--card-bg)', borderLeft:'1px solid var(--card-border)', overflowY:'auto' }}
                                    onClick={e => e.stopPropagation()}>

                                    {/* Sticky close */}
                                    <div className="sticky top-0 z-20 flex items-center justify-end px-5 pt-6 pb-0 pointer-events-none">
                                        <button onClick={() => setCustDetail(null)}
                                            className="pointer-events-auto h-8 w-8 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] shadow-md flex items-center justify-center text-[var(--text-muted)] hover:text-rose-500 cursor-pointer transition-all hover:scale-110">
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>

                                    {/* Hero */}
                                    <div className="relative overflow-hidden -mt-8" style={{ background:`linear-gradient(135deg, ${custDetail.color}22 0%, ${custDetail.color}06 100%)`, borderBottom:'1px solid var(--card-border)' }}>
                                        <div className="absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl opacity-20" style={{ background:custDetail.color }} />
                                        <div className="px-6 pt-10 pb-6 relative z-10">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg ring-4 ring-white/20"
                                                    style={{ backgroundColor:custDetail.color }}>
                                                    {custDetail.initials}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-['Outfit'] text-base font-black text-[var(--text-primary)]">{custDetail.name}</span>
                                                        {custDetail.badge && (
                                                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black border ${
                                                                custDetail.badge === 'New' ? 'bg-blue-500/10 text-blue-600 border-blue-500/25' : 'bg-violet-500/10 text-violet-600 border-violet-500/25'
                                                            }`}>{custDetail.badge}</span>
                                                        )}
                                                    </div>
                                                    <div className="text-[11px] font-semibold text-[var(--text-muted)] mt-1">{custDetail.email}</div>
                                                    <div className="text-[11px] font-semibold text-[var(--text-muted)]">{custDetail.phone}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[9px] font-black border ${
                                                    custDetail.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25' : 'bg-neutral-500/10 text-neutral-500 border-neutral-500/25'
                                                }`}>{custDetail.status}</span>
                                                <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--text-muted)]">
                                                    <MapPin className="h-3.5 w-3.5" />{custDetail.city}, {custDetail.state}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="p-5 space-y-5 flex-1">
                                        {/* Quick stats */}
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { label:'Orders',      value: custDetail.orders,                                       color:'text-blue-500',    bg:'bg-blue-500/5' },
                                                { label:'Total Spent', value:`₹${custDetail.totalSpent.toLocaleString('en-IN')}`, color:'text-[var(--gold-accent)]', bg:'bg-[var(--gold-accent)]/5' },
                                                { label:'Joined',      value: custDetail.joinedDate.toLocaleDateString('en-IN',{day:'2-digit',month:'short'}), color:'text-[var(--text-primary)]', bg:'bg-[var(--bg-right-panel)]' },
                                            ].map((s,i) => (
                                                <div key={i} className={`rounded-2xl border border-[var(--card-border)] p-3 text-center ${s.bg}`}>
                                                    <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">{s.label}</div>
                                                    <div className={`font-['Outfit'] text-base font-black mt-1 ${s.color}`}>{s.value}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Contact details */}
                                        <div className="bg-[var(--bg-right-panel)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-sm">
                                            <div className="px-4 py-3 border-b border-[var(--card-border)] bg-[var(--bg-right-panel)]/40">
                                                <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Contact Information</div>
                                            </div>
                                            <div className="divide-y divide-[var(--card-border)]/50">
                                                {[
                                                    { icon:<Bell className="h-4 w-4" />, label:'Email', value:custDetail.email },
                                                    { icon:<Users className="h-4 w-4" />, label:'Phone', value:custDetail.phone },
                                                    { icon:<MapPin className="h-4 w-4" />, label:'Location', value:`${custDetail.city}, ${custDetail.state}` },
                                                ].map((row,i) => (
                                                    <div key={i} className="flex items-center gap-3.5 px-4 py-3.5">
                                                        <div className="text-[var(--text-muted)] shrink-0">{row.icon}</div>
                                                        <div className="min-w-0">
                                                            <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">{row.label}</div>
                                                            <div className="text-xs font-bold text-[var(--text-primary)] mt-1 truncate">{row.value}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Spending bar */}
                                        <div className="bg-[var(--bg-right-panel)] border border-[var(--card-border)] rounded-2xl p-4 shadow-sm">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Spending vs Top Customer</div>
                                                <div className="text-[10px] font-black text-[var(--gold-accent)]">{Math.round((custDetail.totalSpent / Math.max(...customers.map(c=>c.totalSpent))) * 100)}%</div>
                                            </div>
                                            <div className="h-2 rounded-full bg-[var(--card-border)]">
                                                <div className="h-2 rounded-full transition-all duration-500"
                                                    style={{ width:`${Math.round((custDetail.totalSpent / Math.max(...customers.map(c=>c.totalSpent))) * 100)}%`, background:'var(--gold-accent)' }} />
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-[9px] font-semibold text-[var(--text-muted)]">₹0</span>
                                                <span className="text-[9px] font-semibold text-[var(--text-muted)]">₹{Math.max(...customers.map(c=>c.totalSpent)).toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={() => {
                                                    const next = custDetail.status === 'Active' ? 'Inactive' : 'Active'
                                                    setCustomers(prev => prev.map(c => c.id === custDetail.id ? {...c, status:next} : c))
                                                    setCustDetail(prev => ({...prev, status:next}))
                                                }}
                                                className={`flex-1 py-3 rounded-2xl text-xs font-black border cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${
                                                    custDetail.status === 'Active'
                                                        ? 'bg-rose-500/10 border-rose-500/25 text-rose-600 hover:bg-rose-500/20'
                                                        : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 hover:bg-emerald-500/20'
                                                }`}>
                                                {custDetail.status === 'Active' ? 'Mark as Inactive' : 'Mark as Active'}
                                            </button>
                                            <button onClick={() => setCustDetail(null)}
                                                className="flex-1 py-3 rounded-2xl bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] hover:shadow-lg text-white text-xs font-black cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md">
                                                Close Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })()}

            {/* ══════════════ DASHBOARD PAGE ═════════════─ */}
            {activeNav === 'Dashboard' && <>

                {/* ── WELCOME BANNER ───────────────────────────────────────────── */}
                <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl px-8 py-7 overflow-hidden shadow-sm">
                    {/* Decorative background grids */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--text-muted) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                    <div className="absolute top-0 right-0 w-72 h-full opacity-10 pointer-events-none">
                        <div className="absolute top-4 right-20 h-32 w-32 bg-[var(--gold-accent)] rounded-full blur-3xl" />
                        <div className="absolute bottom-4 right-4 h-20 w-20 bg-amber-400 rounded-full blur-2xl" />
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-4">
                            <div>
                                <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-black text-[var(--text-primary)] tracking-tight">
                                    Welcome back, Vendor {(user?.name || 'Dhruva').split(' ')[0]}
                                </h1>
                                <p className="text-xs font-bold text-[var(--text-muted)] mt-1.5">
                                    Track operations, manage system catalog entries, and analyze incoming user order metrics.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => { setActiveNav('Products'); openAdd() }}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white text-xs font-black transition-all shadow-md hover:shadow-lg cursor-pointer"
                                >
                                    <Plus className="h-4 w-4" /> Add New Product
                                </button>
                                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--gold-accent)] text-[var(--gold-accent)] bg-[var(--gold-bg-pill)] hover:bg-[var(--gold-accent)] hover:text-white text-xs font-black transition-all cursor-pointer">
                                    <ExternalLink className="h-3.5 w-3.5" /> View My Store
                                </button>
                            </div>
                        </div>

                        {/* Sleek dashboard card illustration */}
                        <div className="hidden lg:block shrink-0">
                            <div className="relative h-28 w-44 rounded-2xl border border-[var(--card-border)] bg-[var(--bg-right-panel)] overflow-hidden shadow-inner p-4 flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[8px] font-black uppercase text-[var(--text-muted)] tracking-wider">Storage Limit</span>
                                    <span className="text-[9px] font-black text-emerald-500">82%</span>
                                </div>
                                <div className="w-full bg-[var(--card-border)] h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full rounded-full w-[82%]" />
                                </div>
                                <div className="flex items-center gap-2 text-[9px] font-bold text-[var(--text-secondary)]">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <span>Cloud Sync Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Date range badge */}
                    <div className="absolute top-5 right-6 hidden lg:flex items-center gap-1.5 bg-[var(--bg-right-panel)] border border-[var(--card-border)] rounded-lg px-3 py-1.5 select-none">
                        <svg className="h-3.5 w-3.5 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span className="text-[10px] font-bold text-[var(--text-secondary)]">May 20 – May 26, 2024</span>
                        <ChevronDown className="h-3 w-3 text-[var(--text-muted)] opacity-70" />
                    </div>
                </div>

                {/* ── STATS CARDS ──────────────────────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { label: 'Total Sales', value: formatCurrency(stats.totalRevenue), growth: stats.revenueGrowth, icon: <DollarSignIcon />, sub: 'vs last week' },
                        { label: 'Total Orders', value: (stats.totalOrders || 156).toLocaleString(), growth: stats.ordersGrowth, icon: <ShoppingBagIcon />, sub: 'vs last week' },
                        { label: 'Total Customers', value: (stats.totalCustomers || 128).toLocaleString(), growth: stats.customersGrowth, icon: <UsersIcon />, sub: 'vs last week' },
                        { label: 'Pending Orders', value: (stats.pendingOrders || 12).toLocaleString(), growth: null, icon: <ClockIcon />, sub: 'View and process', linkSub: true },
                        { label: 'Product Views', value: (stats.productViews || 2350).toLocaleString(), growth: stats.viewsGrowth, icon: <EyeIcon />, sub: 'vs last week' },
                        { label: 'Store Rating', value: (stats.storeRating || 4.6).toFixed(1), growth: null, icon: <StarIcon />, sub: 'stars', isRating: true },
                    ].map((card, i) => (
                        <div key={i} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 hover:shadow-md transition-all duration-200 cursor-default flex flex-col justify-between min-h-[140px]">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">{card.label}</span>
                                    {card.icon}
                                </div>
                                {loadingStats ? (
                                    <div className="h-6 w-20 bg-[var(--bg-right-panel)] rounded animate-pulse" />
                                ) : (
                                    <div className="font-['Outfit'] text-xl font-black text-[var(--text-primary)] leading-tight">{card.value}</div>
                                )}
                            </div>
                            <div className="mt-3">
                                {card.isRating ? (
                                    <div className="flex items-center gap-0.5 text-amber-500">
                                        {[1,2,3,4].map(s => <Star key={s} className="h-3 w-3 fill-amber-500 stroke-amber-500" />)}
                                        <div className="relative overflow-hidden h-3 w-3">
                                            <Star className="h-3 w-3 text-amber-500 absolute left-0" />
                                            <div className="absolute right-0 top-0 bottom-0 bg-[var(--card-bg)] w-1/2" />
                                        </div>
                                        <span className="text-[10px] font-bold text-[var(--text-secondary)] ml-1">{card.value}</span>
                                    </div>
                                ) : card.growth !== null && card.growth !== undefined ? (
                                    <div className={`flex items-center gap-1 text-[10px] font-bold ${card.growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {card.growth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                        {card.growth >= 0 ? '+' : ''}{card.growth}% <span className="text-[var(--text-muted)] font-semibold">{card.sub}</span>
                                    </div>
                                ) : card.linkSub ? (
                                    <button className="text-[10px] font-bold text-[var(--gold-accent)] hover:underline cursor-pointer">{card.sub}</button>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── CHARTS ROW ───────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Sales Overview Line Chart */}
                    <div className="lg:col-span-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-['Outfit'] text-sm font-black text-[var(--text-primary)] tracking-tight">Sales Overview</h3>
                            <div className="relative" ref={weekDropRef}>
                                <button
                                    onClick={() => setWeekDropOpen(o => !o)}
                                    className="flex items-center gap-1.5 bg-[var(--bg-right-panel)] border border-[var(--card-border)] rounded-lg px-3 py-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                >
                                    <span className="text-[10px] font-bold text-[var(--text-secondary)]">{weekFilter}</span>
                                    <ChevronDown className={`h-3.5 w-3.5 text-[var(--text-muted)] transition-transform ${weekDropOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {weekDropOpen && (
                                    <div className="absolute right-0 mt-1.5 w-36 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-xl py-1 z-50 overflow-hidden">
                                        {['This Week', 'Last Week', 'This Month', 'Last Month', 'This Year'].map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => { setWeekFilter(opt); setWeekDropOpen(false) }}
                                                className={`w-full text-left px-3.5 py-2 text-[10px] font-bold transition-colors cursor-pointer ${
                                                    weekFilter === opt
                                                        ? 'bg-[var(--gold-bg-pill)] text-[var(--gold-accent)]'
                                                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-right-panel)]'
                                                }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="relative" style={{ height: 200 }}>
                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[9px] font-bold text-[var(--text-muted)] pr-2 select-none" style={{ paddingBottom: 20 }}>
                                {yLabels.map(l => <span key={l}>{l}</span>)}
                            </div>
                            {/* Chart SVG */}
                            <div className="absolute inset-0 pl-8 pb-6">
                                <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-full overflow-visible">
                                    <defs>
                                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#8D5A2B" stopOpacity="0.14" />
                                            <stop offset="100%" stopColor="#8D5A2B" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    {/* Grid lines */}
                                    {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
                                        <line key={i} x1={0} y1={f * chartH} x2={chartW} y2={f * chartH}
                                            stroke="var(--card-border)" strokeWidth={0.8} strokeDasharray="4 4" opacity={0.5} />
                                    ))}
                                    {/* Area fill */}
                                    <path d={areaD} fill="url(#areaGrad)" />
                                    {/* Line */}
                                    <path d={pathD} fill="none" stroke="#8D5A2B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                    {/* Dots with tooltip on hover */}
                                    {pts.map((p, i) => (
                                        <g key={i}>
                                            <circle cx={p.x} cy={p.y} r="4.5" fill="#8D5A2B" stroke="white" strokeWidth="2.2" />
                                        </g>
                                    ))}
                                </svg>
                            </div>
                            {/* X-axis labels */}
                            <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[9px] font-bold text-[var(--text-muted)] select-none">
                                {chartDays.map(d => <span key={d}>{d}</span>)}
                            </div>
                        </div>
                    </div>

                    {/* Order Status Donut */}
                    <div className="lg:col-span-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 shadow-sm">
                        <h3 className="font-['Outfit'] text-sm font-black text-[var(--text-primary)] mb-6 tracking-tight">Order Status</h3>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            {/* SVG Donut */}
                            <div className="relative shrink-0">
                                <svg width={160} height={160} viewBox="0 0 180 180">
                                    {donutArcs.map((seg, i) => (
                                        <path key={i} d={seg.d} fill="none" stroke={seg.color} strokeWidth={STROKE_W} strokeLinecap="butt" />
                                    ))}
                                    {/* Center label */}
                                    <text x={DONUT_CX} y={DONUT_CY - 8} textAnchor="middle" className="font-black" fill="var(--text-primary)" fontSize="24" fontFamily="Outfit, sans-serif" fontWeight="900">{total}</text>
                                    <text x={DONUT_CX} y={DONUT_CY + 12} textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="700">Total Orders</text>
                                </svg>
                            </div>
                            {/* Legend */}
                            <div className="space-y-2.5 w-full">
                                {donutSegments.map((seg, i) => (
                                    <div key={i} className="flex items-center justify-between border-b border-[var(--card-border)]/40 pb-1.5 text-xs font-semibold">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                                            <span className="text-[var(--text-secondary)]">{seg.label}</span>
                                        </div>
                                        <span className="font-bold text-[var(--text-primary)]">{seg.value} <span className="text-[10px] text-[var(--text-muted)] font-normal">({seg.pct}%)</span></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RECENT ORDERS + TOP PRODUCTS ────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Recent Orders */}
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--card-border)]">
                            <h3 className="font-['Outfit'] text-sm font-black text-[var(--text-primary)] tracking-tight">Recent Orders</h3>
                            <button onClick={() => setActiveNav('Orders')} className="text-xs font-bold text-[var(--gold-accent)] hover:underline cursor-pointer">View All Orders</button>
                        </div>
                        <div className="divide-y divide-[var(--card-border)]/50">
                            {loadingOrders ? (
                                <div className="py-12 flex items-center justify-center gap-3">
                                    <RefreshCw className="h-5 w-5 text-[var(--gold-accent)] animate-spin" />
                                    <span className="text-xs text-[var(--text-muted)]">Loading orders...</span>
                                </div>
                            ) : recentOrders.map((order, i) => (
                                <div key={i} className="grid grid-cols-12 gap-3 px-6 py-3.5 hover:bg-[var(--bg-right-panel)]/50 transition-colors items-center">
                                    
                                    {/* Column 1: Image & Details (4 cols on desktop) */}
                                    <div className="col-span-12 md:col-span-4 flex items-center gap-3 min-w-0">
                                        {/* Product image */}
                                        <div className="h-10 w-10 rounded-xl overflow-hidden border border-[var(--card-border)] bg-[var(--bg-right-panel)] shrink-0 flex items-center justify-center p-0.5">
                                            <img src={order.image} alt={order.ProductName} className="h-full w-full object-contain rounded-lg"
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80' }} />
                                        </div>
                                        {/* Info */}
                                        <div className="min-w-0">
                                            <div className="text-[9px] font-mono font-bold text-[var(--text-muted)] tracking-wider">Order #{order.OrderID}</div>
                                            <div className="text-xs font-bold text-[var(--text-primary)] truncate max-w-[140px] md:max-w-[160px]">{order.ProductName}</div>
                                            <div className="text-[10px] font-semibold text-[var(--text-muted)] truncate max-w-[140px] md:max-w-[160px]">{order.description}</div>
                                        </div>
                                    </div>

                                    {/* Column 2: Date & Time (3 cols on desktop) */}
                                    <div className="col-span-5 md:col-span-3 text-left leading-tight">
                                        <div className="text-[10px] font-bold text-[var(--text-primary)]">
                                            {new Date(order.OrderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                        <div className="text-[9px] font-semibold text-[var(--text-muted)] mt-0.5">
                                            {new Date(order.OrderDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                        </div>
                                    </div>

                                    {/* Column 3: Status Badge (3 cols on desktop) */}
                                    <div className="col-span-4 md:col-span-3 text-left">
                                        <span className={`inline-block px-2.5 py-0.5 rounded-[6px] text-[9px] font-black uppercase border tracking-wider shrink-0 ${statusBadge(order.OrderStatus)}`}>
                                            {order.OrderStatus}
                                        </span>
                                    </div>

                                    {/* Column 4: Amount (2 cols on desktop) */}
                                    <div className="col-span-3 md:col-span-2 text-right text-xs font-black text-[var(--text-primary)]">
                                        {formatCurrency(order.TotalAmount)}
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Selling Products */}
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--card-border)]">
                            <h3 className="font-['Outfit'] text-sm font-black text-[var(--text-primary)] tracking-tight">Top Selling Products</h3>
                            <button onClick={() => setActiveNav('Products')} className="text-xs font-bold text-[var(--gold-accent)] hover:underline cursor-pointer">View All Products</button>
                        </div>
                        <div className="divide-y divide-[var(--card-border)]/50">
                            {TOP_PRODUCTS.map((prod, i) => {
                                const isTopRank = prod.rank === 1
                                return (
                                    <div key={i} className="flex items-center gap-3.5 px-6 py-3 hover:bg-[var(--bg-right-panel)]/50 transition-colors">
                                        
                                        {/* Rank Badge */}
                                        <div className={`h-6 w-6 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 border ${
                                            isTopRank
                                                ? 'bg-[var(--gold-bg-pill)] text-[var(--gold-accent)] border-[var(--gold-accent)]/20'
                                                : 'bg-[var(--bg-right-panel)] text-[var(--text-secondary)] border-[var(--card-border)]/60'
                                        }`}>
                                            {prod.rank}
                                        </div>

                                        {/* Product image */}
                                        <div className="h-10 w-10 rounded-xl overflow-hidden border border-[var(--card-border)] bg-[var(--bg-right-panel)] shrink-0 flex items-center justify-center p-0.5">
                                            <img src={prod.image} alt={prod.name} className="h-full w-full object-contain rounded-lg"
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80' }} />
                                        </div>

                                        {/* Info + Progress Bar */}
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-[var(--text-primary)] truncate">{prod.name}</div>
                                            <div className="text-[10px] font-semibold text-[var(--text-muted)] truncate">{prod.desc}</div>
                                            
                                            {/* Thinner, sleeker progress track (max width limited to match reference) */}
                                            <div className="mt-1.5 h-1 w-[65%] max-w-[180px] bg-[var(--card-border)]/40 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-[var(--gold-accent)] transition-all duration-700"
                                                    style={{ width: `${(prod.sales / prod.maxSales) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Sales count */}
                                        <div className="text-right shrink-0 pl-2">
                                            <div className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-wider">Sales</div>
                                            <div className="text-xs font-black text-[var(--text-primary)] mt-0.5">{prod.sales}</div>
                                        </div>

                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* ── STORE HEALTH + GROW YOUR STORE ──────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Store Health */}
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 shadow-sm">
                        <h3 className="font-['Outfit'] text-sm font-black text-[var(--text-primary)] mb-5 tracking-tight">Store Health</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Response Rate', value: '98%', icon: <CheckCircle className="h-5 w-5 text-emerald-500" />, color: 'text-emerald-500' },
                                { label: 'On-time Delivery', value: '96%', icon: <Truck className="h-5 w-5 text-emerald-500" />, color: 'text-emerald-500' },
                                { label: 'Cancellation Rate', value: '2%', icon: <AlertTriangle className="h-5 w-5 text-amber-500" />, color: 'text-amber-500' },
                                { label: 'Return Rate', value: '1.5%', icon: <RotateCcw className="h-5 w-5 text-blue-500" />, color: 'text-blue-500' },
                            ].map((item, i) => (
                                <div key={i} className="text-center p-4 rounded-2xl bg-[var(--bg-right-panel)] border border-[var(--card-border)] flex flex-col items-center justify-center">
                                    <div className="p-2.5 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] mb-3">
                                        {item.icon}
                                    </div>
                                    <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider mb-1">{item.label}</div>
                                    <div className={`font-['Outfit'] text-lg font-black ${item.color}`}>{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Grow Your Store */}
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 relative overflow-hidden shadow-sm flex flex-col justify-between">
                        {/* Decorative subtle background icon */}
                        <Sparkles className="absolute -bottom-8 -right-8 h-32 w-32 opacity-5 pointer-events-none select-none text-[var(--gold-accent)]" />
                        <div>
                            <h3 className="font-['Outfit'] text-sm font-black text-[var(--text-primary)] mb-2 tracking-tight flex items-center gap-1.5">
                                <Sparkles className="h-4 w-4 text-[var(--gold-accent)]" /> Grow your store
                            </h3>
                            <p className="text-xs font-semibold text-[var(--text-muted)] mb-6 leading-relaxed max-w-md">
                                Keep adding quality products to expand catalog variety and boost visibility parameters. Better visibility increases overall conversion scores.
                            </p>
                        </div>
                        <div>
                            <button className="px-5 py-2.5 rounded-xl border border-[var(--gold-accent)] text-[var(--gold-accent)] text-xs font-black hover:bg-[var(--gold-accent)] hover:text-white transition-all cursor-pointer bg-[var(--gold-bg-pill)]">
                                Explore Growth Tips
                            </button>
                        </div>
                    </div>
                </div>
            </>}

            </main>

            {/* Footer */}
            <footer className="border-t border-[var(--card-border)] py-5 text-center text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider select-none">
                © 2024 VenderFlow. All rights reserved.
            </footer>

            {/* ── CREATE ORDER MODAL ─────────────────────────────────────────── */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-[var(--bg-right-panel)] border border-[var(--card-border)] rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-['Outfit'] text-lg font-black flex items-center gap-2">
                                <Plus className="h-5 w-5 text-[var(--gold-accent)]" /> Create Manual Order
                            </h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="h-8 w-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 flex items-center justify-center text-neutral-400 cursor-pointer">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateOrderSubmit} className="space-y-4 text-xs font-semibold">
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Customer Name', key: 'CustomerName', placeholder: 'e.g. John Doe' },
                                    { label: 'Product Name', key: 'ProductName', placeholder: 'e.g. Drone Mini' },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label className="block mb-1 text-[var(--text-muted)] uppercase tracking-wider text-[9px]">{f.label}</label>
                                        <input type="text" required placeholder={f.placeholder} value={newOrderForm[f.key]}
                                            onChange={(e) => setNewOrderForm(p => ({ ...p, [f.key]: e.target.value }))}
                                            className="w-full p-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] outline-none text-xs focus:border-[var(--gold-accent)] transition-colors"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block mb-1 text-[var(--text-muted)] uppercase tracking-wider text-[9px]">Qty</label>
                                    <input type="number" min={1} value={newOrderForm.Quantity}
                                        onChange={(e) => setNewOrderForm(p => ({ ...p, Quantity: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] outline-none text-xs focus:border-[var(--gold-accent)] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-[var(--text-muted)] uppercase tracking-wider text-[9px]">Unit Price (₹)</label>
                                    <input type="number" min={0} required placeholder="e.g. 499" value={newOrderForm.UnitPrice}
                                        onChange={(e) => setNewOrderForm(p => ({ ...p, UnitPrice: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] outline-none text-xs focus:border-[var(--gold-accent)] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-[var(--text-muted)] uppercase tracking-wider text-[9px]">Payment</label>
                                    <select value={newOrderForm.PaymentMethod} onChange={(e) => setNewOrderForm(p => ({ ...p, PaymentMethod: e.target.value }))}
                                        className="w-full p-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] outline-none text-xs cursor-pointer">
                                        {['UPI', 'Credit Card', 'Debit Card', 'Cash on Delivery'].map(m => <option key={m}>{m}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'City', key: 'City', placeholder: 'e.g. Mumbai' },
                                    { label: 'State', key: 'State', placeholder: 'e.g. Maharashtra' },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label className="block mb-1 text-[var(--text-muted)] uppercase tracking-wider text-[9px]">{f.label}</label>
                                        <input type="text" placeholder={f.placeholder} value={newOrderForm[f.key]}
                                            onChange={(e) => setNewOrderForm(p => ({ ...p, [f.key]: e.target.value }))}
                                            className="w-full p-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] outline-none text-xs focus:border-[var(--gold-accent)] transition-colors"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl border border-[var(--card-border)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-right-panel)] cursor-pointer transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={actionLoading}
                                    className="px-5 py-2.5 rounded-xl bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white text-xs font-black cursor-pointer transition-colors disabled:opacity-50">
                                    {actionLoading ? 'Creating...' : 'Create Order'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── ADD / EDIT PRODUCT MODAL ──────────────────────────────────────── */}
            {prodModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" onClick={() => setProdModal(null)}>
                    <div
                        className="w-full max-w-2xl bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl shadow-2xl overflow-hidden"
                        onClick={e => e.stopPropagation()}
                        style={{ maxHeight: '90vh', overflowY: 'auto' }}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--card-border)] bg-[var(--bg-right-panel)]">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-[var(--gold-accent)]/10 border border-[var(--gold-accent)]/20 flex items-center justify-center">
                                    {prodModal.mode === 'add'
                                        ? <Plus className="h-4.5 w-4.5 text-[var(--gold-accent)]" />
                                        : <Edit2 className="h-4 w-4 text-[var(--gold-accent)]" />}
                                </div>
                                <div>
                                    <h3 className="font-['Outfit'] text-base font-black text-[var(--text-primary)] leading-tight">
                                        {prodModal.mode === 'add' ? 'Add New Product' : 'Edit Product'}
                                    </h3>
                                    <p className="text-[10px] font-semibold text-[var(--text-muted)] mt-0.5">
                                        {prodModal.mode === 'add' ? 'Fill in details to list a new product' : 'Update product information'}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setProdModal(null)} className="h-8 w-8 rounded-xl hover:bg-[var(--card-border)]/30 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={e => { e.preventDefault(); handleProdSave() }}>
                            <div className="p-8 grid grid-cols-3 gap-6">

                                {/* Left – Image Preview */}
                                <div className="col-span-1 flex flex-col gap-4">
                                    <div className="aspect-square rounded-2xl border-2 border-dashed border-[var(--card-border)] bg-[var(--bg-right-panel)] overflow-hidden flex items-center justify-center">
                                        {prodModal.product.image ? (
                                            <img
                                                src={prodModal.product.image}
                                                alt="preview"
                                                className="h-full w-full object-contain p-3"
                                                onError={e => e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80'}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
                                                <Package className="h-8 w-8 opacity-30" />
                                                <span className="text-[9px] font-bold uppercase tracking-wider">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block mb-1.5 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Image URL</label>
                                        <input type="url" placeholder="https://..."
                                            value={prodModal.product.image}
                                            onChange={e => setProdModal(m => ({ ...m, product: { ...m.product, image: e.target.value } }))}
                                            className="w-full px-3 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] outline-none text-[10px] font-semibold placeholder-[var(--text-muted)] focus:border-[var(--gold-accent)] focus:ring-2 focus:ring-[var(--gold-accent)]/10 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Right – Fields */}
                                <div className="col-span-2 space-y-4">

                                    {/* Product Name */}
                                    <div>
                                        <label className="block mb-1.5 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Product Name <span className="text-rose-500">*</span></label>
                                        <input type="text" required placeholder="e.g. Wireless Noise-Cancelling Earbuds"
                                            value={prodModal.product.name}
                                            onChange={e => setProdModal(m => ({ ...m, product: { ...m.product, name: e.target.value } }))}
                                            className="w-full px-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] outline-none text-xs font-semibold placeholder-[var(--text-muted)] focus:border-[var(--gold-accent)] focus:ring-2 focus:ring-[var(--gold-accent)]/10 transition-all"
                                        />
                                    </div>

                                    {/* Brand + Category */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block mb-1.5 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Brand</label>
                                            <input type="text" placeholder="e.g. Sony"
                                                value={prodModal.product.brand}
                                                onChange={e => setProdModal(m => ({ ...m, product: { ...m.product, brand: e.target.value } }))}
                                                className="w-full px-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] outline-none text-xs font-semibold placeholder-[var(--text-muted)] focus:border-[var(--gold-accent)] focus:ring-2 focus:ring-[var(--gold-accent)]/10 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1.5 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Category</label>
                                            <div className="relative">
                                                <select value={prodModal.product.category}
                                                    onChange={e => setProdModal(m => ({ ...m, product: { ...m.product, category: e.target.value } }))}
                                                    className="w-full appearance-none px-4 py-3 pr-8 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] outline-none text-xs font-semibold cursor-pointer focus:border-[var(--gold-accent)] focus:ring-2 focus:ring-[var(--gold-accent)]/10 transition-all">
                                                    {['Electronics','Fashion','Home & Living','Beauty','Sports','Automotive','Furniture','Footwear','Bags','Toys & Games'].map(c => <option key={c}>{c}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)] pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price + Stock */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block mb-1.5 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Price (₹) <span className="text-rose-500">*</span></label>
                                            <div className="relative">
                                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-[var(--text-muted)]">₹</span>
                                                <input type="number" min={0} required placeholder="1499"
                                                    value={prodModal.product.price}
                                                    onChange={e => setProdModal(m => ({ ...m, product: { ...m.product, price: e.target.value } }))}
                                                    className="w-full pl-7 pr-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] outline-none text-xs font-semibold placeholder-[var(--text-muted)] focus:border-[var(--gold-accent)] focus:ring-2 focus:ring-[var(--gold-accent)]/10 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block mb-1.5 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Stock Qty</label>
                                            <input type="number" min={0} placeholder="50"
                                                value={prodModal.product.stock}
                                                onChange={e => setProdModal(m => ({ ...m, product: { ...m.product, stock: e.target.value } }))}
                                                className="w-full px-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] outline-none text-xs font-semibold placeholder-[var(--text-muted)] focus:border-[var(--gold-accent)] focus:ring-2 focus:ring-[var(--gold-accent)]/10 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Stock visual indicator */}
                                    {prodModal.product.stock !== '' && (
                                        <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-[10px] font-bold ${
                                            Number(prodModal.product.stock) === 0
                                                ? 'bg-rose-500/5 border-rose-500/20 text-rose-500'
                                                : Number(prodModal.product.stock) < 15
                                                ? 'bg-amber-500/5 border-amber-500/20 text-amber-600'
                                                : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600'
                                        }`}>
                                            <div className={`h-2 w-2 rounded-full ${
                                                Number(prodModal.product.stock) === 0 ? 'bg-rose-500'
                                                : Number(prodModal.product.stock) < 15 ? 'bg-amber-500'
                                                : 'bg-emerald-500'
                                            }`} />
                                            {Number(prodModal.product.stock) === 0
                                                ? 'Out of Stock — product will be hidden from store'
                                                : Number(prodModal.product.stock) < 15
                                                ? `Low stock — only ${prodModal.product.stock} units remaining`
                                                : `In Stock — ${prodModal.product.stock} units available`}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between px-8 py-5 border-t border-[var(--card-border)] bg-[var(--bg-right-panel)]">
                                <p className="text-[9px] font-semibold text-[var(--text-muted)]"><span className="text-rose-500">*</span> Required fields</p>
                                <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => setProdModal(null)}
                                        className="px-5 py-2.5 rounded-xl border border-[var(--card-border)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--card-border)]/20 cursor-pointer transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit"
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white text-xs font-black cursor-pointer transition-all shadow-md hover:shadow-lg">
                                        {prodModal.mode === 'add'
                                            ? <><Plus className="h-3.5 w-3.5" /> Add Product</>
                                            : <><Check className="h-3.5 w-3.5" /> Save Changes</>}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── VIEW PRODUCT MODAL ───────────────────────────────────────────── */}
            {viewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewModal(null)}>
                    <div className="w-full max-w-md bg-[var(--bg-right-panel)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                        {/* Product image banner */}
                        <div className="relative h-52 bg-[var(--bg-right-panel)] flex items-center justify-center border-b border-[var(--card-border)]">
                            <img
                                src={viewModal.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'}
                                alt={viewModal.name}
                                className="h-full w-full object-contain p-6"
                                onError={e => e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'}
                            />
                            <button onClick={() => setViewModal(null)} className="absolute top-3 right-3 h-8 w-8 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-rose-500 cursor-pointer transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                            {/* Stock badge */}
                            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                                viewModal.stock === 0 ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                : viewModal.stock < 15 ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            }`}>
                                {viewModal.stock === 0 ? 'Out of Stock' : viewModal.stock < 15 ? 'Low Stock' : 'In Stock'}
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider mb-0.5">{viewModal.sku}</div>
                                <h2 className="font-['Outfit'] text-lg font-black text-[var(--text-primary)] leading-tight">{viewModal.name}</h2>
                                <div className="text-xs font-semibold text-[var(--text-secondary)] mt-1">{viewModal.brand} &bull; {viewModal.subcategory || viewModal.category}</div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3 text-center">
                                    <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">Price</div>
                                    <div className="font-['Outfit'] text-base font-black text-[var(--gold-accent)] mt-1">₹{Number(viewModal.price).toLocaleString('en-IN')}</div>
                                </div>
                                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3 text-center">
                                    <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">Stock</div>
                                    <div className="font-['Outfit'] text-base font-black text-[var(--text-primary)] mt-1">{viewModal.stock}</div>
                                </div>
                                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3 text-center">
                                    <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">Category</div>
                                    <div className="font-['Outfit'] text-xs font-black text-[var(--text-primary)] mt-1 truncate">{viewModal.subcategory || viewModal.category}</div>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-1">
                                <button
                                    onClick={() => { setViewModal(null); openEdit(viewModal) }}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--card-border)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-right-panel)] cursor-pointer transition-colors"
                                >
                                    <Edit2 className="h-3.5 w-3.5" /> Edit Product
                                </button>
                                <button
                                    onClick={() => setViewModal(null)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white text-xs font-black cursor-pointer transition-colors"
                                >
                                    <X className="h-3.5 w-3.5" /> Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── DELETE CONFIRMATION MODAL ──────────────────────────────────────── */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" onClick={() => setDeleteConfirm(null)}>
                    <div className="w-full max-w-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Red danger header */}
                        <div className="bg-rose-500/8 border-b border-rose-500/15 px-6 py-5 flex items-center gap-4">
                            <div className="h-11 w-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                                <AlertTriangle className="h-5 w-5 text-rose-500" />
                            </div>
                            <div>
                                <h3 className="font-['Outfit'] text-base font-black text-[var(--text-primary)]">Delete Product?</h3>
                                <p className="text-[10px] font-semibold text-[var(--text-muted)] mt-0.5">This action cannot be undone</p>
                            </div>
                        </div>

                        {/* Product preview */}
                        <div className="px-6 py-5">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-right-panel)] border border-[var(--card-border)]">
                                <div className="h-12 w-12 rounded-xl overflow-hidden border border-[var(--card-border)] bg-[var(--card-bg)] shrink-0 flex items-center justify-center p-1">
                                    <img
                                        src={deleteConfirm.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'}
                                        alt={deleteConfirm.name}
                                        className="h-full w-full object-contain"
                                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'}
                                    />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs font-black text-[var(--text-primary)] truncate">{deleteConfirm.name.split('(')[0].trim()}</div>
                                    <div className="text-[10px] font-semibold text-[var(--text-muted)] mt-0.5">{deleteConfirm.brand} · {deleteConfirm.sku}</div>
                                    <div className="text-[10px] font-black text-[var(--gold-accent)] mt-0.5">₹{Number(deleteConfirm.price).toLocaleString('en-IN')}</div>
                                </div>
                            </div>
                            <p className="text-[11px] font-semibold text-[var(--text-muted)] mt-4 text-center leading-relaxed">
                                You are about to permanently remove <span className="font-black text-[var(--text-primary)]">"{deleteConfirm.name.split('(')[0].trim()}"</span> from your store. This cannot be recovered.
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="px-6 pb-6 flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-3 rounded-2xl border border-[var(--card-border)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-right-panel)] cursor-pointer transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleProdDelete(deleteConfirm.id)}
                                className="flex-1 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black cursor-pointer transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                <X className="h-3.5 w-3.5" /> Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── CUSTOMER DELETE CONFIRMATION MODAL ──────────────────────────────── */}
            {custDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" onClick={() => setCustDeleteConfirm(null)}>
                    <div className="w-full max-w-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Red danger header */}
                        <div className="bg-rose-500/8 border-b border-rose-500/15 px-6 py-5 flex items-center gap-4">
                            <div className="h-11 w-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                                <AlertTriangle className="h-5 w-5 text-rose-500" />
                            </div>
                            <div>
                                <h3 className="font-['Outfit'] text-base font-black text-[var(--text-primary)]">Delete Customer?</h3>
                                <p className="text-[10px] font-semibold text-[var(--text-muted)] mt-0.5">This action cannot be undone</p>
                            </div>
                        </div>

                        {/* Customer preview */}
                        <div className="px-6 py-5">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-right-panel)] border border-[var(--card-border)]">
                                <div className="h-12 w-12 rounded-xl overflow-hidden border border-[var(--card-border)] bg-[var(--card-bg)] shrink-0 flex items-center justify-center text-white font-black" style={{ backgroundColor: custDeleteConfirm.color }}>
                                    {custDeleteConfirm.initials}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs font-black text-[var(--text-primary)] truncate">{custDeleteConfirm.name}</div>
                                    <div className="text-[10px] font-semibold text-[var(--text-muted)] mt-0.5">{custDeleteConfirm.email}</div>
                                    <div className="text-[10px] font-semibold text-[var(--text-muted)]">{custDeleteConfirm.phone}</div>
                                </div>
                            </div>
                            <p className="text-[11px] font-semibold text-[var(--text-muted)] mt-4 text-center leading-relaxed">
                                You are about to permanently delete customer <span className="font-black text-[var(--text-primary)]">"{custDeleteConfirm.name}"</span> and remove them from your records.
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="px-6 pb-6 flex gap-3">
                            <button
                                onClick={() => setCustDeleteConfirm(null)}
                                className="flex-1 py-3 rounded-2xl border border-[var(--card-border)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-right-panel)] cursor-pointer transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleCustDelete(custDeleteConfirm.id)}
                                className="flex-1 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black cursor-pointer transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                <X className="h-3.5 w-3.5" /> Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── Sleek Icon Helpers for Dashboard Stats ──────────────────────────────
function DollarSignIcon() {
    return (
        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 border border-orange-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
        </div>
    )
}

function ShoppingBagIcon() {
    return (
        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 border border-blue-500/20">
            <ShoppingBag className="h-4 w-4" />
        </div>
    )
}

function UsersIcon() {
    return (
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 border border-emerald-500/20">
            <Users className="h-4 w-4" />
        </div>
    )
}

function ClockIcon() {
    return (
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 border border-amber-500/20 animate-pulse">
            <Clock className="h-4 w-4" />
        </div>
    )
}

function EyeIcon() {
    return (
        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 border border-purple-500/20">
            <Eye className="h-4 w-4" />
        </div>
    )
}

function StarIcon() {
    return (
        <div className="p-2 rounded-xl bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20 border border-yellow-500/20">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
        </div>
    )
}