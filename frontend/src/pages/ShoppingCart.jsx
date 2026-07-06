import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    ShoppingBag, Heart, Search, ChevronDown, Star, LogOut, Moon, Sun, 
    RefreshCw, X, Trash2, Clock, CheckCircle2, ShieldCheck, Truck, Headphones, Plus
} from 'lucide-react'
import { ALL_PRODUCTS, RECOMMENDED_PRODUCTS, YOU_MAY_ALSO_LIKE, BRANDS } from '../data/dashboardData'

export default function ShoppingCart() {
    const navigate = useNavigate()
    const { user, logout, api } = useAuth()

    const [products, setProducts] = useState(ALL_PRODUCTS)

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
        fetchDBProducts()
    }, [api])

    // UI States
    const [isDark, setIsDark] = useState(() => localStorage.getItem('vf_dark_mode') === 'true')
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
    const [isOrdersDrawerOpen, setIsOrdersDrawerOpen] = useState(false)
    const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)

    // Load static mock dataset if cart is empty, to provide realistic demo
    const defaultCart = [
        {
            id: 'p-iphone15',
            name: 'Apple iPhone 15 (128GB) - Blue',
            brand: 'Apple',
            category: 'Electronics',
            price: 64999,
            originalPrice: 79900,
            discount: '18% OFF',
            image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop',
            quantity: 1,
            color: 'Blue',
            storage: '128GB',
            inStock: true
        },
        {
            id: 'p-6',
            name: 'Sony WH-1000XM5 Wireless Headphones',
            brand: 'Sony',
            category: 'Electronics',
            price: 29990,
            originalPrice: 36990,
            discount: '18% OFF',
            image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80',
            quantity: 1,
            color: 'Silver',
            storage: 'Standard',
            inStock: true
        },
        {
            id: 'p-3',
            name: 'Fire-Boltt Ninja 3 Smartwatch',
            brand: 'Fire-Boltt',
            category: 'Electronics',
            price: 1799,
            originalPrice: 2299,
            discount: '20% OFF',
            image: 'https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?q=80&w=1986&auto=format&fit=crop',
            quantity: 1,
            color: 'Black',
            storage: 'Standard',
            inStock: true
        }
    ]

    // Local Storage Cart Sync
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem(`vf_cart_${user?._id || 'temp'}`);
        return saved ? JSON.parse(saved) : defaultCart;
    })

    useEffect(() => {
        localStorage.setItem(`vf_cart_${user?._id || 'temp'}`, JSON.stringify(cart));
    }, [cart, user?._id])

    // Wishlist Sync
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem(`vf_wishlist_${user?._id || 'temp'}`);
        return saved ? JSON.parse(saved) : [];
    })

    useEffect(() => {
        localStorage.setItem(`vf_wishlist_${user?._id || 'temp'}`, JSON.stringify(wishlist));
    }, [wishlist, user?._id])

    const toggleWishlist = (productId) => {
        if (wishlist.includes(productId)) {
            setWishlist(wishlist.filter(id => id !== productId));
        } else {
            setWishlist([...wishlist, productId]);
        }
    }

    // Cart Actions
    const updateQuantity = (index, delta) => {
        const updated = [...cart]
        updated[index].quantity = Math.max(updated[index].quantity + delta, 1)
        setCart(updated)
    }

    const removeCartItem = (index) => {
        setCart(cart.filter((_, i) => i !== index))
    }

    const addToCart = (productToAdd) => {
        const existingIndex = cart.findIndex(item => item.id === productToAdd.id)
        if (existingIndex > -1) {
            updateQuantity(existingIndex, 1)
        } else {
            setCart([...cart, {
                ...productToAdd,
                quantity: 1,
                color: 'Default',
                storage: 'Standard',
                inStock: true
            }])
        }
    }

    // Calculations
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const originalSubtotal = cart.reduce((sum, item) => sum + (item.originalPrice || item.price) * item.quantity, 0)
    const discountSavings = originalSubtotal - subtotal
    const deliveryThreshold = 99000
    const deliveryCharge = subtotal >= deliveryThreshold || subtotal === 0 ? 0 : 99
    const totalAmount = subtotal + deliveryCharge

    // Fetch customer orders history
    const fetchCustomerOrders = useCallback(async () => {
        setLoading(true)
        try {
            const { data } = await api.get('/orders', {
                params: {
                    customerID: user?._id,
                    limit: 100
                }
            })
            if (data.success) {
                setOrders(data.data || [])
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

    const handleCancelOrder = useCallback(async (orderId) => {
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
    }, [api, fetchCustomerOrders])

    // Simulated Checkout API loop
    const handleCheckoutSubmit = async () => {
        if (cart.length === 0) return
        setActionLoading(true)
        try {
            // Loop through each cart item and submit as order
            for (const item of cart) {
                const brandName = item.brand || 'Generic'
                const orderPayload = {
                    OrderID: 'ORD' + Math.floor(1000000 + Math.random() * 9000000),
                    CustomerID: user?._id || 'CUST_TEMP',
                    CustomerName: user?.name || 'Dhruva Tajapara',
                    ProductID: item.id,
                    ProductName: `${item.name} (${item.color}, ${item.storage})`,
                    Category: item.category || 'Electronics',
                    Brand: brandName,
                    Quantity: item.quantity,
                    UnitPrice: item.price,
                    TotalAmount: item.price * item.quantity,
                    PaymentMethod: 'UPI',
                    OrderDate: new Date(),
                    OrderStatus: 'Pending',
                    City: 'Mumbai',
                    State: 'MH',
                    Country: 'India',
                    SellerID: 'SELL' + Math.floor(10000 + Math.random() * 90000)
                }
                await api.post('/orders', orderPayload)
            }
            // Clear cart upon successful database commit
            setCart([])
            fetchCustomerOrders()
            setIsOrdersDrawerOpen(true)
        } catch (err) {
            alert('Failed to place order: ' + (err.response?.data?.message || err.message))
        } finally {
            setActionLoading(false)
        }
    }

    const toggleTheme = () => {
        const next = !isDark
        setIsDark(next)
        localStorage.setItem('vf_dark_mode', String(next))
    }

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val || 0)
    }

    // Recommendation lists
    const recommendationItems = [
        { id: 'p-4', name: 'boAt Airdopes 141 Earbuds', category: 'Electronics', price: 1299, rating: 4.4, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80' },
        { id: 'p-9', name: 'JBL Flip 6 Speaker', category: 'Electronics', price: 8999, rating: 4.6, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80' },
        { id: 'like-1', name: 'Premium Leather Phone Case', category: 'Electronics', price: 999, rating: 4.5, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80' },
        { id: 'p-12', name: 'Mi Power Bank 3i 20000mAh', category: 'Electronics', price: 1499, rating: 4.4, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=687&auto=format&fit=crop' },
        { id: 'p-48', name: 'Fast Charging USB-C Cable', category: 'Electronics', price: 284, rating: 4.9, image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?w=400&q=80' }
    ]

    const activeOrderCount = orders.filter(o => o.OrderStatus === 'Pending' || o.OrderStatus === 'Processing' || o.OrderStatus === 'Shipped').length
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
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
        <div className={`min-h-screen font-['Inter'] relative transition-colors duration-300 ${isDark ? 'theme-dark' : ''} bg-[var(--bg-right-panel)] text-[var(--text-primary)]`}>
            
            {/* Top Navbar */}
            <header className="bg-[var(--card-bg)] sticky top-0 z-40 transition-colors">
                <div className="max-w-7xl mx-auto px-4 lg:px-6 h-20 flex items-center justify-between gap-4">
                    
                    {/* Logo */}
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
                            <div className="text-[9px] font-black tracking-widest text-[var(--gold-accent)] uppercase mt-1">Shop More, Sell More</div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-xl items-center border border-[var(--card-border)] rounded-xl overflow-hidden bg-[var(--bg-right-panel)]">
                        <div className="pl-3.5 text-[var(--text-muted)]">
                            <Search className="h-4 w-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for products, brands and more..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-2.5 px-3 bg-transparent text-xs font-medium outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                        />
                        <div className="flex items-center gap-1 px-3 py-1.5 border-l border-[var(--card-border)] text-[var(--text-secondary)] text-xs font-bold shrink-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            All Categories <ChevronDown className="h-3 w-3 opacity-70" />
                        </div>
                        <button onClick={() => navigate('/dashboard/customer')} className="bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white p-3.5 transition-colors shrink-0 outline-none">
                            <Search className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center gap-3 lg:gap-5">
                        
                        {/* Wishlist */}
                        <button 
                            onClick={() => setIsWishlistDrawerOpen(true)}
                            className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--gold-accent)] font-semibold text-xs transition-colors shrink-0 relative cursor-pointer"
                        >
                            <div className="relative">
                                <Heart className={`h-4 w-4 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-[var(--text-muted)]'}`} />
                                {wishlist.length > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-[var(--card-bg)]">
                                        {wishlist.length}
                                    </span>
                                )}
                            </div>
                            <span className="hidden sm:inline">Wishlist</span>
                        </button>

                        {/* Cart */}
                        <button
                            onClick={() => navigate('/cart')}
                            className="flex items-center gap-1.5 text-[var(--gold-accent)] font-semibold text-xs relative shrink-0"
                        >
                            <div className="relative">
                                <ShoppingBag className="h-4 w-4 text-[var(--gold-accent)]" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-[var(--gold-accent)] text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-[var(--card-bg)]">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="hidden sm:inline">Cart</span>
                        </button>

                        {/* Theme Toggle */}
                        <button onClick={toggleTheme} className="h-9 w-9 rounded-lg border border-[var(--card-border)] flex items-center justify-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                            {isDark ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-[var(--text-secondary)]" />}
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative shrink-0" ref={profileMenuRef}>
                            <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="flex items-center gap-2 text-left hover:opacity-95">
                                <div className="h-9 w-9 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--gold-accent)] flex items-center justify-center font-black text-xs">DT</div>
                                <div className="hidden lg:block leading-none">
                                    <div className="text-xs font-bold text-[var(--text-primary)]">{user?.name || 'Dhruva'}</div>
                                    <div className="text-[9px] font-semibold text-[var(--text-muted)] mt-0.5">Customer Portal</div>
                                </div>
                                <ChevronDown className="h-3 w-3 text-[var(--text-muted)]" />
                            </button>

                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2.5 w-48 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl py-2 z-50 animate-scale-up">
                                    <button
                                        onClick={() => {
                                            setIsProfileDropdownOpen(false)
                                            setIsOrdersDrawerOpen(true)
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-[var(--bg-right-panel)] text-xs font-semibold flex items-center gap-2 text-[var(--text-secondary)]"
                                    >
                                        <Clock className="h-4 w-4 text-[var(--text-muted)]" /> My Orders History
                                    </button>
                                    <hr className="border-[var(--card-border)] my-1.5 opacity-40" />
                                    <button onClick={async () => { await logout(); navigate('/login') }} className="w-full text-left px-4 py-2 hover:bg-rose-500/5 text-xs font-bold flex items-center gap-2 text-rose-500">
                                        <LogOut className="h-4 w-4" /> Logout Account
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Second Navbar Links */}
            <div className="border-y border-[var(--card-border)]/60 bg-[var(--card-bg)] py-3">
                <div className="max-w-7xl mx-auto px-4 lg:px-6 flex items-center justify-between text-xs font-bold text-[var(--text-secondary)] overflow-x-auto no-scrollbar gap-6">
                    <div onClick={() => navigate('/dashboard/customer')} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white rounded-lg cursor-pointer transition-colors shadow-sm shrink-0">
                        <Plus className="h-3.5 w-3.5" /> All Categories
                    </div>
                    {['Today\'s Deals', 'Top Sellers', 'New Arrivals', 'Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Automotive'].map((link) => (
                        <span key={link} onClick={() => navigate('/dashboard/customer')} className="hover:text-[var(--gold-accent)] transition-colors cursor-pointer shrink-0">{link}</span>
                    ))}
                </div>
            </div>

            {/* Main Cart Content */}
            <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-10">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Section: Cart Items list */}
                    <div className="lg:col-span-8 space-y-6">
                        <div>
                            <h1 className="font-['Outfit'] text-2xl font-black text-[var(--text-primary)]">Shopping Cart ({cart.length} Items)</h1>
                            <p className="text-xs font-medium text-[var(--text-muted)] mt-1">Review your items and proceed to checkout</p>
                        </div>

                        {cart.length === 0 ? (
                            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2rem] p-16 text-center shadow-sm space-y-4">
                                <div className="h-16 w-16 rounded-full bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] flex items-center justify-center mx-auto text-xl font-bold">🛒</div>
                                <h3 className="font-['Outfit'] font-black text-lg text-[var(--text-primary)]">Your Cart is Empty</h3>
                                <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">Add some premium items from our storefront to review and checkout.</p>
                                <button onClick={() => navigate('/dashboard/customer')} className="bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-colors">Shop Now</button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item, idx) => (
                                    <div key={`${item.id}-${item.color}-${item.storage}`} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-5 justify-between shadow-sm hover:shadow-md transition-all duration-300">
                                        
                                        {/* Product image */}
                                        <div className="relative bg-[var(--bg-right-panel)] h-28 w-28 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-[var(--card-border)]/50">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
                                            <div>
                                                <span className="text-[9px] font-black uppercase text-[var(--gold-accent)] tracking-wider">{item.brand}</span>
                                                <h3 onClick={() => navigate(`/product/${item.id}`)} className="font-bold text-sm text-[var(--text-primary)] truncate cursor-pointer hover:text-[var(--gold-accent)] mt-0.5">{item.name}</h3>
                                                <div className="text-[10px] text-[var(--text-muted)] font-semibold mt-1">
                                                    Color: {item.color} • Storage: {item.storage}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center sm:justify-start gap-3 text-[10px] font-bold">
                                                <span className="text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase">In Stock</span>
                                                <span className="text-neutral-400">•</span>
                                                <span className="text-[var(--text-secondary)]">Free Delivery Eligible</span>
                                            </div>
                                        </div>

                                        {/* Quantity & Actions */}
                                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:gap-3 shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-[var(--card-border)]/40">
                                            <div className="text-right flex flex-col">
                                                <span className="text-sm font-black text-[var(--text-primary)]">{formatCurrency(item.price * item.quantity)}</span>
                                                {item.originalPrice && (
                                                    <span className="text-[10px] text-[var(--text-muted)] line-through font-semibold mt-0.5">{formatCurrency(item.originalPrice * item.quantity)}</span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {/* Quantity Selector */}
                                                <div className="flex items-center border border-[var(--card-border)] rounded-lg overflow-hidden bg-[var(--bg-right-panel)]">
                                                    <button onClick={() => updateQuantity(idx, -1)} className="px-2.5 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-bold text-xs">-</button>
                                                    <span className="px-3 py-1 bg-transparent text-xs font-black text-[var(--text-primary)]">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(idx, 1)} className="px-2.5 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-bold text-xs">+</button>
                                                </div>

                                                {/* Remove */}
                                                <button onClick={() => removeCartItem(idx)} className="h-8 w-8 rounded-lg border border-transparent hover:border-rose-500/20 text-[var(--text-muted)] hover:text-rose-500 flex items-center justify-center transition-all bg-[var(--bg-right-panel)] cursor-pointer" title="Remove Item">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Free delivery progress bar */}
                                {subtotal < deliveryThreshold ? (
                                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5 space-y-3 shadow-sm">
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="text-[var(--text-secondary)]">Free Delivery Progress</span>
                                            <span className="text-[var(--gold-accent)]">₹{subtotal.toLocaleString()} / ₹{deliveryThreshold.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full bg-[var(--bg-right-panel)] rounded-full h-2 overflow-hidden border border-[var(--card-border)]/50">
                                            <div className="bg-[var(--gold-accent)] h-full transition-all duration-500" style={{ width: `${(subtotal / deliveryThreshold) * 100}%` }} />
                                        </div>
                                        <p className="text-[11px] font-bold text-[var(--text-secondary)] text-center">
                                            Add more products worth <span className="text-[var(--gold-accent)]">₹{(deliveryThreshold - subtotal).toLocaleString()}</span> to get <span className="text-emerald-500">FREE Delivery</span>
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5 flex items-center gap-3 shadow-sm justify-center text-emerald-500 bg-emerald-500/5">
                                        <CheckCircle2 className="h-5 w-5 animate-bounce" />
                                        <span className="text-xs font-black uppercase tracking-wider">Congratulations! You qualify for FREE Delivery! 🎉</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Section: Summary and Bank Offers */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Order Summary Card */}
                        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2rem] p-6 space-y-5 shadow-sm">
                            <h3 className="font-['Outfit'] font-black text-base text-[var(--text-primary)] border-b pb-3.5 border-[var(--card-border)]/50">Order Summary</h3>
                            
                            <div className="space-y-3 text-xs font-semibold text-[var(--text-secondary)]">
                                <div className="flex items-center justify-between">
                                    <span>Subtotal ({cartCount} items)</span>
                                    <span className="text-[var(--text-primary)] font-bold">{formatCurrency(subtotal + discountSavings)}</span>
                                </div>
                                <div className="flex items-center justify-between text-emerald-500">
                                    <span>Discount Savings</span>
                                    <span>-{formatCurrency(discountSavings)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Delivery Charges</span>
                                    <span className={deliveryCharge === 0 ? 'text-emerald-500 font-bold' : 'text-[var(--text-primary)] font-bold'}>
                                        {deliveryCharge === 0 ? 'FREE' : formatCurrency(deliveryCharge)}
                                    </span>
                                </div>
                                <hr className="border-[var(--card-border)]/50 my-1" />
                                <div className="flex items-baseline justify-between text-sm font-black text-[var(--text-primary)] pt-1">
                                    <span>Total Amount:</span>
                                    <span className="text-lg text-[var(--gold-accent)] font-black">{formatCurrency(totalAmount)}</span>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <button
                                    onClick={handleCheckoutSubmit}
                                    disabled={actionLoading || cart.length === 0}
                                    className="w-full py-3 rounded-xl bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {actionLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ShoppingBag className="h-4.5 w-4.5" />}
                                    Proceed to Checkout
                                </button>
                                <button
                                    onClick={handleCheckoutSubmit}
                                    disabled={actionLoading || cart.length === 0}
                                    className="w-full py-3 rounded-xl border border-[var(--gold-accent)] hover:bg-[var(--gold-bg-pill)] text-[var(--gold-accent)] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        {/* Available Offers Card */}
                        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2rem] p-6 space-y-4 shadow-sm">
                            <h3 className="font-['Outfit'] font-black text-xs uppercase tracking-wider text-[var(--text-primary)] border-b pb-3.5 border-[var(--card-border)]/50">Available Offers</h3>
                            <div className="space-y-3 text-[11px] leading-relaxed">
                                <div className="flex items-start gap-2.5">
                                    <span className="text-[var(--gold-accent)] mt-0.5">•</span>
                                    <div>
                                        <span className="font-bold text-[var(--text-primary)] block">Bank Offer</span>
                                        <span className="text-[var(--text-secondary)] font-medium">10% Instant Discount on HDFC Bank Credit Cards. Min. purchase ₹5,000.</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <span className="text-[var(--gold-accent)] mt-0.5">•</span>
                                    <div>
                                        <span className="font-bold text-[var(--text-primary)] block">No Cost EMI</span>
                                        <span className="text-[var(--text-secondary)] font-medium">No Cost EMI option available on select cards for orders above ₹3,000.</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <span className="text-[var(--gold-accent)] mt-0.5">•</span>
                                    <div>
                                        <span className="font-bold text-[var(--text-primary)] block">Exchange Offer</span>
                                        <span className="text-[var(--text-secondary)] font-medium">Exchange your old gadget and get additional discount value up to ₹15,000.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* You may also like Horizontal Carousel */}
                <section className="space-y-4 pt-6">
                    <div className="flex items-center justify-between border-b pb-3 border-[var(--card-border)]/50">
                        <h2 className="font-['Outfit'] text-lg font-black text-[var(--text-primary)]">You May Also Like</h2>
                        <span onClick={() => navigate('/dashboard/customer')} className="text-xs font-bold text-[var(--gold-accent)] cursor-pointer hover:underline">View All</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                        {recommendationItems.map((prod) => (
                            <div key={prod.id} className="bg-[var(--card-bg)] border border-[var(--card-border)] p-3 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                                <div onClick={() => navigate(`/product/${prod.id}`)} className="bg-[var(--bg-right-panel)] h-28 w-full rounded-xl overflow-hidden flex items-center justify-center border border-[var(--card-border)] shadow-inner cursor-pointer">
                                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="mt-3.5 space-y-2">
                                    <div>
                                        <span className="text-[8.5px] font-bold text-[var(--text-muted)] uppercase block">Electronics</span>
                                        <h3 onClick={() => navigate(`/product/${prod.id}`)} className="font-bold text-[11px] text-[var(--text-primary)] line-clamp-1 leading-snug mt-0.5 cursor-pointer hover:text-[var(--gold-accent)] transition-colors">{prod.name}</h3>
                                    </div>
                                    <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-[var(--card-border)] opacity-95">
                                        <span className="text-xs font-black text-[var(--text-primary)]">{formatCurrency(prod.price)}</span>
                                        <button
                                            onClick={() => addToCart(prod)}
                                            className="px-2.5 py-1.5 bg-[var(--gold-accent)]/10 hover:bg-[var(--gold-accent)] text-[var(--gold-accent)] hover:text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors shrink-0"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Bottom Rights Ribbon Card */}
                <section className="bg-[var(--card-bg)] border border-[var(--card-border)] p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-6 shadow-sm">
                    <div className="flex items-center gap-3.5 px-3">
                        <div className="p-2.5 rounded-xl bg-[var(--badge-bg)] text-[var(--gold-accent)] shrink-0 border border-[var(--badge-border)]">
                            <ShieldCheck className="h-5.5 w-5.5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-black tracking-tight">100% Secure Payments</h4>
                            <p className="text-[10px] font-semibold text-[var(--text-muted)] mt-0.5">Trust and security assured</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3.5 px-3">
                        <div className="p-2.5 rounded-xl bg-[var(--badge-bg)] text-[var(--gold-accent)] shrink-0 border border-[var(--badge-border)]">
                            <RefreshCw className="h-5.5 w-5.5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-black tracking-tight">Easy Returns</h4>
                            <p className="text-[10px] font-semibold text-[var(--text-muted)] mt-0.5">30-day quick refund support</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3.5 px-3">
                        <div className="p-2.5 rounded-xl bg-[var(--badge-bg)] text-[var(--gold-accent)] shrink-0 border border-[var(--badge-border)]">
                            <Headphones className="h-5.5 w-5.5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-black tracking-tight">24/7 Customer Support</h4>
                            <p className="text-[10px] font-semibold text-[var(--text-muted)] mt-0.5">Always here to help you</p>
                        </div>
                    </div>
                </section>

            </main>

            {/* Drawers (Wishlist drawer and Orders drawer) */}
            {isWishlistDrawerOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 overflow-hidden">
                        <div onClick={() => setIsWishlistDrawerOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <div className="pointer-events-auto w-screen max-w-md transform bg-[var(--bg-right-panel)] border-l border-[var(--card-border)] shadow-2xl transition-all duration-500 flex flex-col h-full">
                                <div className="px-6 py-5 border-b border-[var(--card-border)] bg-[var(--card-bg)] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-[var(--badge-bg)] text-rose-500 rounded-lg">
                                            <Heart className="h-4.5 w-4.5 fill-current" />
                                        </div>
                                        <h2 className="font-['Outfit'] text-lg font-black text-[var(--text-primary)]">My Wishlist</h2>
                                    </div>
                                    <button onClick={() => setIsWishlistDrawerOpen(false)} className="h-8 w-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 border border-transparent hover:border-[var(--card-border)] flex items-center justify-center text-[var(--text-muted)] transition-all">
                                        <X className="h-4.5 w-4.5" />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
                                    {wishlist.length === 0 ? (
                                        <div className="py-16 text-center border border-dashed border-[var(--card-border)] rounded-2xl flex flex-col items-center justify-center p-6 gap-3 bg-[var(--card-bg)]">
                                            <div className="h-10 w-10 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500">
                                                <Heart className="h-5.5 w-5.5 animate-pulse" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black text-[var(--text-primary)]">Your Wishlist is Empty</h4>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3.5">
                                            {products.filter(p => wishlist.includes(p.id)).map((o) => (
                                                <div key={o.id} className="bg-[var(--card-bg)] border border-[var(--card-border)] p-4 rounded-xl space-y-3 hover:border-[var(--gold-accent)]/30 transition-colors shadow-sm flex items-center gap-4">
                                                    <div className="h-16 w-16 bg-[var(--bg-right-panel)] rounded-lg overflow-hidden border border-[var(--card-border)] flex-shrink-0">
                                                        <img src={o.image} alt={o.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{o.brand}</div>
                                                        <h4 className="text-xs font-bold text-[var(--text-primary)] mt-0.5 truncate">{o.name}</h4>
                                                        <div className="text-xs font-black text-[var(--gold-accent)] mt-1">{formatCurrency(o.price)}</div>
                                                    </div>
                                                    <div className="flex flex-col gap-1.5">
                                                        <button
                                                            onClick={() => {
                                                                setIsWishlistDrawerOpen(false);
                                                                addToCart(o);
                                                            }}
                                                            className="px-2.5 py-1.5 bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            Buy
                                                        </button>
                                                        <button onClick={() => toggleWishlist(o.id)} className="p-1.5 border border-rose-500/25 hover:bg-rose-500/5 text-rose-500 rounded-lg transition-colors flex items-center justify-center cursor-pointer">
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isOrdersDrawerOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 overflow-hidden">
                        <div onClick={() => setIsOrdersDrawerOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <div className="pointer-events-auto w-screen max-w-md transform bg-[var(--bg-right-panel)] border-l border-[var(--card-border)] shadow-2xl transition-all duration-500 flex flex-col h-full">
                                <div className="px-6 py-5 border-b border-[var(--card-border)] bg-[var(--card-bg)] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-[var(--badge-bg)] text-[var(--gold-accent)] rounded-lg">
                                            <ShoppingBag className="h-4.5 w-4.5" />
                                        </div>
                                        <h2 className="font-['Outfit'] text-lg font-black text-[var(--text-primary)]">My Orders & History</h2>
                                    </div>
                                    <button onClick={() => setIsOrdersDrawerOpen(false)} className="h-8 w-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 border border-transparent hover:border-[var(--card-border)] flex items-center justify-center text-[var(--text-muted)] transition-all">
                                        <X className="h-4.5 w-4.5" />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black text-[var(--text-primary)] tracking-wide uppercase flex items-center gap-1.5"><Clock className="h-4 w-4 text-[var(--text-muted)]" /> Purchase Records</h3>
                                        {orders.length === 0 ? (
                                            <div className="py-16 text-center border border-dashed border-[var(--card-border)] rounded-2xl flex flex-col items-center justify-center p-6 gap-3 bg-[var(--card-bg)]">
                                                <h4 className="text-xs font-black text-[var(--text-primary)]">No Orders Placed</h4>
                                            </div>
                                        ) : (
                                            <div className="space-y-3.5">
                                                {orders.map((o) => {
                                                    let statusColor = 'bg-slate-500/10 text-slate-500'
                                                    if (o.OrderStatus === 'Delivered') statusColor = 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/15'
                                                    else if (o.OrderStatus === 'Pending') statusColor = 'bg-amber-500/10 text-amber-500 border border-amber-500/15'
                                                    else if (o.OrderStatus === 'Processing') statusColor = 'bg-blue-500/10 text-blue-500 border border-blue-500/15'
                                                    else if (o.OrderStatus === 'Shipped') statusColor = 'bg-violet-500/10 text-violet-500 border border-violet-500/15'
                                                    else if (o.OrderStatus === 'Cancelled') statusColor = 'bg-rose-500/10 text-rose-500 border border-rose-500/15'

                                                    const canCancel = o.OrderStatus === 'Pending' || o.OrderStatus === 'Processing'

                                                    return (
                                                        <div key={o.OrderID} className="bg-[var(--card-bg)] border border-[var(--card-border)] p-4 rounded-xl space-y-3 shadow-sm hover:border-[var(--gold-accent)]/30 transition-colors">
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div>
                                                                    <div className="text-[9px] font-mono font-bold text-[var(--text-muted)]">ID: {o.OrderID}</div>
                                                                    <h4 className="text-xs font-bold text-[var(--text-primary)] mt-0.5 line-clamp-1 leading-snug">{o.ProductName}</h4>
                                                                    <div className="text-[10px] text-[var(--text-secondary)] mt-1">Qty: {o.Quantity}</div>
                                                                </div>
                                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider shrink-0 ${statusColor}`}>{o.OrderStatus}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-[var(--card-border)]">
                                                                <span className="text-[10px] font-black text-[var(--text-primary)]">{formatCurrency(o.TotalAmount)}</span>
                                                                {canCancel && (
                                                                    <button onClick={() => handleCancelOrder(o.OrderID)} disabled={actionLoading} className="px-3 py-1.5 rounded-lg border border-rose-500/25 hover:border-transparent hover:bg-rose-500 text-rose-500 hover:text-white text-[9px] font-black uppercase tracking-wider transition-all disabled:opacity-50">Cancel</button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
