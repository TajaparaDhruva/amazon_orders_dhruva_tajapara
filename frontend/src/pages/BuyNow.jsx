import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    ShoppingBag, Heart, Search, ChevronDown, Star, LogOut, Moon, Sun, 
    RefreshCw, X, Clock, Trash2, ShieldCheck, Truck, Headphones, Plus, 
    Lock, Check, Edit2, CreditCard, Landmark, CheckCircle2, Sparkles
} from 'lucide-react'
import { ALL_PRODUCTS, RECOMMENDED_PRODUCTS, YOU_MAY_ALSO_LIKE } from '../data/dashboardData'

export default function BuyNow() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user, logout, api } = useAuth()

    const isCartMode = id === 'cart'

    const [product, setProduct] = useState(null)
    const [loadingProduct, setLoadingProduct] = useState(true)

    // Local Storage Cart Sync (read-write so we can clear after order)
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem(`vf_cart_${user?._id || 'temp'}`)
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        if (isCartMode) {
            // Cart mode: no product fetch needed
            setLoadingProduct(false)
            return
        }
        const fetchProductDetails = async () => {
            setLoadingProduct(true)
            try {
                const { data } = await api.get(`/products/${id}`)
                if (data.success && data.data) {
                    setProduct(data.data)
                } else {
                    throw new Error("No data")
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
        fetchProductDetails()
    }, [id, api, isCartMode])

    // UI States
    const [isDark, setIsDark] = useState(() => localStorage.getItem('vf_dark_mode') === 'true')
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    // Checkout Details
    const [address, setAddress] = useState({
        name: 'Dhruva Tajapara',
        phone: '+91 99989 99989',
        details: '21, Shastri Nagar Society, Rajkot, Gujarat - 360005'
    })
    const [isEditingAddress, setIsEditingAddress] = useState(false)
    const [tempAddress, setTempAddress] = useState({ ...address })

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState('UPI') // 'UPI' | 'Card' | 'NetBanking'
    const [upiId, setUpiId] = useState('name@upi')
    const [isUpiVerified, setIsUpiVerified] = useState(false)
    const [verifyingUpi, setVerifyingUpi] = useState(false)
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' })
    const [selectedBank, setSelectedBank] = useState('HDFC Bank')
    
    // Order Placing State
    const [placingOrder, setPlacingOrder] = useState(false)

    // Local Storage Wishlist Sync
    const [wishlist] = useState(() => {
        const saved = localStorage.getItem(`vf_wishlist_${user?._id || 'temp'}`)
        return saved ? JSON.parse(saved) : []
    })

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

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

    const handleVerifyUpi = () => {
        if (!upiId) return
        setVerifyingUpi(true)
        setTimeout(() => {
            setVerifyingUpi(false)
            setIsUpiVerified(true)
        }, 1000)
    }

    const handleAddressSave = (e) => {
        e.preventDefault()
        setAddress({ ...tempAddress })
        setIsEditingAddress(false)
    }

    const handlePlaceOrder = async () => {
        if (paymentMethod === 'UPI' && !isUpiVerified) {
            alert('Please verify your UPI ID first.')
            return
        }
        setPlacingOrder(true)
        try {
            if (isCartMode) {
                // Place one order per cart item
                for (const item of cartItems) {
                    const orderPayload = {
                        OrderID: 'ORD' + Math.floor(1000000 + Math.random() * 9000000),
                        CustomerID: user?._id || 'CUST_TEMP',
                        CustomerName: address.name,
                        ProductID: item.id,
                        ProductName: item.name,
                        Category: item.category || 'General',
                        Brand: item.brand || 'Generic',
                        Quantity: item.quantity,
                        UnitPrice: item.price,
                        TotalAmount: item.price * item.quantity,
                        PaymentMethod: paymentMethod,
                        OrderDate: new Date(),
                        OrderStatus: 'Pending',
                        City: 'Rajkot',
                        State: 'GJ',
                        Country: 'India',
                        SellerID: 'SELL' + Math.floor(10000 + Math.random() * 90000)
                    }
                    await api.post('/orders', orderPayload)
                }
                // Clear cart from localStorage
                localStorage.setItem(`vf_cart_${user?._id || 'temp'}`, JSON.stringify([]))
                setCartItems([])
            } else {
                // Single product order
                const orderPayload = {
                    OrderID: 'ORD' + Math.floor(1000000 + Math.random() * 9000000),
                    CustomerID: user?._id || 'CUST_TEMP',
                    CustomerName: address.name,
                    ProductID: product?.id,
                    ProductName: product?.name,
                    Category: product?.category || 'Electronics',
                    Brand: product?.brand || 'Generic',
                    Quantity: 1,
                    UnitPrice: product?.price || 0,
                    TotalAmount: (product?.price || 0) + 10,
                    PaymentMethod: paymentMethod,
                    OrderDate: new Date(),
                    OrderStatus: 'Pending',
                    City: 'Rajkot',
                    State: 'GJ',
                    Country: 'India',
                    SellerID: 'SELL' + Math.floor(10000 + Math.random() * 90000)
                }
                const { data } = await api.post('/orders', orderPayload)
                if (!data.success) throw new Error(data.message || 'Error occurred')
            }
            navigate('/dashboard/customer?openOrders=true')
        } catch (err) {
            console.error(err)
            alert('Failed to place order: ' + (err.response?.data?.message || err.message))
        } finally {
            setPlacingOrder(false)
        }
    }

    const handleSearchSubmit = () => {
        if (searchQuery) {
            navigate(`/dashboard/customer?search=${searchQuery}`)
        }
    }

    if (loadingProduct || (!isCartMode && !product) || (isCartMode && cartItems.length === 0)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-right-panel)] text-[var(--text-primary)]">
                <div className="text-center space-y-3">
                    <RefreshCw className="h-10 w-10 text-[var(--gold-accent)] animate-spin mx-auto" />
                    <p className="text-sm font-bold text-[var(--text-secondary)]">Loading checkout details...</p>
                </div>
            </div>
        )
    }

    const packagingCharges = isCartMode ? 0 : 10
    const cartSubtotal = isCartMode ? cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0
    const cartItemCount = isCartMode ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 1
    const totalAmount = isCartMode ? cartSubtotal + packagingCharges : (product?.price || 0) + packagingCharges

    return (
        <div className={`min-h-screen font-['Inter'] relative transition-colors duration-300 ${isDark ? 'theme-dark' : ''} bg-[var(--bg-right-panel)] text-[var(--text-primary)]`}>
            
            {/* Header / Navbar */}
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
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit() }}
                            className="w-full py-2.5 px-3 bg-transparent text-xs font-medium outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                        />
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
                        <button onClick={() => navigate('/wishlist')} className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--gold-accent)] font-semibold text-xs transition-colors shrink-0 relative cursor-pointer">
                            <Heart className={`h-4 w-4 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-[var(--text-muted)]'}`} />
                            <span className="hidden sm:inline">Wishlist</span>
                        </button>

                        {/* Cart */}
                        <button onClick={() => navigate('/cart')} className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--gold-accent)] font-semibold text-xs transition-colors relative shrink-0">
                            <ShoppingBag className="h-4 w-4 text-[var(--text-muted)]" />
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
                                <ChevronDown className="h-3 w-3 text-[var(--text-muted)]" />
                            </button>

                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2.5 w-48 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl py-2 z-50 animate-scale-up">
                                    <button onClick={() => navigate('/dashboard/customer?openOrders=true')} className="w-full text-left px-4 py-2 hover:bg-[var(--bg-right-panel)] text-xs font-semibold flex items-center gap-2 text-[var(--text-secondary)]">
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

            {/* Main Checkout Content */}
            <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6">
                
                {/* Breadcrumbs */}
                <div className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 opacity-80">
                    <span onClick={() => navigate('/dashboard/customer')} className="cursor-pointer hover:text-[var(--gold-accent)]">Home</span>
                    <span>&gt;</span>
                    <span className="text-[var(--text-primary)] font-bold">Buy Now</span>
                </div>

                <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-black text-[var(--text-primary)] tracking-tight text-left">Buy Now</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Checkout details (Address & Payment) */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* Section 1: Delivery Address */}
                        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2rem] p-6 lg:p-8 space-y-4 shadow-sm text-left">
                            <div className="flex items-center gap-3">
                                <span className="h-6 w-6 rounded-full bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] flex items-center justify-center font-bold text-xs">1</span>
                                <h2 className="font-['Outfit'] text-lg font-black text-[var(--text-primary)]">Delivery Address</h2>
                            </div>

                            {isEditingAddress ? (
                                <form onSubmit={handleAddressSave} className="space-y-4 pt-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase text-[var(--text-muted)] block">Recipient Name</label>
                                            <input 
                                                type="text" 
                                                required
                                                value={tempAddress.name} 
                                                onChange={(e) => setTempAddress({ ...tempAddress, name: e.target.value })}
                                                className="w-full bg-[var(--bg-right-panel)] border border-[var(--card-border)] rounded-xl py-2.5 px-3.5 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-[var(--gold-accent)]"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase text-[var(--text-muted)] block">Contact Number</label>
                                            <input 
                                                type="text" 
                                                required
                                                value={tempAddress.phone} 
                                                onChange={(e) => setTempAddress({ ...tempAddress, phone: e.target.value })}
                                                className="w-full bg-[var(--bg-right-panel)] border border-[var(--card-border)] rounded-xl py-2.5 px-3.5 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-[var(--gold-accent)]"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-[var(--text-muted)] block">Full Address Details</label>
                                        <textarea 
                                            required
                                            value={tempAddress.details} 
                                            onChange={(e) => setTempAddress({ ...tempAddress, details: e.target.value })}
                                            rows="2"
                                            className="w-full bg-[var(--bg-right-panel)] border border-[var(--card-border)] rounded-xl py-2.5 px-3.5 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-[var(--gold-accent)]"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-1">
                                        <button type="submit" className="bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors">Save Address</button>
                                        <button type="button" onClick={() => setIsEditingAddress(false)} className="border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 px-5 py-2 rounded-xl text-xs font-bold transition-colors">Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="border border-[var(--card-border)] rounded-2xl p-4 bg-[var(--bg-right-panel)]/50 relative flex items-start gap-4">
                                    <div className="pt-0.5">
                                        <input type="radio" checked readOnly className="accent-[var(--gold-accent)] h-4 w-4 cursor-pointer" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-[var(--text-primary)]">{address.name}</span>
                                            <span className="text-[9px] font-extrabold uppercase bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] px-1.5 py-0.5 rounded">Default</span>
                                        </div>
                                        <div className="text-xs text-[var(--text-secondary)] font-semibold mt-1.5">{address.phone}</div>
                                        <div className="text-xs text-[var(--text-muted)] font-medium mt-1 leading-relaxed">{address.details}</div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setTempAddress({ ...address })
                                            setIsEditingAddress(true)
                                        }}
                                        className="h-8 w-8 rounded-lg hover:bg-[var(--bg-right-panel)] border border-transparent hover:border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] transition-all shrink-0 cursor-pointer"
                                        title="Edit Address"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            {!isEditingAddress && (
                                <button 
                                    onClick={() => {
                                        setTempAddress({ name: '', phone: '', details: '' })
                                        setIsEditingAddress(true)
                                    }}
                                    className="flex items-center gap-1.5 border border-dashed border-[var(--card-border)] hover:border-[var(--gold-accent)] hover:bg-[var(--gold-bg-pill)] rounded-xl py-3 justify-center w-full text-xs font-bold text-[var(--gold-accent)] transition-all cursor-pointer"
                                >
                                    <Plus className="h-4 w-4" /> Add New Address
                                </button>
                            )}
                        </div>

                        {/* Section 2: Payment Method */}
                        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2rem] p-6 lg:p-8 space-y-6 shadow-sm text-left">
                            <div className="flex items-center gap-3">
                                <span className="h-6 w-6 rounded-full bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] flex items-center justify-center font-bold text-xs">2</span>
                                <h2 className="font-['Outfit'] text-lg font-black text-[var(--text-primary)]">Payment Method</h2>
                            </div>

                            <div className="space-y-4">
                                
                                {/* UPI Option */}
                                <div className={`border rounded-2xl p-4 transition-all ${paymentMethod === 'UPI' ? 'border-[var(--gold-accent)] bg-[var(--gold-bg-pill)]/20 shadow-sm' : 'border-[var(--card-border)]'}`}>
                                    <label className="flex items-center gap-3 cursor-pointer select-none">
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            checked={paymentMethod === 'UPI'} 
                                            onChange={() => setPaymentMethod('UPI')}
                                            className="accent-[var(--gold-accent)] h-4 w-4"
                                        />
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-extrabold uppercase bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded tracking-wide">UPI</span>
                                            <span className="text-xs font-bold text-[var(--text-primary)]">Pay using any UPI app</span>
                                        </div>
                                    </label>

                                    {paymentMethod === 'UPI' && (
                                        <div className="mt-4 pl-7 space-y-3 animate-scale-up">
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <div className="flex-1 max-w-sm relative">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Enter UPI ID"
                                                        value={upiId}
                                                        onChange={(e) => {
                                                            setUpiId(e.target.value)
                                                            setIsUpiVerified(false)
                                                        }}
                                                        disabled={isUpiVerified}
                                                        className="w-full bg-[var(--bg-right-panel)] border border-[var(--card-border)] rounded-xl py-2.5 px-3.5 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-[var(--gold-accent)]"
                                                    />
                                                    {isUpiVerified && (
                                                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-500 tracking-wider">
                                                            <CheckCircle2 className="h-4 w-4 fill-emerald-500 text-white" /> Verified
                                                        </span>
                                                    )}
                                                </div>
                                                <button 
                                                    onClick={handleVerifyUpi}
                                                    disabled={verifyingUpi || isUpiVerified || !upiId}
                                                    className="bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] disabled:bg-neutral-300 dark:disabled:bg-white/10 disabled:text-[var(--text-muted)] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
                                                >
                                                    {verifyingUpi ? 'Verifying...' : 'Verify UPI ID'}
                                                </button>
                                            </div>
                                            <p className="text-[10px] font-medium text-[var(--text-muted)]">You will be redirected to your UPI app to complete the payment.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Card Option */}
                                <div className={`border rounded-2xl p-4 transition-all ${paymentMethod === 'Card' ? 'border-[var(--gold-accent)] bg-[var(--gold-bg-pill)]/20 shadow-sm' : 'border-[var(--card-border)]'}`}>
                                    <label className="flex items-center gap-3 cursor-pointer select-none">
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            checked={paymentMethod === 'Card'} 
                                            onChange={() => setPaymentMethod('Card')}
                                            className="accent-[var(--gold-accent)] h-4 w-4"
                                        />
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-[var(--gold-accent)]" />
                                            <span className="text-xs font-bold text-[var(--text-primary)]">Card <span className="text-[10px] font-medium text-[var(--text-muted)]">(Visa, Mastercard, RuPay)</span></span>
                                        </div>
                                    </label>

                                    {paymentMethod === 'Card' && (
                                        <div className="mt-4 pl-7 space-y-3 max-w-md animate-scale-up">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase text-[var(--text-muted)] block">Card Number</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="XXXX XXXX XXXX XXXX"
                                                    value={cardDetails.number}
                                                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                                    className="w-full bg-[var(--bg-right-panel)] border border-[var(--card-border)] rounded-xl py-2.5 px-3.5 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-[var(--gold-accent)]"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black uppercase text-[var(--text-muted)] block">Expiry Date</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="MM/YY"
                                                        value={cardDetails.expiry}
                                                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                                        className="w-full bg-[var(--bg-right-panel)] border border-[var(--card-border)] rounded-xl py-2.5 px-3.5 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-[var(--gold-accent)]"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black uppercase text-[var(--text-muted)] block">CVV</label>
                                                    <input 
                                                        type="password" 
                                                        placeholder="***"
                                                        maxLength="3"
                                                        value={cardDetails.cvv}
                                                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                                        className="w-full bg-[var(--bg-right-panel)] border border-[var(--card-border)] rounded-xl py-2.5 px-3.5 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-[var(--gold-accent)]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Net Banking Option */}
                                <div className={`border rounded-2xl p-4 transition-all ${paymentMethod === 'NetBanking' ? 'border-[var(--gold-accent)] bg-[var(--gold-bg-pill)]/20 shadow-sm' : 'border-[var(--card-border)]'}`}>
                                    <label className="flex items-center gap-3 cursor-pointer select-none">
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            checked={paymentMethod === 'NetBanking'} 
                                            onChange={() => setPaymentMethod('NetBanking')}
                                            className="accent-[var(--gold-accent)] h-4 w-4"
                                        />
                                        <div className="flex items-center gap-2">
                                            <Landmark className="h-4 w-4 text-[var(--gold-accent)]" />
                                            <span className="text-xs font-bold text-[var(--text-primary)]">Net Banking <span className="text-[10px] font-medium text-[var(--text-muted)]">(All major banks supported)</span></span>
                                        </div>
                                    </label>

                                    {paymentMethod === 'NetBanking' && (
                                        <div className="mt-4 pl-7 max-w-sm animate-scale-up">
                                            <select
                                                value={selectedBank}
                                                onChange={(e) => setSelectedBank(e.target.value)}
                                                className="w-full bg-[var(--bg-right-panel)] border border-[var(--card-border)] rounded-xl py-2.5 px-3.5 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-[var(--gold-accent)] cursor-pointer"
                                            >
                                                <option value="HDFC Bank">HDFC Bank</option>
                                                <option value="ICICI Bank">ICICI Bank</option>
                                                <option value="SBI Bank">State Bank of India</option>
                                                <option value="Axis Bank">Axis Bank</option>
                                                <option value="KOTAK Bank">Kotak Mahindra Bank</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Right Column: Order Summary & Placement */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Summary Card */}
                        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2rem] p-6 lg:p-8 space-y-6 shadow-sm text-left">
                            <h3 className="font-['Outfit'] font-black text-lg text-[var(--text-primary)]">Order Summary</h3>

                            {/* Product(s) display */}
                            <div className="border-y border-[var(--card-border)]/50 py-4 space-y-4">
                                {isCartMode ? (
                                    cartItems.map((item, idx) => (
                                        <div key={item.id || idx} className="flex items-center gap-4">
                                            <div className="h-14 w-14 bg-[var(--bg-right-panel)] rounded-xl border border-[var(--card-border)]/50 overflow-hidden shrink-0 flex items-center justify-center">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-xs text-[var(--text-primary)] truncate">{item.name}</h4>
                                                <div className="text-[10px] text-[var(--text-muted)] font-bold mt-0.5">{item.brand || 'Brand'} • {item.category || 'General'}</div>
                                                <div className="text-[10px] text-[var(--gold-accent)] font-extrabold mt-0.5">Qty: {item.quantity}</div>
                                            </div>
                                            <div className="text-sm font-black text-[var(--text-primary)] shrink-0">{formatCurrency(item.price * item.quantity)}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 bg-[var(--bg-right-panel)] rounded-xl border border-[var(--card-border)]/50 overflow-hidden shrink-0 flex items-center justify-center">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-xs text-[var(--text-primary)] truncate">{product.name}</h4>
                                            <div className="text-[10px] text-[var(--text-muted)] font-bold mt-1">{product.brand || 'Brand'} • {product.category || 'General'}</div>
                                            <div className="text-[10px] text-[var(--gold-accent)] font-extrabold mt-0.5">Qty: 1</div>
                                        </div>
                                        <div className="text-sm font-black text-[var(--text-primary)] shrink-0">{formatCurrency(product.price)}</div>
                                    </div>
                                )}
                            </div>

                            {/* Pricing breakdown */}
                            <div className="space-y-3.5 text-xs font-semibold text-[var(--text-secondary)]">
                                <div className="flex justify-between">
                                    <span>Price ({cartItemCount} {cartItemCount === 1 ? 'item' : 'items'})</span>
                                    <span className="font-black text-[var(--text-primary)]">{formatCurrency(isCartMode ? cartSubtotal : product.price)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Charges</span>
                                    <span className="font-bold text-emerald-500">FREE</span>
                                </div>
                                {packagingCharges > 0 && (
                                    <div className="flex justify-between">
                                        <span>Packaging Charges</span>
                                        <span className="font-black text-[var(--text-primary)]">{formatCurrency(packagingCharges)}</span>
                                    </div>
                                )}
                                <div className="border-t border-[var(--card-border)]/50 pt-4 flex justify-between text-sm font-black text-[var(--text-primary)]">
                                    <span className="font-['Outfit'] font-black text-base">Total Amount</span>
                                    <span className="text-base text-[var(--gold-accent)]">{formatCurrency(totalAmount)}</span>
                                </div>
                            </div>

                            {/* Safe payment badge */}
                            <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                                <span className="text-[9.5px] text-emerald-600 font-bold leading-normal">Safe and secure payments. Easy returns.</span>
                            </div>

                            {/* Place order CTA */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={placingOrder}
                                className="w-full py-3.5 bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] disabled:bg-neutral-300 dark:disabled:bg-white/10 disabled:text-[var(--text-muted)] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl transition-all cursor-pointer shadow-md"
                            >
                                <Lock className="h-4 w-4" /> {placingOrder ? 'Placing Order...' : 'Place Order'}
                            </button>

                            <p className="text-[10px] text-center font-bold text-[var(--text-muted)] leading-normal">Your order will be delivered to the address above</p>
                        </div>

                    </div>

                </div>

                {/* Bottom Trust Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[var(--card-border)]/50">
                    <div className="flex items-center gap-3.5 justify-center md:justify-start">
                        <div className="h-10 w-10 rounded-full bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] flex items-center justify-center shrink-0">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div className="text-left leading-none">
                            <div className="text-xs font-black text-[var(--text-primary)]">100% Secure Payments</div>
                            <div className="text-[10px] font-semibold text-[var(--text-muted)] mt-1">Safe and secure transactions</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3.5 justify-center">
                        <div className="h-10 w-10 rounded-full bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] flex items-center justify-center shrink-0">
                            <RefreshCw className="h-5 w-5" />
                        </div>
                        <div className="text-left leading-none">
                            <div className="text-xs font-black text-[var(--text-primary)]">Easy Returns</div>
                            <div className="text-[10px] font-semibold text-[var(--text-muted)] mt-1">30-day return policy</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3.5 justify-center md:justify-end">
                        <div className="h-10 w-10 rounded-full bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] flex items-center justify-center shrink-0">
                            <Headphones className="h-5 w-5" />
                        </div>
                        <div className="text-left leading-none">
                            <div className="text-xs font-black text-[var(--text-primary)]">24/7 Customer Support</div>
                            <div className="text-[10px] font-semibold text-[var(--text-muted)] mt-1">We're here to help</div>
                        </div>
                    </div>
                </div>

            </main>

        </div>
    )
}
