import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './../context/AuthContext'
import {
    ShoppingBag, Heart, Search, ChevronDown, Star, LogOut, Moon, Sun, 
    RefreshCw, X, Trash2, Clock, CheckCircle2, ShieldCheck, Truck, Headphones, Plus, Share2, Share, ArrowLeft
} from 'lucide-react'
import { ALL_PRODUCTS, RECOMMENDED_PRODUCTS, YOU_MAY_ALSO_LIKE, BRANDS, CATEGORIES } from './../data/dashboardData'

export default function Wishlist() {
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
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchCatDropdownOpen, setIsSearchCatDropdownOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)

    const handleSearchSubmit = () => {
        let path = '/dashboard/customer'
        const params = new URLSearchParams()
        if (searchQuery) params.append('search', searchQuery)
        if (selectedCategory && selectedCategory !== 'All Products') params.append('category', selectedCategory)
        const queryString = params.toString()
        if (queryString) path += `?${queryString}`
        navigate(path)
    }

    // Local Storage Wishlist Sync
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

    // Local Storage Cart Sync
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem(`vf_cart_${user?._id || 'temp'}`);
        return saved ? JSON.parse(saved) : [];
    })

    useEffect(() => {
        localStorage.setItem(`vf_cart_${user?._id || 'temp'}`, JSON.stringify(cart));
    }, [cart, user?._id])

    const addToCart = (productToAdd, color = 'Default', storage = 'Standard', basePrice) => {
        const existingItemIndex = cart.findIndex(item => item.id === productToAdd.id && item.color === color && item.storage === storage)
        if (existingItemIndex > -1) {
            const updated = [...cart]
            updated[existingItemIndex].quantity += 1
            setCart(updated)
        } else {
            setCart([...cart, {
                ...productToAdd,
                price: basePrice || productToAdd.price,
                color,
                storage,
                quantity: 1
            }])
        }
    }

    const moveAllToCart = () => {
        if (wishlistItems.length === 0) return
        const updatedCart = [...cart]
        wishlistItems.forEach(item => {
            const existingIndex = updatedCart.findIndex(cItem => cItem.id === item.id && cItem.color === 'Default' && cItem.storage === 'Standard')
            if (existingIndex > -1) {
                updatedCart[existingIndex].quantity += 1
            } else {
                updatedCart.push({
                    ...item,
                    color: 'Default',
                    storage: 'Standard',
                    quantity: 1
                })
            }
        })
        setCart(updatedCart)
        setWishlist([])
    }

    // Fetch wishlist items details
    const wishlistItems = products.filter(p => wishlist.includes(p.id))

    // Summary calculations
    const totalItems = wishlistItems.length
    const totalValue = wishlistItems.reduce((sum, item) => sum + (item.price || 0), 0)
    const totalOriginalValue = wishlistItems.reduce((sum, item) => sum + (item.originalPrice || item.price || 0), 0)
    const youSave = totalOriginalValue - totalValue

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val || 0)
    }

    // Fetch customer orders history (used for sidebar drawer component check)
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
                setOrders(data.data || [])
            }
        } catch (err) {
            console.error('Error fetching customer orders:', err)
        } finally {
            setLoading(false)
        }
    }, [api, user?._id])

    useEffect(() => {
        if (user?._id && api) {
            fetchCustomerOrders()
        }
    }, [user?._id, fetchCustomerOrders, api])

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

    const toggleTheme = () => {
        const next = !isDark
        setIsDark(next)
        localStorage.setItem('vf_dark_mode', String(next))
    }

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
        <div className={`min-h-screen font-['Inter'] relative transition-colors duration-300 ${isDark ? 'theme-dark' : ''} bg-[var(--bg-right-panel)] text-[var(--text-primary)] text-left`}>
            
            {/* Top Navbar */}
            <header className="bg-[var(--card-bg)] sticky top-0 z-40 transition-colors border-b border-[var(--card-border)]/50">
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
                    <div className="hidden md:flex flex-1 max-w-xl items-center border border-[var(--card-border)] rounded-xl bg-[var(--bg-right-panel)] relative">
                        <div className="pl-3.5 text-[var(--text-muted)]">
                            <Search className="h-4 w-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for products, brands and more..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearchSubmit();
                                }
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
                            {selectedCategory && selectedCategory !== 'All Products' ? selectedCategory : 'All Categories'} <ChevronDown className="h-3 w-3 opacity-70" />
                        </div>

                        {/* Search Category Dropdown */}
                        {isSearchCatDropdownOpen && (
                            <div className="absolute right-12 top-full mt-1.5 w-48 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-xl py-1.5 z-50 text-left max-h-60 overflow-y-auto no-scrollbar">
                                <button
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        setIsSearchCatDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-[var(--bg-right-panel)] text-xs font-semibold text-[var(--text-secondary)]"
                                >
                                    All Categories
                                </button>
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.name}
                                        onClick={() => {
                                            setSelectedCategory(cat.name);
                                            setIsSearchCatDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-[var(--bg-right-panel)] text-xs font-semibold text-[var(--text-secondary)]"
                                    >
                                        {cat.name}
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

                    {/* Right Icons */}
                    <div className="flex items-center gap-3 lg:gap-5">
                        
                        {/* Wishlist */}
                        <button 
                            onClick={() => navigate('/wishlist')}
                            className="flex items-center gap-1.5 text-[var(--gold-accent)] font-semibold text-xs transition-colors relative shrink-0"
                        >
                            <div className="relative">
                                <Heart className="h-4 w-4 text-[var(--gold-accent)] fill-[var(--gold-accent)]" />
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
                            className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--gold-accent)] font-semibold text-xs relative shrink-0"
                        >
                            <div className="relative">
                                <ShoppingBag className="h-4 w-4 text-[var(--text-muted)]" />
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
                                            navigate('/order-history')
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

            {/* Main Section */}
            <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-8">
                
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="h-9 w-9 rounded-xl border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer shrink-0"
                                title="Go Back"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </button>
                            <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-black text-[var(--text-primary)] tracking-tight">My Wishlist</h1>
                            <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
                        </div>
                        <p className="text-xs font-semibold text-[var(--text-muted)] mt-1.5">Your favourite items, saved for later</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--card-border)] rounded-xl text-xs font-bold hover:bg-[var(--bg-right-panel)] text-[var(--text-secondary)] transition-colors self-start sm:self-auto cursor-pointer">
                        <Share className="h-3.5 w-3.5 text-[var(--text-muted)]" /> Share Wishlist
                    </button>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="border border-dashed border-[var(--card-border)] rounded-3xl p-16 text-center max-w-xl mx-auto bg-[var(--card-bg)] space-y-4">
                        <div className="h-16 w-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                            <Heart className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="font-['Outfit'] text-base font-extrabold text-[var(--text-primary)]">Your Wishlist is Empty</h3>
                            <p className="text-xs text-[var(--text-muted)] mt-1.5">Add items you love to save them here for quick access later!</p>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard/customer')}
                            className="px-5 py-2.5 bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer inline-block"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Wishlist Items List */}
                        <div className="lg:col-span-8 space-y-4">
                            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2rem] p-6 space-y-6 shadow-sm">
                                {wishlistItems.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row items-center sm:justify-between gap-6 pb-6 border-b border-[var(--card-border)]/50 last:pb-0 last:border-b-0">
                                        
                                        {/* Heart Selector & Image & Details */}
                                        <div className="flex items-center gap-4 flex-1 w-full">
                                            <button 
                                                onClick={() => toggleWishlist(item.id)} 
                                                className="text-rose-500 hover:text-[var(--text-muted)] transition-colors p-1"
                                                title="Remove from Wishlist"
                                            >
                                                <Heart className="h-4.5 w-4.5 fill-current animate-pulse-once" />
                                            </button>

                                            <div 
                                                onClick={() => navigate(`/product/${item.id}`)}
                                                className="h-20 w-20 flex-shrink-0 bg-[var(--bg-right-panel)] border border-[var(--card-border)]/50 rounded-xl overflow-hidden flex items-center justify-center shadow-inner cursor-pointer"
                                            >
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>

                                            <div className="space-y-1.5 flex-1 min-w-0">
                                                <h3 
                                                    onClick={() => navigate(`/product/${item.id}`)}
                                                    className="font-extrabold text-xs text-[var(--text-primary)] hover:text-[var(--gold-accent)] transition-colors truncate max-w-xs sm:max-w-md cursor-pointer"
                                                >
                                                    {item.name}
                                                </h3>
                                                <div className="text-[10px] font-bold text-[var(--text-muted)]">
                                                    {item.category && item.brand ? `${item.brand}, ${item.category}` : item.category}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-emerald-500">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" /> In Stock
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pricing & Actions */}
                                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-[var(--card-border)]/50">
                                            
                                            {/* Prices */}
                                            <div className="text-left sm:text-right space-y-1 min-w-[90px]">
                                                <div className="text-sm font-black text-[var(--text-primary)]">{formatCurrency(item.price)}</div>
                                                {item.originalPrice && (
                                                    <div className="flex items-center gap-1.5 justify-start sm:justify-end">
                                                        <span className="text-[10px] font-semibold text-[var(--text-muted)] line-through">{formatCurrency(item.originalPrice)}</span>
                                                        <span className="text-[9px] font-black text-[#D84242] uppercase tracking-wider">{item.discount || '15% OFF'}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => toggleWishlist(item.id)}
                                                    className="p-2.5 border border-[var(--card-border)] rounded-xl hover:bg-rose-500/5 text-[var(--text-muted)] hover:text-rose-500 transition-all cursor-pointer"
                                                    title="Delete Item"
                                                >
                                                    <Trash2 className="h-4.5 w-4.5" />
                                                </button>
                                                
                                                <button 
                                                    onClick={() => addToCart(item, 'Default', 'Standard', item.price)}
                                                    className="px-3.5 py-2.5 bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                                                >
                                                    Add to Cart
                                                </button>

                                                <button 
                                                    onClick={() => {
                                                        addToCart(item, 'Default', 'Standard', item.price);
                                                        toggleWishlist(item.id);
                                                    }}
                                                    className="px-3.5 py-2.5 border border-[var(--gold-accent)] text-[var(--gold-accent)] hover:bg-[var(--gold-bg-pill)] text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                                                >
                                                    Move to Cart
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary panel */}
                        <div className="lg:col-span-4 space-y-6">
                            
                            {/* Summary Box */}
                            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2rem] p-6 space-y-6 shadow-sm">
                                <h2 className="font-['Outfit'] text-base font-extrabold text-[var(--text-primary)] pb-3 border-b border-[var(--card-border)]/50 text-left">Wishlist Summary</h2>
                                
                                <div className="flex justify-center py-2">
                                    <div className="h-16 w-16 rounded-full bg-[var(--bg-right-panel)] border border-[var(--card-border)] flex items-center justify-center text-rose-500 shadow-inner">
                                        <Heart className="h-7 w-7" />
                                    </div>
                                </div>

                                <div className="space-y-4 text-xs font-semibold text-[var(--text-secondary)]">
                                    <div className="flex items-center justify-between">
                                        <span>Total Items</span>
                                        <span className="font-bold text-[var(--text-primary)]">{totalItems}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Total Value</span>
                                        <span className="font-bold text-[var(--text-primary)]">{formatCurrency(totalValue)}</span>
                                    </div>
                                    {youSave > 0 && (
                                        <div className="flex items-center justify-between text-emerald-500">
                                            <span>You Save</span>
                                            <span className="font-black">{formatCurrency(youSave)}</span>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={moveAllToCart}
                                    className="w-full py-3 bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer block"
                                >
                                    Move All to Cart
                                </button>
                            </div>

                            {/* You May Also Like Sidebar */}
                            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2rem] p-6 space-y-5 shadow-sm">
                                <div className="flex items-center justify-between pb-2 border-b border-[var(--card-border)]/50">
                                    <h3 className="font-['Outfit'] text-sm font-extrabold text-[var(--text-primary)] text-left">You May Also Like</h3>
                                    <span onClick={() => navigate('/dashboard/customer')} className="text-[10px] font-black text-[var(--gold-accent)] cursor-pointer hover:underline uppercase tracking-wide">View All</span>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { id: 'p-4', name: 'boAt Airdopes 141', sub: 'Bluetooth Earbuds', price: 1299, original: 1499, rating: 4.3, reviews: 12365, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80' },
                                        { id: 'p-15', name: 'Spigen Tough Armor', sub: 'iPhone 15 Case', price: 1399, original: 1599, rating: 4.4, reviews: 2356, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80' },
                                        { id: 'p-12', name: 'Mi Power Bank 3i 20000mAh', sub: 'Mi Power Bank 3i', price: 1499, original: 1999, rating: 4.6, reviews: 16254, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=687&auto=format&fit=crop' }
                                    ].map((rec) => (
                                        <div key={rec.id} className="flex gap-3.5 items-center group cursor-pointer text-left" onClick={() => navigate(`/product/${rec.id}`)}>
                                            <div className="h-14 w-14 rounded-lg bg-[var(--bg-right-panel)] border border-[var(--card-border)]/50 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                                                <img src={rec.image} alt={rec.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-0.5">
                                                <h4 className="font-extrabold text-[11px] text-[var(--text-primary)] group-hover:text-[var(--gold-accent)] transition-colors truncate">{rec.name}</h4>
                                                <p className="text-[9px] font-bold text-[var(--text-muted)]">{rec.sub}</p>
                                                <div className="flex items-center gap-1.5 text-[9.5px]">
                                                    <span className="text-amber-500 font-extrabold flex items-center gap-0.5">★ {rec.rating}</span>
                                                    <span className="text-[var(--text-muted)] font-medium">({rec.reviews.toLocaleString()})</span>
                                                </div>
                                                <div className="flex items-baseline gap-1.5 pt-0.5">
                                                    <span className="text-[11px] font-black text-[var(--text-primary)]">{formatCurrency(rec.price)}</span>
                                                    <span className="text-[9px] font-bold text-[var(--text-muted)] line-through">{formatCurrency(rec.original)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Trust elements */}
                            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2rem] p-5 space-y-4 shadow-sm text-xs font-bold text-[var(--text-secondary)] text-left">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-[var(--text-primary)] font-extrabold">100% Secure Payments</h4>
                                        <p className="text-[10px] font-medium text-[var(--text-muted)] mt-0.5">Safe and secure transactions</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                                        <RefreshCw className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-[var(--text-primary)] font-extrabold">Easy Returns</h4>
                                        <p className="text-[10px] font-medium text-[var(--text-muted)] mt-0.5">30-day return policy</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                                        <Headphones className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-[var(--text-primary)] font-extrabold">24/7 Customer Support</h4>
                                        <p className="text-[10px] font-medium text-[var(--text-muted)] mt-0.5">We're here to help</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                )}

            </main>

            {/* SLIDE-OVER DRAWER FOR MY ORDERS */}
            {isOrdersDrawerOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 overflow-hidden">
                        <div onClick={() => setIsOrdersDrawerOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <div className="pointer-events-auto w-screen max-w-md bg-[var(--bg-right-panel)] border-l border-[var(--card-border)] shadow-2xl flex flex-col h-full">
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
                                    {orders.length === 0 ? (
                                        <div className="py-16 text-center border border-dashed border-[var(--card-border)] rounded-2xl p-6 bg-[var(--card-bg)]">
                                            <h4 className="text-xs font-black text-[var(--text-primary)]">No Orders Placed Yet</h4>
                                        </div>
                                    ) : (
                                        orders.map((o) => (
                                            <div key={o._id || o.OrderID} className="border border-[var(--card-border)] rounded-2xl p-4 bg-[var(--card-bg)] space-y-3.5 shadow-sm">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-[10px] font-black text-[var(--gold-accent)] tracking-wider">{o.OrderID}</span>
                                                    <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded ${o.OrderStatus === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' : o.OrderStatus === 'Cancelled' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>{o.OrderStatus}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-xs font-extrabold text-[var(--text-primary)] leading-tight">{o.ProductName}</h4>
                                                    <div className="flex justify-between text-[10px] font-bold text-[var(--text-muted)] pt-1">
                                                        <span>Qty: {o.Quantity}</span>
                                                        <span>{formatCurrency(o.TotalAmount)}</span>
                                                    </div>
                                                </div>
                                                {o.OrderStatus === 'Pending' && (
                                                    <button onClick={() => handleCancelOrder(o._id)} className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black uppercase rounded-lg transition-colors cursor-pointer">Cancel Order</button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
