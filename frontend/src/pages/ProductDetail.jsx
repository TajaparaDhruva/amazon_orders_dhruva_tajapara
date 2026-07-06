import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    ShoppingBag, Heart, Search, ChevronDown, ChevronLeft, ChevronRight,
    Star, Plus, LogOut, Moon, Sun, RefreshCw, X, Clock, Trash2, Sparkles, CheckCircle2, ShieldCheck, Truck, Headphones, CreditCard
} from 'lucide-react'
import { ALL_PRODUCTS, RECOMMENDED_PRODUCTS, YOU_MAY_ALSO_LIKE, CATEGORIES, SLIDES } from '../data/dashboardData'

export default function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user, logout, api } = useAuth()

    const [product, setProduct] = useState(null)
    const [products, setProducts] = useState([])
    const [loadingProduct, setLoadingProduct] = useState(true)

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoadingProduct(true)
            try {
                const { data } = await api.get(`/products/${id}`)
                if (data.success && data.data) {
                    setProduct(data.data)
                } else {
                    throw new Error("No data returned")
                }
            } catch (err) {
                console.error("Error fetching product from DB, falling back:", err)
                const fallbackProd = ALL_PRODUCTS.find(p => p.id === id) || 
                                     RECOMMENDED_PRODUCTS.find(p => p.id === id) || 
                                     YOU_MAY_ALSO_LIKE.find(p => p.id === id) ||
                                     ALL_PRODUCTS[0];
                setProduct(fallbackProd)
            } finally {
                setLoadingProduct(false)
            }
        }

        const fetchAllProducts = async () => {
            try {
                const { data } = await api.get('/products')
                if (data.success && data.data) {
                    setProducts(data.data)
                }
            } catch (err) {
                console.error("Error fetching all products:", err)
            }
        }

        fetchProductDetails()
        fetchAllProducts()
    }, [id, api])

    // UI States
    const [isDark, setIsDark] = useState(() => localStorage.getItem('vf_dark_mode') === 'true')
    const [selectedColor, setSelectedColor] = useState('Blue')
    const [selectedStorage, setSelectedStorage] = useState('128GB')
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
    const [isOrdersDrawerOpen, setIsOrdersDrawerOpen] = useState(false)
    const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false)
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
            setWishlist(wishlist.filter(item => item !== productId));
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

    const addToCart = (productToAdd, color, storage, basePrice) => {
        const existingItemIndex = cart.findIndex(item => item.id === productToAdd.id && item.color === color && item.storage === storage)
        if (existingItemIndex > -1) {
            const updated = [...cart]
            updated[existingItemIndex].quantity += 1
            setCart(updated)
        } else {
            setCart([...cart, {
                ...productToAdd,
                price: basePrice,
                color,
                storage,
                quantity: 1
            }])
        }
    }

    // Dynamic price calculation based on variant selection
    const getCalculatedPrice = () => {
        let price = product.price
        if (selectedStorage === '256GB') price += 10000
        else if (selectedStorage === '512GB') price += 20000
        return price
    }
    const currentPrice = getCalculatedPrice()

    const getCalculatedOriginalPrice = () => {
        if (!product.originalPrice) return null
        let orig = product.originalPrice
        if (selectedStorage === '256GB') orig += 10000
        else if (selectedStorage === '512GB') orig += 20000
        return orig
    }
    const currentOriginalPrice = getCalculatedOriginalPrice()

    // Fetch customer orders history (used for sidebar drawer component check)
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

    const triggerDirectPurchase = async (prod, color, storage, priceVal) => {
        setActionLoading(true)
        try {
            const brandName = prod.brand || 'Generic'
            const orderPayload = {
                OrderID: 'ORD' + Math.floor(1000000 + Math.random() * 9000000),
                CustomerID: user?._id || 'CUST_TEMP',
                CustomerName: user?.name || 'Dhruva Tajapara',
                ProductID: prod.id,
                ProductName: `${prod.name} (${color}, ${storage})`,
                Category: prod.category || 'Electronics',
                Brand: brandName,
                Quantity: 1,
                UnitPrice: priceVal,
                TotalAmount: priceVal,
                PaymentMethod: 'UPI',
                OrderDate: new Date(),
                OrderStatus: 'Pending',
                City: 'Mumbai',
                State: 'MH',
                Country: 'India',
                SellerID: 'SELL' + Math.floor(10000 + Math.random() * 90000)
            }

            const { data } = await api.post('/orders', orderPayload)
            if (data.success) {
                fetchCustomerOrders()
                setIsOrdersDrawerOpen(true)
            }
        } catch (err) {
            alert('Failed to place order: ' + (err.response?.data?.message || err.message))
        } finally {
            setActionLoading(false)
        }
    }

    // Color variant mappings
    const colors = [
        { name: 'Blue', hex: '#E2ECF6', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Pink', hex: '#FAE0E4', image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&q=80' },
        { name: 'Green', hex: '#E1EDDF', image: 'https://images.unsplash.com/photo-1574757547511-ad22b2811d08?w=400&q=80' },
        { name: 'Black', hex: '#343A40', image: 'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=400&q=80' }
    ]

    const activeColorImg = colors.find(c => c.name === selectedColor)?.image || product.image

    // Specification highlights (real items specs)
    const highlights = [
        { label: 'Display', value: product.id === 'p-iphone15' ? '15.49 cm (6.1 inch) Super Retina XDR Display' : 'Ultra HD Cinematic Display Premium' },
        { label: 'Rear Camera', value: product.id === 'p-iphone15' ? '48MP + 12MP Dual Rear Camera' : 'High definition sensor with HDR' },
        { label: 'Front Camera', value: product.id === 'p-iphone15' ? '12MP Front Camera' : 'HDR high resolution focus lens' },
        { label: 'Processor', value: product.id === 'p-iphone15' ? 'A16 Bionic Chip Superfast Performance' : 'Multi-core efficient graphics processing' },
        { label: 'Operating System', value: product.id === 'p-iphone15' ? 'iOS 17 Latest iOS Version' : 'Secured standard OS preinstalled' },
        { label: 'Battery Capacity', value: product.id === 'p-iphone15' ? '3349 mAh Battery Capacity' : 'All-day smart fast-charge battery' }
    ]

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

    const activeOrderCount = orders.filter(o => o.OrderStatus === 'Pending' || o.OrderStatus === 'Processing' || o.OrderStatus === 'Shipped').length
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
    const relatedProducts = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 6)

    if (loadingProduct || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-right-panel)] text-[var(--text-primary)]">
                <div className="text-center space-y-3">
                    <RefreshCw className="h-10 w-10 text-[var(--gold-accent)] animate-spin mx-auto" />
                    <p className="text-sm font-bold text-[var(--text-secondary)]">Loading product details from MongoDB...</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen font-['Inter'] relative transition-colors duration-300 ${isDark ? 'theme-dark' : ''} bg-[var(--bg-right-panel)] text-[var(--text-primary)]`}>
            
            {/* Header / Navbar */}
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

                    {/* Right Action Buttons */}
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
                            className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--gold-accent)] font-semibold text-xs transition-colors relative shrink-0"
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

                        {/* User Profile */}
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

            {/* Second Navbar Navigation links */}
            <div className="border-y border-[var(--card-border)]/60 bg-[var(--card-bg)] py-3">
                <div className="max-w-7xl mx-auto px-4 lg:px-6 flex items-center justify-between text-xs font-bold text-[var(--text-secondary)] overflow-x-auto no-scrollbar gap-6">
                    <div onClick={() => navigate('/dashboard/customer')} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white rounded-lg cursor-pointer transition-colors shadow-[0_2px_8px_-2px_rgba(160,90,44,0.3)] shrink-0">
                        <Plus className="h-3.5 w-3.5" /> All Categories
                    </div>
                    {['Today\'s Deals', 'Top Sellers', 'New Arrivals', ...[...new Set(products.map(p => p.category))]].map((link) => (
                        <span 
                            key={link} 
                            onClick={() => {
                                navigate('/dashboard/customer');
                            }}
                            className="hover:text-[var(--gold-accent)] transition-colors cursor-pointer shrink-0"
                        >
                            {link}
                        </span>
                    ))}
                </div>
            </div>

            {/* Main Section */}
            <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-8">
                
                {/* Breadcrumbs */}
                <div className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 opacity-80">
                    <span onClick={() => navigate('/dashboard/customer')} className="cursor-pointer hover:text-[var(--gold-accent)]">Home</span>
                    <span>&gt;</span>
                    <span onClick={() => navigate('/dashboard/customer')} className="cursor-pointer hover:text-[var(--gold-accent)]">{product.category}</span>
                    <span>&gt;</span>
                    <span className="text-[var(--text-muted)] font-bold">{product.subcategory || 'Mobiles'}</span>
                    <span>&gt;</span>
                    <span className="text-[var(--text-primary)] font-bold truncate max-w-xs">{product.name}</span>
                </div>

                {/* Product Detail Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Panel: Image presentation */}
                    <div className="lg:col-span-5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2rem] p-6 space-y-6 shadow-sm">
                        <div className="relative bg-[var(--bg-right-panel)] h-96 w-full rounded-2xl overflow-hidden flex items-center justify-center border border-[var(--card-border)]/50 shadow-inner">
                            <img src={activeColorImg} alt={product.name} className="w-full h-full object-cover transition-all duration-300" />
                            {product.discount && (
                                <span className="absolute top-4 left-4 bg-[#FFEAEB] text-[#D84242] text-xs font-black uppercase px-2.5 py-1 rounded-md shadow-sm">
                                    {product.discount}
                                </span>
                            )}
                        </div>

                        {/* Additional info badges */}
                        <div className="grid grid-cols-3 gap-3 pt-2">
                            <div className="bg-[var(--bg-right-panel)] border border-[var(--card-border)]/50 rounded-xl p-3 text-center space-y-1 hover:-translate-y-0.5 transition-transform duration-300">
                                <ShieldCheck className="h-5 w-5 text-[var(--gold-accent)] mx-auto" />
                                <span className="text-[9px] font-black uppercase block tracking-wider text-[var(--text-primary)]">100% Original</span>
                            </div>
                            <div className="bg-[var(--bg-right-panel)] border border-[var(--card-border)]/50 rounded-xl p-3 text-center space-y-1 hover:-translate-y-0.5 transition-transform duration-300">
                                <Truck className="h-5 w-5 text-[var(--gold-accent)] mx-auto" />
                                <span className="text-[9px] font-black uppercase block tracking-wider text-[var(--text-primary)]">Free Delivery</span>
                            </div>
                            <div className="bg-[var(--bg-right-panel)] border border-[var(--card-border)]/50 rounded-xl p-3 text-center space-y-1 hover:-translate-y-0.5 transition-transform duration-300">
                                <CheckCircle2 className="h-5 w-5 text-[var(--gold-accent)] mx-auto" />
                                <span className="text-[9px] font-black uppercase block tracking-wider text-[var(--text-primary)]">1 Year Warranty</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Specifications and configuration checkout */}
                    <div className="lg:col-span-7 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2rem] p-6 lg:p-8 space-y-6 shadow-sm">
                        
                        {/* Title and Ratings */}
                        <div className="space-y-3">
                            <span className="text-xs font-extrabold text-[var(--gold-accent)] tracking-wider uppercase">{product.brand}</span>
                            <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-black text-[var(--text-primary)] leading-tight tracking-tight">{product.name}</h1>
                            <div className="flex items-center gap-3 text-xs font-semibold text-[var(--text-muted)] flex-wrap">
                                <div className="flex items-center text-amber-500 gap-0.5">
                                    {[...Array(5)].map((_, s) => (
                                        <Star key={s} className={`h-4.5 w-4.5 ${s < Math.floor(product.rating) ? 'fill-current' : 'opacity-20'}`} />
                                    ))}
                                    <span className="text-[var(--text-primary)] font-black ml-1">{product.rating}</span>
                                </div>
                                <span className="opacity-45">|</span>
                                <span>{product.reviews.toLocaleString()} Customer Reviews</span>
                                <span className="opacity-45">|</span>
                                <span className="text-emerald-500 font-bold">2,345 Sold</span>
                            </div>
                        </div>

                        {/* Prices */}
                        <div className="py-4 border-y border-[var(--card-border)]/50 flex items-baseline gap-4">
                            <span className="text-2xl lg:text-3xl font-black text-[var(--text-primary)]">{formatCurrency(currentPrice)}</span>
                            {currentOriginalPrice && (
                                <>
                                    <span className="text-sm font-semibold text-[var(--text-muted)] line-through">{formatCurrency(currentOriginalPrice)}</span>
                                    <span className="text-xs font-black text-[#D84242] uppercase tracking-wider bg-[#FFEAEB] px-2 py-0.5 rounded">
                                        {product.discount || '18% OFF'}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Product Offers Block */}
                        <div className="space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] block">Available Offers</span>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="border border-[var(--card-border)] p-3 rounded-xl space-y-1 bg-[var(--bg-right-panel)]">
                                    <div className="flex items-center gap-1.5 text-[var(--gold-accent)] font-bold text-[10.5px]">
                                        <CreditCard className="h-3.5 w-3.5" /> Bank Offer
                                    </div>
                                    <p className="text-[9.5px] text-[var(--text-secondary)] leading-snug">Up to ₹5,000 instant discount on HDFC Bank Cards</p>
                                </div>
                                <div className="border border-[var(--card-border)] p-3 rounded-xl space-y-1 bg-[var(--bg-right-panel)]">
                                    <div className="flex items-center gap-1.5 text-[var(--gold-accent)] font-bold text-[10.5px]">
                                        <Clock className="h-3.5 w-3.5" /> No Cost EMI
                                    </div>
                                    <p className="text-[9.5px] text-[var(--text-secondary)] leading-snug">Up to 6 months No Cost EMI on select credit cards</p>
                                </div>
                                <div className="border border-[var(--card-border)] p-3 rounded-xl space-y-1 bg-[var(--bg-right-panel)]">
                                    <div className="flex items-center gap-1.5 text-[var(--gold-accent)] font-bold text-[10.5px]">
                                        <RefreshCw className="h-3.5 w-3.5" /> Exchange Offer
                                    </div>
                                    <p className="text-[9.5px] text-[var(--text-secondary)] leading-snug">Up to ₹15,000 off on exchange of your old smartphone</p>
                                </div>
                            </div>
                        </div>

                        {/* Interactive variant pickers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            {/* Color Selector */}
                            <div className="space-y-2.5">
                                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] block">Color: <span className="text-[var(--text-primary)] font-bold">{selectedColor}</span></span>
                                <div className="flex items-center gap-3">
                                    {colors.map((c) => (
                                        <button
                                            key={c.name}
                                            onClick={() => setSelectedColor(c.name)}
                                            className={`h-9 w-9 rounded-full border flex items-center justify-center transition-all ${selectedColor === c.name ? 'border-[var(--gold-accent)] ring-2 ring-[var(--gold-accent)]/20 scale-105' : 'border-[var(--card-border)] hover:scale-105'}`}
                                            style={{ backgroundColor: c.hex }}
                                            title={c.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Storage Selector */}
                            <div className="space-y-2.5">
                                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] block">Storage Variant</span>
                                <div className="flex items-center gap-3">
                                    {['128GB', '256GB', '512GB'].map((st) => (
                                        <button
                                            key={st}
                                            onClick={() => setSelectedStorage(st)}
                                            className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all ${selectedStorage === st ? 'border-[var(--gold-accent)] bg-[var(--gold-bg-pill)] text-[var(--gold-accent)] shadow-sm' : 'border-[var(--card-border)] hover:border-[var(--gold-accent)]/40 text-[var(--text-secondary)] bg-[var(--card-bg)]'}`}
                                        >
                                            {st}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Highlights lists */}
                        <div className="space-y-3 pt-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] block">Product Highlights</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-[var(--bg-right-panel)] border border-[var(--card-border)]/50 p-4 rounded-xl">
                                {highlights.map((h, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs">
                                        <span className="text-[var(--gold-accent)] mt-0.5 shrink-0">•</span>
                                        <div>
                                            <span className="font-extrabold text-[var(--text-primary)]">{h.label}:</span>{' '}
                                            <span className="text-[var(--text-secondary)] font-medium leading-relaxed">{h.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch gap-4 pt-4 border-t border-[var(--card-border)]/50">
                            <button
                                onClick={() => addToCart(product, selectedColor, selectedStorage, currentPrice)}
                                className="flex-1 py-3 rounded-xl bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                            >
                                <ShoppingBag className="h-4.5 w-4.5" /> Add to Cart
                            </button>
                            <button
                                onClick={() => triggerDirectPurchase(product, selectedColor, selectedStorage, currentPrice)}
                                className="flex-1 py-3 rounded-xl border border-[var(--gold-accent)] text-[var(--gold-accent)] hover:bg-[var(--gold-bg-pill)] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* You may also like */}
                {relatedProducts.length > 0 && (
                    <section className="space-y-4 pt-6">
                        <div className="flex items-center justify-between border-b pb-3 border-[var(--card-border)]/50">
                            <h2 className="font-['Outfit'] text-lg font-black text-[var(--text-primary)]">You May Also Like</h2>
                            <span onClick={() => navigate('/dashboard/customer')} className="text-xs font-bold text-[var(--gold-accent)] cursor-pointer hover:underline">View All</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
                            {relatedProducts.map((prod) => (
                                <div key={prod.id} className="bg-[var(--card-bg)] border border-[var(--card-border)] p-3 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                                    <div 
                                        onClick={() => {
                                            navigate(`/product/${prod.id}`);
                                            window.scrollTo(0, 0);
                                        }} 
                                        className="bg-[var(--bg-right-panel)] h-28 w-full rounded-xl overflow-hidden flex items-center justify-center border border-[var(--card-border)] shadow-inner cursor-pointer"
                                    >
                                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    </div>
                                    <div className="mt-3.5 space-y-2">
                                        <div>
                                            <span className="text-[8.5px] font-bold text-[var(--text-muted)] uppercase block">{prod.brand}</span>
                                            <h3 
                                                onClick={() => {
                                                    navigate(`/product/${prod.id}`);
                                                    window.scrollTo(0, 0);
                                                }}
                                                className="font-bold text-[11px] text-[var(--text-primary)] line-clamp-1 leading-snug mt-0.5 cursor-pointer hover:text-[var(--gold-accent)] transition-colors"
                                            >
                                                {prod.name}
                                            </h3>
                                        </div>
                                        <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-[var(--card-border)] opacity-95">
                                            <span className="text-xs font-black text-[var(--text-primary)]">{formatCurrency(prod.price)}</span>
                                            <button
                                                onClick={() => addToCart(prod, 'Default', 'Standard', prod.price)}
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
                )}

                {/* Bottom benefits ribbon footer style */}
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

            {/* Slide-over Drawers (Wishlist drawer and Orders history drawer) */}
            {isWishlistDrawerOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 overflow-hidden">
                        <div onClick={() => setIsWishlistDrawerOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in" />
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
                                                <p className="text-[10px] text-[var(--text-muted)] mt-1">Add items from product listings.</p>
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
                                                                triggerDirectPurchase(o, 'Default', 'Standard', o.price);
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
                        <div onClick={() => setIsOrdersDrawerOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in" />
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
                                                <div className="h-10 w-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500">
                                                    <ShoppingBag className="h-5.5 w-5.5" />
                                                </div>
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
