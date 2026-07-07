import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    ShoppingBag, Heart, Search, ChevronDown, LogOut, Moon, Sun,
    RefreshCw, X, Clock, Eye, ShoppingCart, Calendar, ArrowRight, Truck, CheckCircle2, AlertCircle
} from 'lucide-react'
import { ALL_PRODUCTS } from '../data/dashboardData'

export default function OrderHistory() {
    const navigate = useNavigate()
    const { user, logout, api } = useAuth()

    // Database products for matching images
    const [products, setProducts] = useState(ALL_PRODUCTS)

    // UI & Filter States
    const [isDark, setIsDark] = useState(() => localStorage.getItem('vf_dark_mode') === 'true')
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchCatDropdownOpen, setIsSearchCatDropdownOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    
    // Status Filter: 'All Orders', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'
    const [selectedStatus, setSelectedStatus] = useState('All Orders')
    
    // Date Filter: 'Last 30 Days', 'Last 6 Months', 'Year 2024', 'Year 2023', 'All Time'
    const [selectedTimeframe, setSelectedTimeframe] = useState('All Time')

    // Modal Details States
    const [selectedOrderDetail, setSelectedOrderDetail] = useState(null)
    const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)
    const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null)

    // Pagination
    const ORDERS_PER_PAGE = 3
    const [currentPage, setCurrentPage] = useState(1)

    // Fetch products
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

    // Load static mock orders with current 2026 dates so they always show up
    const MOCK_ORDERS = [
        {
            OrderID: 'VF10234',
            ProductName: 'Electric Kettle',
            description: '1.8L | Stainless Steel | Black',
            OrderDate: new Date('2026-06-25T10:30:00'),
            TotalAmount: 93,
            PaymentMethod: 'Online Payment',
            OrderStatus: 'Delivered',
            statusDetail: 'Delivered on 28 Jun 2026',
            Quantity: 1,
            image: 'https://images.unsplash.com/photo-1577334716219-3375b050d7a3?w=300&q=80',
            Brand: 'VenderFlow Brand',
            UnitPrice: 93,
            City: 'Mumbai',
            State: 'Maharashtra',
            Country: 'India'
        },
        {
            OrderID: 'VF10221',
            ProductName: 'Office Chair',
            description: 'Ergonomic | Black',
            OrderDate: new Date('2026-06-18T16:15:00'),
            TotalAmount: 5499,
            PaymentMethod: 'Online Payment',
            OrderStatus: 'Delivered',
            statusDetail: 'Delivered on 21 Jun 2026',
            Quantity: 1,
            image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=300&q=80',
            Brand: 'ErgoSeat',
            UnitPrice: 5499,
            City: 'Pune',
            State: 'Maharashtra',
            Country: 'India'
        },
        {
            OrderID: 'VF10198',
            ProductName: 'Casual Sneakers',
            description: 'White | Size 8',
            OrderDate: new Date('2026-07-01T11:20:00'),
            TotalAmount: 849,
            PaymentMethod: 'Online Payment',
            OrderStatus: 'Shipped',
            statusDetail: 'Expected by 05 Jul 2026',
            Quantity: 1,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80',
            Brand: 'SoleFlex',
            UnitPrice: 849,
            City: 'Bengaluru',
            State: 'Karnataka',
            Country: 'India'
        },
        {
            OrderID: 'VF10175',
            ProductName: 'Leather Backpack',
            description: 'Brown | 15 Inch',
            OrderDate: new Date('2026-07-05T09:45:00'),
            TotalAmount: 1199,
            PaymentMethod: 'Online Payment',
            OrderStatus: 'Confirmed',
            statusDetail: 'Order Confirmed',
            Quantity: 1,
            image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80',
            Brand: 'UrbanLeather',
            UnitPrice: 1199,
            City: 'Delhi',
            State: 'NCR',
            Country: 'India'
        },
        {
            OrderID: 'VF10150',
            ProductName: 'Atomic Habits',
            description: 'by James Clear',
            OrderDate: new Date('2026-05-28T14:30:00'),
            TotalAmount: 359,
            PaymentMethod: 'Online Payment',
            OrderStatus: 'Cancelled',
            statusDetail: 'Cancelled on 29 May 2026',
            Quantity: 1,
            image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80',
            Brand: 'Penguin Books',
            UnitPrice: 359,
            City: 'Mumbai',
            State: 'Maharashtra',
            Country: 'India'
        }
    ]

    // Fetch customer orders from database and combine/fallback to mock orders
    const fetchCustomerOrders = useCallback(async () => {
        setLoading(true)
        try {
            const { data } = api ? await api.get('/orders', {
                params: {
                    customerID: user?._id,
                    limit: 100
                }
            }) : { data: { success: false } }
            
            if (data.success) {
                const dbOrders = data.data || []
                
                // Map DB orders to structure matching UI
                const mappedDbOrders = dbOrders.map(order => {
                    // Try to find image from static products or database products
                    const matchedProduct = products.find(p => p.id === order.ProductID || p.name === order.ProductName)
                    const image = matchedProduct ? matchedProduct.image : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80'
                    
                    let statusDetail = 'Order Status Update Available'
                    if (order.OrderStatus === 'Delivered') {
                        const delDate = new Date(new Date(order.OrderDate).getTime() + 3*24*60*60*1000)
                        statusDetail = `Delivered on ${delDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
                    } else if (order.OrderStatus === 'Shipped') {
                        const expDate = new Date(new Date(order.OrderDate).getTime() + 4*24*60*60*1000)
                        statusDetail = `Expected by ${expDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
                    } else if (order.OrderStatus === 'Confirmed') {
                        statusDetail = 'Order Confirmed'
                    } else if (order.OrderStatus === 'Cancelled') {
                        statusDetail = `Cancelled on ${new Date(order.OrderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
                    } else if (order.OrderStatus === 'Returned') {
                        statusDetail = 'Returned successfully'
                    } else {
                        statusDetail = 'Pending Approval'
                    }

                    return {
                        OrderID: order.OrderID || 'VF' + Math.floor(10000 + Math.random() * 90000),
                        ProductName: order.ProductName,
                        description: `${order.Category || 'Product'} | Standard Specification`,
                        OrderDate: new Date(order.OrderDate || order.createdAt),
                        TotalAmount: order.TotalAmount || (order.UnitPrice * order.Quantity),
                        PaymentMethod: order.PaymentMethod || 'UPI',
                        OrderStatus: order.OrderStatus || 'Pending',
                        statusDetail: statusDetail,
                        Quantity: order.Quantity || 1,
                        image: image,
                        Brand: order.Brand || 'Generic Brand',
                        UnitPrice: order.UnitPrice,
                        City: order.City || 'Mumbai',
                        State: order.State || 'MH',
                        Country: order.Country || 'India',
                        _id: order._id
                    }
                })

                // Combine them. DB orders first, then the user's mockup orders
                setOrders([...mappedDbOrders, ...MOCK_ORDERS])
            } else {
                setOrders(MOCK_ORDERS)
            }
        } catch (err) {
            console.error('Error fetching customer orders:', err)
            setOrders(MOCK_ORDERS)
        } finally {
            setLoading(false)
        }
    }, [api, user?._id, products])

    useEffect(() => {
        if (user?._id && api) {
            fetchCustomerOrders()
        } else {
            setOrders(MOCK_ORDERS)
            setLoading(false)
        }
    }, [user?._id, fetchCustomerOrders, api])

    // Local Storage Cart & Wishlist Sync
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem(`vf_wishlist_${user?._id || 'temp'}`);
        return saved ? JSON.parse(saved) : [];
    })
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem(`vf_cart_${user?._id || 'temp'}`);
        return saved ? JSON.parse(saved) : [];
    })

    useEffect(() => {
        localStorage.setItem(`vf_wishlist_${user?._id || 'temp'}`, JSON.stringify(wishlist));
    }, [wishlist, user?._id])

    useEffect(() => {
        localStorage.setItem(`vf_cart_${user?._id || 'temp'}`, JSON.stringify(cart));
    }, [cart, user?._id])

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    // Buy again trigger
    const handleBuyAgain = async (item) => {
        setActionLoading(true)
        try {
            // Add to client side cart
            const matchedProduct = products.find(p => p.name === item.ProductName)
            const productToAdd = matchedProduct || {
                id: 'p-' + Math.floor(1000 + Math.random() * 9000),
                name: item.ProductName,
                brand: item.Brand,
                category: item.description.split(' | ')[0] || 'Electronics',
                price: item.UnitPrice,
                originalPrice: item.UnitPrice * 1.2,
                image: item.image,
                inStock: true
            }

            const existingIndex = cart.findIndex(c => c.name === productToAdd.name)
            if (existingIndex > -1) {
                const updated = [...cart]
                updated[existingIndex].quantity += 1
                setCart(updated)
            } else {
                setCart([...cart, {
                    ...productToAdd,
                    quantity: 1,
                    color: 'Default',
                    storage: 'Standard',
                    inStock: true
                }])
            }

            alert(`"${item.ProductName}" has been added to your cart!`)
            navigate('/cart')
        } catch (err) {
            console.error('Failed to buy again:', err)
        } finally {
            setActionLoading(false)
        }
    }

    const toggleTheme = () => {
        const next = !isDark
        setIsDark(next)
        localStorage.setItem('vf_dark_mode', String(next))
    }

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const handleSearchSubmit = () => {
        let path = '/dashboard/customer'
        const params = new URLSearchParams()
        if (searchQuery) params.append('search', searchQuery)
        if (selectedCategory && selectedCategory !== 'All Products') params.append('category', selectedCategory)
        const queryString = params.toString()
        if (queryString) path += `?${queryString}`
        navigate(path)
    }

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val || 0)
    }

    // Filter Logic
    const getFilteredOrders = () => {
        return orders.filter(order => {
            // 1. Status Filter
            if (selectedStatus !== 'All Orders') {
                if (order.OrderStatus.toLowerCase() !== selectedStatus.toLowerCase()) {
                    return false
                }
            }

            // 2. Date Timeframe Filter
            const orderDate = new Date(order.OrderDate)
            const now = new Date()
            const differenceInTime = now.getTime() - orderDate.getTime()
            const differenceInDays = differenceInTime / (1000 * 3600 * 24)

            if (selectedTimeframe === 'Last 30 Days') {
                return differenceInDays <= 30
            } else if (selectedTimeframe === 'Last 6 Months') {
                return differenceInDays <= 180
            } else if (selectedTimeframe === 'Year 2024') {
                return orderDate.getFullYear() === 2024
            } else if (selectedTimeframe === 'Year 2023') {
                return orderDate.getFullYear() === 2023
            }

            return true // 'All Time' or matching otherwise
        })
    }

    const filteredOrdersList = getFilteredOrders()

    // Reset to page 1 whenever filters change
    const totalPages = Math.max(1, Math.ceil(filteredOrdersList.length / ORDERS_PER_PAGE))
    const paginatedOrders = filteredOrdersList.slice(
        (currentPage - 1) * ORDERS_PER_PAGE,
        currentPage * ORDERS_PER_PAGE
    )

    const profileMenuRef = useRef(null)
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className={`min-h-screen font-['Inter'] relative transition-colors duration-300 ${isDark ? 'theme-dark' : ''} bg-[var(--bg-right-panel)] text-[var(--text-primary)] text-left`}>

            {/* Header / Navbar */}
            <header className="bg-[var(--card-bg)] sticky top-0 z-40 transition-colors border-b border-[var(--card-border)]/50">
                <div className="max-w-7xl mx-auto px-4 lg:px-6 h-20 flex items-center justify-between gap-4">

                    {/* Logo Section */}
                    <div onClick={() => navigate('/dashboard/customer')} className="flex items-center gap-2 lg:gap-3 shrink-0 cursor-pointer">
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-[var(--gold-accent)] border border-[var(--gold-accent)]/20 shadow-md">
                            <svg className="h-5.5 w-5.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                <line x1="12" y1="22.08" x2="12" y2="12" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-['Outfit'] text-xl font-extrabold tracking-tight leading-none">VenderFlow</div>
                            <div className="text-[9px] font-black tracking-widest text-[var(--gold-accent)] uppercase mt-1">
                                Shop More, Sell More
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-xl items-center border border-[var(--card-border)] rounded-xl bg-[var(--bg-right-panel)] relative">
                        <div className="pl-3.5 text-[var(--text-muted)]">
                            <Search className="h-4.5 w-4.5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for products, brands and more..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearchSubmit()
                            }}
                            className="w-full py-2.5 px-3 bg-transparent text-xs font-medium outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="p-1 mr-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer text-xs font-bold shrink-0"
                            >
                                ✕
                            </button>
                        )}
                        <div 
                            onClick={() => setIsSearchCatDropdownOpen(!isSearchCatDropdownOpen)}
                            className="flex items-center gap-1 px-3 py-1.5 border-l border-[var(--card-border)] text-[var(--text-secondary)] text-xs font-bold shrink-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors h-full select-none"
                        >
                            All Categories <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                        </div>

                        {isSearchCatDropdownOpen && (
                            <div className="absolute right-12 top-full mt-1.5 w-48 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-xl py-1.5 z-50 text-left max-h-60 overflow-y-auto no-scrollbar">
                                <button
                                    onClick={() => {
                                        setSelectedCategory(null)
                                        setIsSearchCatDropdownOpen(false)
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-[var(--bg-right-panel)] text-xs font-semibold text-[var(--text-secondary)]"
                                >
                                    All Categories
                                </button>
                                {['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Automotive'].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            setSelectedCategory(cat)
                                            setIsSearchCatDropdownOpen(false)
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-[var(--bg-right-panel)] text-xs font-semibold text-[var(--text-secondary)]"
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}

                        <button 
                            onClick={handleSearchSubmit}
                            className="bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white p-3.5 rounded-r-xl transition-colors shrink-0 outline-none cursor-pointer"
                        >
                            <Search className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Header Actions */}
                    <div className="flex items-center gap-3 lg:gap-5">

                        {/* Wishlist */}
                        <button 
                            onClick={() => navigate('/wishlist')}
                            className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--gold-accent)] font-semibold text-xs transition-colors shrink-0 relative cursor-pointer"
                        >
                            <Heart className={`h-4.5 w-4.5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-[var(--text-muted)]'}`} />
                            <span className="hidden sm:inline">Wishlist</span>
                            {wishlist.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-[var(--card-bg)]">
                                    {wishlist.length}
                                </span>
                            )}
                        </button>

                        {/* Cart */}
                        <button
                            onClick={() => navigate('/cart')}
                            className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--gold-accent)] font-semibold text-xs transition-colors relative shrink-0"
                        >
                            <ShoppingBag className="h-4.5 w-4.5 text-[var(--text-muted)]" />
                            <span className="hidden sm:inline">Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-[var(--gold-accent)] text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-[var(--card-bg)]">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="h-9 w-9 rounded-lg border border-[var(--card-border)] flex items-center justify-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
                        >
                            {isDark ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-[var(--text-secondary)]" />}
                        </button>

                        {/* User Profile */}
                        <div className="relative shrink-0" ref={profileMenuRef}>
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="flex items-center gap-2 text-left hover:opacity-95 transition-opacity"
                            >
                                <div className="h-9 w-9 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--gold-accent)] flex items-center justify-center font-black text-xs">
                                    DT
                                </div>
                                <div className="hidden lg:block leading-none">
                                    <div className="text-xs font-bold text-[var(--text-primary)]">{user?.name || 'Dhruva Tajapara'}</div>
                                    <div className="text-[9px] font-semibold text-[var(--text-muted)] mt-0.5">Customer Portal</div>
                                </div>
                                <ChevronDown className="h-3 w-3 text-[var(--text-muted)]" />
                            </button>

                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2.5 w-48 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl py-2 z-50 animate-scale-up">
                                    <button
                                        onClick={() => {
                                            setIsProfileDropdownOpen(false)
                                            navigate('/dashboard/customer')
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-[var(--bg-right-panel)] text-xs font-semibold flex items-center gap-2 text-[var(--text-secondary)]"
                                    >
                                        <ShoppingBag className="h-4 w-4 text-[var(--text-muted)]" />
                                        Customer Dashboard
                                    </button>
                                    <hr className="border-[var(--card-border)] my-1.5 opacity-40" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 hover:bg-rose-500/5 text-xs font-bold flex items-center gap-2 text-rose-500"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout Account
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content body */}
            <main className="max-w-7xl mx-auto px-4 lg:px-6 pt-8 pb-10 space-y-6">

                {/* Breadcrumbs */}
                <nav className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 opacity-80 select-none">
                    <span onClick={() => navigate('/dashboard/customer')} className="cursor-pointer hover:text-[var(--gold-accent)] transition-colors">Home</span>
                    <span className="opacity-50">&gt;</span>
                    <span className="text-[var(--text-muted)]">My Account</span>
                    <span className="opacity-50">&gt;</span>
                    <span className="text-[var(--text-primary)] font-bold">Order History</span>
                </nav>

                {/* Header Title block */}
                <div className="space-y-1">
                    <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-black text-[var(--text-primary)] tracking-tight">
                        Order History
                    </h1>
                    <p className="text-xs font-semibold text-[var(--text-muted)]">
                        Track and manage your orders
                    </p>
                </div>

                {/* Responsive Columns Grid layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column - User Card only (sidebar list removed as per request) */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2rem] p-8 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md">
                            
                            {/* Initials Avatar */}
                            <div className="h-20 w-20 rounded-full bg-[#8A1C14] text-white flex items-center justify-center font-bold text-2xl shadow-md border-2 border-white dark:border-[var(--card-border)] animate-float-slow">
                                DT
                            </div>
                            
                            <h2 className="font-['Outfit'] font-black text-lg text-[var(--text-primary)] mt-5 tracking-tight">
                                {user?.name || 'Dhruva Tajapara'}
                            </h2>
                            <p className="text-xs font-semibold text-[var(--text-muted)] mt-1.5 break-all">
                                {user?.email || 'dhruva@example.com'}
                            </p>
                            <p className="text-xs font-semibold text-[var(--text-secondary)] mt-1">
                                +91 99989 99989
                            </p>

                            <button 
                                onClick={() => navigate('/dashboard/customer')}
                                className="w-full mt-7 py-3 px-4 bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[var(--gold-accent)]/10 cursor-pointer"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Order History list & Tabs */}
                    <div className="lg:col-span-9 space-y-4">
                        
                        {/* Filters row: status filter tabs & timeframe select */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--card-border)] pb-0.5">
                            
                            {/* Horizontal Tabs scrollable on mobile */}
                            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth -mb-[1px]">
                                {['All Orders', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'].map((status) => {
                                    const isActive = selectedStatus === status
                                    return (
                                        <button
                                            key={status}
                                            onClick={() => setSelectedStatus(status)}
                                            className={`py-3.5 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                                                isActive 
                                                    ? 'border-[var(--gold-accent)] text-[var(--gold-accent)]' 
                                                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--card-border)]'
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Dropdown timeline select */}
                            <div className="flex items-center gap-2 self-end md:self-center py-2 shrink-0">
                                <Calendar className="h-4.5 w-4.5 text-[var(--text-muted)]" />
                                <select
                                    value={selectedTimeframe}
                                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                                    className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl py-2 px-3 text-xs font-semibold outline-none cursor-pointer focus:border-[var(--gold-accent)] text-[var(--text-primary)] transition-all shadow-sm"
                                >
                                    <option value="Last 30 Days">Last 30 Days</option>
                                    <option value="Last 6 Months">Last 6 Months</option>
                                    <option value="Year 2024">Year 2024</option>
                                    <option value="Year 2023">Year 2023</option>
                                    <option value="All Time">All Time</option>
                                </select>
                            </div>
                        </div>

                        {/* Orders List Container */}
                        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-sm">
                            
                            {/* Desktop Columns Table Header */}
                            <div className="hidden md:grid grid-cols-12 gap-6 px-8 py-5 bg-[var(--bg-right-panel)]/50 border-b border-[var(--card-border)] text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">
                                <div className="col-span-4">Order Details</div>
                                <div className="col-span-2">Date</div>
                                <div className="col-span-2">Amount</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-2 text-right">Actions</div>
                            </div>

                            {loading ? (
                                <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
                                    <RefreshCw className="h-8 w-8 text-[var(--gold-accent)] animate-spin" />
                                    <span className="text-xs font-semibold text-[var(--text-muted)]">Loading order records...</span>
                                </div>
                            ) : filteredOrdersList.length === 0 ? (
                                <div className="py-24 px-8 text-center flex flex-col items-center justify-center gap-4">
                                    <div className="h-12 w-12 bg-[var(--gold-bg-pill)] text-[var(--gold-accent)] rounded-full flex items-center justify-center">
                                        <AlertCircle className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-black text-[var(--text-primary)]">No orders found</h3>
                                        <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto leading-relaxed">
                                            We couldn't find any orders in this category or timeline. Click "Simulator" in the dashboard to place sample orders.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/dashboard/customer')}
                                        className="bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white px-5 py-2.5 rounded-xl text-xs font-black transition-colors"
                                    >
                                        Go Shop Now
                                    </button>
                                </div>
                            ) : (
                                <div className="divide-y divide-[var(--card-border)]/40">
                                    {paginatedOrders.map((item, index) => {
                                        
                                        // Colors mapping for status badges
                                        let badgeColor = 'bg-neutral-500/10 text-neutral-500 border border-neutral-500/10'
                                        if (item.OrderStatus === 'Delivered') {
                                            badgeColor = 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/15'
                                        } else if (item.OrderStatus === 'Shipped') {
                                            badgeColor = 'bg-sky-500/10 text-sky-600 border border-sky-500/15'
                                        } else if (item.OrderStatus === 'Confirmed') {
                                            badgeColor = 'bg-amber-500/10 text-amber-600 border border-amber-500/15'
                                        } else if (item.OrderStatus === 'Cancelled') {
                                            badgeColor = 'bg-rose-500/10 text-rose-600 border border-rose-500/15'
                                        } else if (item.OrderStatus === 'Returned') {
                                            badgeColor = 'bg-orange-500/10 text-orange-600 border border-orange-500/15'
                                        } else if (item.OrderStatus === 'Pending') {
                                            badgeColor = 'bg-amber-500/10 text-amber-500 border border-amber-500/15'
                                        }

                                        return (
                                            <div 
                                                key={item.OrderID + '-' + index}
                                                className="grid grid-cols-1 md:grid-cols-12 gap-6 px-8 py-7 md:py-8 hover:bg-[var(--bg-right-panel)]/30 transition-all items-center"
                                            >
                                                {/* Column 1: Order Details */}
                                                <div className="col-span-1 md:col-span-4 flex items-center gap-5">
                                                    
                                                    {/* Product image */}
                                                    <div className="h-16 w-16 bg-[var(--bg-right-panel)] rounded-2xl overflow-hidden border border-[var(--card-border)] flex-shrink-0 flex items-center justify-center p-1.5">
                                                        <img 
                                                            src={item.image} 
                                                            alt={item.ProductName} 
                                                            className="h-full w-full object-contain rounded-xl"
                                                            onError={(e) => {
                                                                e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80'
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Product Info details */}
                                                    <div className="space-y-1 text-left min-w-0">
                                                        <div className="text-[10px] font-bold text-[var(--gold-accent)] tracking-wider">
                                                            Order #{item.OrderID}
                                                        </div>
                                                        <h4 className="text-sm font-black text-[var(--text-primary)] truncate">
                                                            {item.ProductName}
                                                        </h4>
                                                        <p className="text-xs font-semibold text-[var(--text-muted)] truncate">
                                                            {item.description}
                                                        </p>
                                                        <div className="text-[11px] font-bold text-[var(--text-secondary)]">
                                                            Qty: {item.Quantity}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Column 2: Date */}
                                                <div className="col-span-1 md:col-span-2 text-left md:text-left flex md:block items-center justify-between">
                                                    <span className="md:hidden text-[10px] font-black uppercase text-[var(--text-muted)]">Date:</span>
                                                    <div className="leading-snug">
                                                        <div className="text-sm font-black text-[var(--text-primary)]">
                                                            {item.OrderDate.toLocaleDateString('en-IN', {
                                                                day: '2-digit', month: 'short', year: 'numeric'
                                                            })}
                                                        </div>
                                                        <div className="text-xs font-semibold text-[var(--text-muted)] mt-1">
                                                            {item.OrderDate.toLocaleTimeString('en-IN', {
                                                                hour: '2-digit', minute: '2-digit', hour12: true
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Column 3: Amount */}
                                                <div className="col-span-1 md:col-span-2 text-left md:text-left flex md:block items-center justify-between">
                                                    <span className="md:hidden text-[10px] font-black uppercase text-[var(--text-muted)]">Amount:</span>
                                                    <div className="leading-snug">
                                                        <div className="text-sm font-black text-[var(--text-primary)]">
                                                            {formatCurrency(item.TotalAmount)}
                                                        </div>
                                                        <div className="text-xs font-semibold text-[var(--text-muted)] mt-1">
                                                            {item.PaymentMethod}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Column 4: Status */}
                                                <div className="col-span-1 md:col-span-2 text-left md:text-left flex md:block items-center justify-between">
                                                    <span className="md:hidden text-[10px] font-black uppercase text-[var(--text-muted)]">Status:</span>
                                                    <div className="space-y-1.5">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${badgeColor}`}>
                                                            {item.OrderStatus}
                                                        </span>
                                                        <div className="text-[11px] font-semibold text-[var(--text-muted)] leading-tight">
                                                            {item.statusDetail}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Column 5: Actions */}
                                                <div className="col-span-1 md:col-span-2 text-left md:text-right flex md:flex-col md:items-end gap-2 justify-end">
                                                    <button
                                                        onClick={() => setSelectedOrderDetail(item)}
                                                        className="py-2 px-4 border border-[var(--gold-accent)] hover:bg-[var(--gold-bg-pill)] text-[var(--gold-accent)] text-xs font-black rounded-xl transition-colors cursor-pointer w-full md:w-auto text-center"
                                                    >
                                                        View Details
                                                    </button>
                                                    
                                                    {/* Secondary action: buy again / track order */}
                                                    {item.OrderStatus === 'Delivered' && (
                                                        <button
                                                            onClick={() => handleBuyAgain(item)}
                                                            disabled={actionLoading}
                                                            className="block text-center mt-1 text-[var(--gold-accent)] hover:text-[var(--gold-hover)] font-black text-xs hover:underline cursor-pointer disabled:opacity-50"
                                                        >
                                                            Buy Again
                                                        </button>
                                                    )}

                                                    {(item.OrderStatus === 'Shipped' || item.OrderStatus === 'Confirmed') && (
                                                        <button
                                                            onClick={() => {
                                                                setTrackingOrder(item)
                                                                setIsTrackingModalOpen(true)
                                                            }}
                                                            className="block text-center mt-1 text-[var(--gold-accent)] hover:text-[var(--gold-hover)] font-black text-xs hover:underline cursor-pointer"
                                                        >
                                                            Track Order
                                                        </button>
                                                    )}
                                                </div>

                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                        </div>

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-2 pb-4">
                                {/* Prev arrow */}
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="h-9 w-9 flex items-center justify-center rounded-xl border border-[var(--card-border)] text-[var(--text-muted)] hover:border-[var(--gold-accent)] hover:text-[var(--gold-accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                {/* Page number buttons */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`h-9 w-9 flex items-center justify-center rounded-xl text-xs font-black transition-all cursor-pointer ${
                                            currentPage === page
                                                ? 'bg-[var(--gold-accent)] text-white shadow-md'
                                                : 'border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--gold-accent)] hover:text-[var(--gold-accent)]'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                {/* Next arrow */}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="h-9 w-9 flex items-center justify-center rounded-xl border border-[var(--card-border)] text-[var(--text-muted)] hover:border-[var(--gold-accent)] hover:text-[var(--gold-accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </main>

            {/* ORDER DETAILS RECEIPT MODAL */}
            {selectedOrderDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-lg rounded-2xl border border-[var(--card-border)] p-6 shadow-2xl relative overflow-hidden transition-all bg-[var(--bg-right-panel)] text-[var(--text-primary)] max-h-[90vh] overflow-y-auto no-scrollbar">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--card-border)]">
                            <h3 className="font-['Outfit'] text-base font-black flex items-center gap-2 text-[var(--text-primary)]">
                                <ShoppingBag className="h-5 w-5 text-[var(--gold-accent)]" /> Order Receipt Details
                            </h3>
                            <button
                                onClick={() => setSelectedOrderDetail(null)}
                                className="h-8 w-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 border border-transparent hover:border-[var(--card-border)] flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-all cursor-pointer"
                            >
                                <X className="h-4.5 w-4.5" />
                            </button>
                        </div>

                        {/* Body Details */}
                        <div className="space-y-5 text-xs font-semibold">
                            
                            {/* ID Date Status Info */}
                            <div className="grid grid-cols-2 gap-4 bg-[var(--card-bg)] border border-[var(--card-border)] p-4 rounded-xl">
                                <div>
                                    <span className="block text-[8.5px] font-black uppercase text-[var(--text-muted)] tracking-wider">Order ID</span>
                                    <span className="font-mono text-xs font-extrabold text-[var(--text-primary)]">#{selectedOrderDetail.OrderID}</span>
                                </div>
                                <div>
                                    <span className="block text-[8.5px] font-black uppercase text-[var(--text-muted)] tracking-wider">Order Date</span>
                                    <span className="text-xs font-extrabold text-[var(--text-primary)]">
                                        {selectedOrderDetail.OrderDate.toLocaleString('en-IN', {
                                            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <span className="block text-[8.5px] font-black uppercase text-[var(--text-muted)] tracking-wider">Payment Method</span>
                                    <span className="text-xs font-extrabold text-[var(--text-primary)]">{selectedOrderDetail.PaymentMethod}</span>
                                </div>
                                <div className="mt-2">
                                    <span className="block text-[8.5px] font-black uppercase text-[var(--text-muted)] tracking-wider">Current Status</span>
                                    <span className="text-xs font-extrabold text-[var(--gold-accent)]">{selectedOrderDetail.OrderStatus} ({selectedOrderDetail.statusDetail})</span>
                                </div>
                            </div>

                            {/* Item details */}
                            <div className="space-y-2">
                                <span className="block text-[8.5px] font-black uppercase text-[var(--text-muted)] tracking-wider">Product Info</span>
                                <div className="flex items-center gap-4 bg-[var(--card-bg)] border border-[var(--card-border)] p-4 rounded-xl">
                                    <div className="h-16 w-16 bg-[var(--bg-right-panel)] rounded-lg overflow-hidden border border-[var(--card-border)] flex-shrink-0">
                                        <img src={selectedOrderDetail.image} alt={selectedOrderDetail.ProductName} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{selectedOrderDetail.Brand}</div>
                                        <h4 className="text-xs font-extrabold text-[var(--text-primary)] truncate">{selectedOrderDetail.ProductName}</h4>
                                        <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 truncate">{selectedOrderDetail.description}</p>
                                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-[var(--card-border)]/50">
                                            <span className="text-[11px] text-[var(--text-muted)]">Price: {formatCurrency(selectedOrderDetail.UnitPrice)} &times; {selectedOrderDetail.Quantity}</span>
                                            <span className="text-xs font-black text-[var(--gold-accent)]">{formatCurrency(selectedOrderDetail.TotalAmount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address details */}
                            <div className="space-y-2">
                                <span className="block text-[8.5px] font-black uppercase text-[var(--text-muted)] tracking-wider">Shipping Address</span>
                                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-4 rounded-xl leading-relaxed text-left text-[var(--text-secondary)]">
                                    <div className="font-extrabold text-[var(--text-primary)]">{user?.name || 'Dhruva Tajapara'}</div>
                                    <div>{selectedOrderDetail.City}, {selectedOrderDetail.State}</div>
                                    <div>{selectedOrderDetail.Country} - India</div>
                                    <div className="text-[10px] text-[var(--text-muted)] mt-1.5 font-medium">Contact: +91 99989 99989</div>
                                </div>
                            </div>

                            {/* Actions block */}
                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--card-border)]">
                                <button
                                    onClick={() => setSelectedOrderDetail(null)}
                                    className="px-4 py-2 border border-[var(--card-border)] hover:bg-neutral-100 dark:hover:bg-white/5 rounded-xl font-black text-xs transition-colors uppercase tracking-wider cursor-pointer"
                                >
                                    Close Receipt
                                </button>
                                {selectedOrderDetail.OrderStatus === 'Delivered' ? (
                                    <button
                                        onClick={() => {
                                            setSelectedOrderDetail(null)
                                            handleBuyAgain(selectedOrderDetail)
                                        }}
                                        className="px-5 py-2 bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white rounded-xl text-xs font-black shadow-md uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5"
                                    >
                                        <ShoppingCart className="h-3.5 w-3.5" /> Buy Again
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setSelectedOrderDetail(null)
                                            setTrackingOrder(selectedOrderDetail)
                                            setIsTrackingModalOpen(true)
                                        }}
                                        className="px-5 py-2 bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white rounded-xl text-xs font-black shadow-md uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5"
                                    >
                                        <Truck className="h-3.5 w-3.5" /> Track Status
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TRACK ORDER STATUS TIMELINE MODAL */}
            {isTrackingModalOpen && trackingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-md rounded-2xl border border-[var(--card-border)] p-6 shadow-2xl relative overflow-hidden transition-all bg-[var(--bg-right-panel)] text-[var(--text-primary)]">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--card-border)]">
                            <h3 className="font-['Outfit'] text-base font-black flex items-center gap-2 text-[var(--text-primary)]">
                                <Truck className="h-5 w-5 text-[var(--gold-accent)]" /> Delivery Tracking Timeline
                            </h3>
                            <button
                                onClick={() => {
                                    setIsTrackingModalOpen(false)
                                    setTrackingOrder(null)
                                }}
                                className="h-8 w-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 border border-transparent hover:border-[var(--card-border)] flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-all cursor-pointer"
                            >
                                <X className="h-4.5 w-4.5" />
                            </button>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-6 py-4 text-xs font-semibold">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-[var(--text-muted)] font-bold">Tracking ID: TRK-{trackingOrder.OrderID}</span>
                                <span className="text-xs font-black text-[var(--gold-accent)]">{trackingOrder.OrderStatus}</span>
                            </div>

                            {/* Timeline path list */}
                            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[var(--card-border)] text-left">
                                
                                {/* Step 1: Confirmed */}
                                <div className="relative">
                                    <div className="absolute -left-[20px] top-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[var(--card-border)] ring-4 ring-emerald-500/10 flex items-center justify-center" />
                                    <div className="leading-snug pl-2">
                                        <h4 className="font-extrabold text-[var(--text-primary)] text-xs">Order Confirmed</h4>
                                        <p className="text-[10px] text-[var(--text-muted)]">Seller accepted order & processing payment</p>
                                        <p className="text-[9px] font-bold text-[var(--text-secondary)] mt-0.5">
                                            {new Date(trackingOrder.OrderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, 
                                            {' '}{new Date(trackingOrder.OrderDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Step 2: Shipped */}
                                <div className="relative">
                                    <div className={`absolute -left-[20px] top-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-[var(--card-border)] flex items-center justify-center ${
                                        trackingOrder.OrderStatus === 'Shipped' || trackingOrder.OrderStatus === 'Delivered'
                                            ? 'bg-emerald-500 ring-4 ring-emerald-500/10'
                                            : 'bg-[var(--card-border)]'
                                    }`} />
                                    <div className="leading-snug pl-2">
                                        <h4 className={`font-extrabold text-xs ${
                                            trackingOrder.OrderStatus === 'Shipped' || trackingOrder.OrderStatus === 'Delivered'
                                                ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                                        }`}>In Transit (Shipped)</h4>
                                        <p className="text-[10px] text-[var(--text-muted)]">Order dispatched from Hub Warehouse facility</p>
                                        {(trackingOrder.OrderStatus === 'Shipped' || trackingOrder.OrderStatus === 'Delivered') && (
                                            <p className="text-[9px] font-bold text-[var(--text-secondary)] mt-0.5">
                                                {new Date(new Date(trackingOrder.OrderDate).getTime() + 24*3600*1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, 12:45 PM
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Step 3: Out for Delivery */}
                                <div className="relative">
                                    <div className={`absolute -left-[20px] top-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-[var(--card-border)] flex items-center justify-center ${
                                        trackingOrder.OrderStatus === 'Delivered'
                                            ? 'bg-emerald-500 ring-4 ring-emerald-500/10'
                                            : 'bg-[var(--card-border)]'
                                    }`} />
                                    <div className="leading-snug pl-2">
                                        <h4 className={`font-extrabold text-xs ${
                                            trackingOrder.OrderStatus === 'Delivered'
                                                ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                                        }`}>Out for Delivery</h4>
                                        <p className="text-[10px] text-[var(--text-muted)]">Courier partner has picked up package for local dispatch</p>
                                    </div>
                                </div>

                                {/* Step 4: Delivered */}
                                <div className="relative font-bold">
                                    <div className={`absolute -left-[20px] top-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-[var(--card-border)] flex items-center justify-center ${
                                        trackingOrder.OrderStatus === 'Delivered'
                                            ? 'bg-emerald-500 ring-4 ring-emerald-500/10'
                                            : 'bg-[var(--card-border)]'
                                    }`} />
                                    <div className="leading-snug pl-2">
                                        <h4 className={`font-extrabold text-xs ${
                                            trackingOrder.OrderStatus === 'Delivered'
                                                ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                                        }`}>Delivered</h4>
                                        <p className="text-[10px] text-[var(--text-muted)]">Package handed over safely to recipient</p>
                                    </div>
                                </div>

                            </div>

                            {/* Footer dismiss button */}
                            <div className="pt-4 flex items-center justify-end border-t border-[var(--card-border)]">
                                <button
                                    onClick={() => {
                                        setIsTrackingModalOpen(false)
                                        setTrackingOrder(null)
                                    }}
                                    className="px-5 py-2.5 bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white text-xs font-black rounded-xl shadow-md uppercase tracking-wider cursor-pointer"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    )
}
