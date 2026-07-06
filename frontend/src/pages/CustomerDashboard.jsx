import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    ShoppingBag, DollarSign, Calendar, Tag, ShieldCheck,
    Plus, LogOut, Moon, Sun, RefreshCw, X, CheckCircle2,
    Clock, Trash2, ArrowRight, Star, Heart, Search, ChevronDown,
    ChevronLeft, ChevronRight, Truck, CreditCard, Headphones, Sparkles, Menu,
    Smartphone, Shirt, Home, Trophy, Car, Gamepad2, BookOpen
} from 'lucide-react'
import { CATEGORIES, SUBCATEGORIES, ALL_PRODUCTS, RECOMMENDED_PRODUCTS, YOU_MAY_ALSO_LIKE, BRANDS, SLIDES } from '../data/dashboardData'

const getCategoryIcon = (categoryName) => {
    const name = (categoryName || '').toLowerCase();
    if (name.includes('elect')) return Smartphone;
    if (name.includes('fash') || name.includes('cloth')) return Shirt;
    if (name.includes('home') || name.includes('kitchen') || name.includes('living')) return Home;
    if (name.includes('beauty') || name.includes('care')) return Sparkles;
    if (name.includes('sport') || name.includes('outdoor')) return Trophy;
    if (name.includes('auto') || name.includes('car')) return Car;
    if (name.includes('toy') || name.includes('game')) return Gamepad2;
    if (name.includes('book')) return BookOpen;
    return Tag;
};

function AllCategoriesView({ categories, setSearchParams }) {
    const [sortBy, setSortBy] = useState('popular')

    // Sort categories list if sorted
    const sortedCategories = [...categories].sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return b.count - a.count; // Default to popular
    })

    return (
        <div className="space-y-6 animate-fade-in text-left">
            {/* Breadcrumb & Header */}
            <div className="space-y-2">
                <div className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 opacity-80">
                    <span className="cursor-pointer hover:text-[var(--gold-accent)] transition-colors" onClick={() => setSearchParams({})}>Home</span>
                    <span>&gt;</span>
                    <span className="text-[var(--text-primary)] font-bold">Categories</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-black text-[var(--text-primary)] tracking-tight">
                            All Categories
                        </h1>
                        <p className="text-xs font-semibold text-[var(--text-muted)] mt-1">
                            Browse through all our product categories
                        </p>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-xs font-bold text-[var(--text-secondary)] whitespace-nowrap">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl py-2 px-3.5 text-xs font-semibold outline-none cursor-pointer focus:border-[var(--gold-accent)] text-[var(--text-primary)]"
                        >
                            <option value="popular">Popularity</option>
                            <option value="name">Name</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Layout Grid: Sidebar + Categories Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Sidebar (Col 3) */}
                <div className="lg:col-span-3 space-y-6">
                    
                    {/* Shop by Category Panel */}
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 shadow-sm space-y-4">
                        <div className="font-['Outfit'] font-black text-sm text-[var(--text-primary)] border-b pb-3 border-[var(--card-border)]/50 tracking-tight">
                            Shop by Category
                        </div>
                        <div className="space-y-1">
                            {categories.map((cat) => {
                                const CategoryIcon = getCategoryIcon(cat.name);
                                return (
                                    <div
                                        key={cat.name}
                                        onClick={() => setSearchParams({ category: cat.name })}
                                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--gold-accent)]/5 hover:text-[var(--gold-accent)] transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <CategoryIcon className="h-4 w-4 text-[var(--gold-accent)]/80" />
                                            <span>{cat.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-black opacity-60">{cat.count}</span>
                                            <ChevronRight className="h-3 w-3 opacity-40" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Why Shop by Category Panel */}
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 shadow-sm space-y-4">
                        <div className="font-['Outfit'] font-black text-sm text-[var(--text-primary)] border-b pb-3 border-[var(--card-border)]/50 tracking-tight">
                            Why Shop by Category?
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] rounded-lg shrink-0">
                                    <Search className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-[var(--text-primary)]">Easy to Find</h4>
                                    <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-0.5">Find products faster</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] rounded-lg shrink-0">
                                    <Plus className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-[var(--text-primary)]">Wide Selection</h4>
                                    <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-0.5">Explore a wide range of products</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] rounded-lg shrink-0">
                                    <Tag className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-[var(--text-primary)]">Best Deals</h4>
                                    <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-0.5">Discover category-specific offers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Categories Grid (Col 9) */}
                <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sortedCategories.map((cat) => {
                        const CategoryIcon = getCategoryIcon(cat.name);
                        return (
                            <div
                                key={cat.name}
                                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[1.75rem] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
                            >
                                {/* Top Image */}
                                <div className="h-32 w-full overflow-hidden bg-[var(--bg-right-panel)] relative">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/10" />
                                </div>

                                {/* Central Floating Badge */}
                                <div className="-mt-6 flex justify-center z-10">
                                    <div className="h-12 w-12 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] shadow-md flex items-center justify-center text-[var(--gold-accent)] transition-transform duration-300 group-hover:scale-110">
                                        <CategoryIcon className="h-5 w-5" />
                                    </div>
                                </div>

                                {/* Detail Content */}
                                <div className="p-5 text-center flex-1 flex flex-col justify-between">
                                    <div className="space-y-1">
                                        <h3 className="font-['Outfit'] font-black text-sm text-[var(--text-primary)] tracking-tight">
                                            {cat.name}
                                        </h3>
                                        <p className="text-[11px] font-semibold text-[var(--text-muted)]">
                                            {cat.count} Products
                                        </p>
                                    </div>

                                    {/* Action button */}
                                    <button
                                        onClick={() => setSearchParams({ category: cat.name })}
                                        className="w-full mt-4 py-2 border border-[var(--gold-accent)] hover:bg-[var(--gold-bg-pill)] text-[var(--gold-accent)] text-[10.5px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                                    >
                                        Explore Category
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Promo Ribbon Banner */}
            <div className="bg-[#FFF9F6] border border-[#FFEDE5] p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm text-left">
                <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="h-12 w-12 rounded-xl bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] flex items-center justify-center shrink-0">
                        <Tag className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-[var(--text-primary)]">Discover amazing products in every category</h3>
                        <p className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5">Shop more, save more with the best deals and offers</p>
                    </div>
                </div>
                <button 
                    onClick={() => setSearchParams({})}
                    className="bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white px-6 py-2.5 rounded-xl text-xs font-black transition-colors shrink-0 shadow-sm shadow-[var(--gold-accent)]/10"
                >
                    Shop Now
                </button>
            </div>
        </div>
    )
}

function CategoryItem({ cat, onClick }) {
    const [isFailed, setIsFailed] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div 
            onClick={onClick} 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex-shrink-0 w-[150px] flex flex-col items-center text-center group cursor-pointer"
        >
            {/* Circular image frame with premium animated gold/accent ring */}
            <div className="h-28 w-28 rounded-full p-1 bg-transparent flex items-center justify-center transition-all duration-500 shadow-sm relative overflow-hidden">
                
                {/* SVG circular drawing border overlay */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-10" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="47"
                        fill="none"
                        stroke="var(--gold-accent)"
                        strokeWidth="2.5"
                        strokeDasharray="295.3"
                        style={{
                            strokeDashoffset: isHovered ? 0 : 295.3,
                            transition: 'stroke-dashoffset 0.7s ease-in-out'
                        }}
                        strokeLinecap="round"
                    />
                </svg>

                <div className="w-full h-full rounded-full overflow-hidden bg-[var(--bg-right-panel)] flex items-center justify-center relative border border-[var(--card-border)] shadow-inner">
                    {!isFailed ? (
                        <img
                            src={cat.image}
                            alt={cat.name}
                            onError={() => setIsFailed(true)}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-[var(--gold-bg-pill)] text-[var(--gold-accent)] flex items-center justify-center font-black text-[10px] uppercase p-2">
                            {cat.name}
                        </div>
                    )}
                    
                    {/* Micro overlay ring on hover */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            </div>
            
            {/* Details Section */}
            <div className="mt-3.5 space-y-1 z-10">
                <h3 className="font-['Outfit'] font-extrabold text-xs text-[var(--text-primary)] tracking-tight group-hover:text-[var(--gold-accent)] transition-colors duration-300">
                    {cat.name}
                </h3>
                
                {/* Clean inline text for products count */}
                <span className="text-[10px] font-bold text-[var(--text-muted)] group-hover:text-[var(--gold-accent)]/80 transition-colors duration-300">
                    {cat.count} Products
                </span>
            </div>
        </div>
    )
}

export default function CustomerDashboard() {
    const { user, logout, api } = useAuth()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const categoryParam = searchParams.get('category')

    // UI State
    const [isDark, setIsDark] = useState(false)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [orders, setOrders] = useState([])
    const [products, setProducts] = useState(ALL_PRODUCTS)
    const [recommendedProducts, setRecommendedProducts] = useState(RECOMMENDED_PRODUCTS)
    const [youMayAlsoLike, setYouMayAlsoLike] = useState(YOU_MAY_ALSO_LIKE)
    const [categories, setCategories] = useState(CATEGORIES)

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

        const fetchDBRecommendations = async () => {
            if (!user?.name) return
            try {
                const { data } = await api.get(`/recommendations/products/${encodeURIComponent(user.name)}`)
                if (data.success && data.data && data.data.recommendations) {
                    setRecommendedProducts(data.data.recommendations)
                }
            } catch (err) {
                console.error('Error fetching database recommendations:', err)
            }
        }

        const fetchDBTrending = async () => {
            try {
                const { data } = await api.get('/trending/products')
                if (data.success && data.data) {
                    setYouMayAlsoLike(data.data)
                }
            } catch (err) {
                console.error('Error fetching database trending products:', err)
            }
        }

        fetchDBProducts()
        fetchDBRecommendations()
        fetchDBTrending()
    }, [api, user?.name])

    useEffect(() => {
        if (products.length > 0) {
            const uniqueCatNames = [...new Set(products.map(p => p.category))];
            const dynamicCategories = uniqueCatNames.map(name => {
                const count = products.filter(p => p.category === name).length;
                let image = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80';
                const lowerName = name.toLowerCase();
                if (lowerName.includes('elect')) {
                    image = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80';
                } else if (lowerName.includes('fash') || lowerName.includes('cloth')) {
                    image = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80';
                } else if (lowerName.includes('home') || lowerName.includes('kitchen') || lowerName.includes('living')) {
                    image = 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300&q=80';
                } else if (lowerName.includes('beauty') || lowerName.includes('care')) {
                    image = 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&q=80';
                } else if (lowerName.includes('sport') || lowerName.includes('outdoors')) {
                    image = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&q=80';
                } else if (lowerName.includes('auto')) {
                    image = 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=300&q=80';
                } else if (lowerName.includes('book')) {
                    image = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80';
                } else if (lowerName.includes('toy') || lowerName.includes('game')) {
                    image = 'https://images.unsplash.com/photo-1539627831859-a911cf04b3cd?w=400&q=80';
                }
                return { name, count, image };
            });
            setCategories(dynamicCategories);
        }
    }, [products])
    const [isOrdersDrawerOpen, setIsOrdersDrawerOpen] = useState(false)
    const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false)
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

    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem(`vf_cart_${user?._id || 'temp'}`);
        return saved ? JSON.parse(saved) : [];
    })

    useEffect(() => {
        localStorage.setItem(`vf_cart_${user?._id || 'temp'}`, JSON.stringify(cart));
    }, [cart, user?._id])

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    const addToCart = (productToAdd) => {
        const existingIndex = cart.findIndex(item => item.id === productToAdd.id)
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
    }
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
    const searchParam = searchParams.get('search')
    const [searchQuery, setSearchQuery] = useState(searchParam || '')
    const [isSearchCatDropdownOpen, setIsSearchCatDropdownOpen] = useState(false)
    const [activeHeroDot, setActiveHeroDot] = useState(0)

    useEffect(() => {
        setSearchQuery(searchParam || '')
    }, [searchParam])

    // Filter & Sort States
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedRecommendedCategory, setSelectedRecommendedCategory] = useState(null)
    const [selectedSubcategory, setSelectedSubcategory] = useState(null)
    const [selectedBrands, setSelectedBrands] = useState([])
    const [brandSearchQuery, setBrandSearchQuery] = useState('')
    const [maxPrice, setMaxPrice] = useState(150000)
    const [selectedRating, setSelectedRating] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [sortBy, setSortBy] = useState('popularity')

    const handleSearchSubmit = () => {
        const params = {}
        if (searchQuery) params.search = searchQuery
        if (selectedCategory && selectedCategory !== 'All Products') params.category = selectedCategory
        setSearchParams(params)
    }

    useEffect(() => {
        if (categoryParam) {
            setSelectedCategory(categoryParam === 'All' ? 'All Products' : categoryParam)
        } else {
            setSelectedCategory(null)
        }
        setSelectedRecommendedCategory(null)
    }, [categoryParam])

    // Reset filters on category change
    useEffect(() => {
        setSelectedSubcategory(null)
        setSelectedBrands([])
        setBrandSearchQuery('')
        setMaxPrice(150000)
        setSelectedRating(null)
        setCurrentPage(1)
    }, [selectedCategory])

    const clearAllFilters = () => {
        setSelectedSubcategory(null)
        setSelectedBrands([])
        setBrandSearchQuery('')
        setMaxPrice(150000)
        setSelectedRating(null)
        setCurrentPage(1)
    }

    // Get active brands for selected category
    const activeProductsForCategory = (selectedCategory === 'All Products' || selectedCategory === 'Recommended' || !selectedCategory)
        ? products
        : products.filter(p => p.category === selectedCategory)
    const availableBrands = [...new Set(activeProductsForCategory.map(p => p.brand))]
    const availableSubcategories = [...new Set(activeProductsForCategory.map(p => p.subcategory || 'Standard'))]

    // Filtered products list
    const filteredProducts = activeProductsForCategory
        .filter(p => {
            if (selectedSubcategory && p.subcategory !== selectedSubcategory) return false
            if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false
            if (p.price > maxPrice) return false
            if (selectedRating && p.rating < selectedRating) return false
            if (searchParam) {
                const query = searchParam.toLowerCase().trim();
                const matchesSearch = 
                    (p.name && p.name.toLowerCase().includes(query)) || 
                    (p.brand && p.brand.toLowerCase().includes(query)) ||
                    (p.category && p.category.toLowerCase().includes(query)) ||
                    (p.subcategory && p.subcategory.toLowerCase().includes(query)) ||
                    (p.id && p.id.toLowerCase().includes(query));
                if (!matchesSearch) return false;
            }
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price
            if (sortBy === 'price-high') return b.price - a.price
            if (sortBy === 'rating') return b.rating - a.rating
            return b.reviews - a.reviews
        })

    const itemsPerPage = 12
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

    // Stats calculated from customer's orders
    const [customerStats, setCustomerStats] = useState({
        totalSpent: 0,
        orderCount: 0,
        avgSpent: 0
    })

    // Checkout modal state
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

    const profileMenuRef = useRef(null)
    const categoriesRef = useRef(null)
    const brandsRef = useRef(null)
    const recommendedRef = useRef(null)

    const scroll = (ref, direction) => {
        if (ref.current) {
            const offset = direction === 'left' ? -320 : 320
            ref.current.scrollBy({ left: offset, behavior: 'smooth' })
        }
    }

    // Auto-scroll hero slides loop
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveHeroDot(prev => (prev === SLIDES.length - 1 ? 0 : prev + 1))
        }, 4000)
        return () => clearInterval(timer)
    }, [])

    // Toggle Dark Theme
    const toggleTheme = () => {
        const next = !isDark
        setIsDark(next)
        localStorage.setItem('vf_dark_mode', String(next))
    }

    // Fetch orders from database
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
                const customerOrders = data.data || []
                setOrders(customerOrders)

                // Calculate metrics
                const activeOrders = customerOrders.filter(order => order.OrderStatus !== 'Cancelled')
                const count = activeOrders.length
                const total = activeOrders.reduce((sum, order) => sum + (order.TotalAmount || 0), 0)
                const avg = count > 0 ? total / count : 0

                setCustomerStats({
                    totalSpent: total,
                    orderCount: customerOrders.length,
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

    // Close profile dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Cancel an order
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

    // Trigger direct background purchase without showing the checkout modal
    const triggerCheckout = async (product) => {
        setActionLoading(true)
        try {
            const brandName = product.brand || product.name.split(' ')[0] || 'Generic'
            let categoryName = product.category || 'Other'
            
            const orderPayload = {
                OrderID: 'ORD' + Math.floor(1000000 + Math.random() * 9000000),
                CustomerID: user?._id || 'CUST_TEMP',
                CustomerName: user?.name || 'Dhruva Tajapara',
                ProductID: product.id || 'P' + Math.floor(10000 + Math.random() * 90000),
                ProductName: product.name,
                Category: categoryName,
                Brand: brandName,
                Quantity: 1,
                UnitPrice: product.price,
                TotalAmount: product.price,
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
                setIsOrdersDrawerOpen(true) // Open orders drawer automatically to show success
            }
        } catch (err) {
            alert('Failed to place order: ' + (err.response?.data?.message || err.message))
        } finally {
            setActionLoading(false)
        }
    }

    // Submit purchase simulation
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
                Brand: buyForm.Brand || 'Storefront Brand',
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
                fetchCustomerOrders()
                setIsOrdersDrawerOpen(true) // Open orders drawer automatically to show success
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

    // Get number of pending or active orders for cart bubble
    const activeOrderCount = orders.filter(o => o.OrderStatus === 'Pending' || o.OrderStatus === 'Processing' || o.OrderStatus === 'Shipped').length

    return (
        <div className={`min-h-screen font-['Inter'] relative transition-colors duration-300 ${isDark ? 'theme-dark' : ''} bg-[var(--bg-right-panel)] text-[var(--text-primary)]`}>

            {/* Header / Navbar (Clean, borderless transition to category nav) */}
            <header className="bg-[var(--card-bg)] sticky top-0 z-40 transition-colors">
                <div className="max-w-7xl mx-auto px-4 lg:px-6 h-20 flex items-center justify-between gap-4">

                    {/* Logo Section */}
                    <div className="flex items-center gap-2 lg:gap-3 shrink-0">
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

                    {/* Middle Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-xl items-center border border-[var(--card-border)] rounded-xl bg-[var(--bg-right-panel)] relative">
                        <div className="pl-3.5 text-[var(--text-muted)]">
                            <Search className="h-4.5 w-4.5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for products, brands and more..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearchSubmit();
                                }
                            }}
                            className="w-full py-2.5 px-3 bg-transparent text-xs font-medium outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => {
                                    setSearchQuery('');
                                    const params = {};
                                    if (selectedCategory && selectedCategory !== 'All Products') params.category = selectedCategory;
                                    setSearchParams(params);
                                }}
                                className="p-1 mr-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer text-xs font-bold shrink-0"
                            >
                                ✕
                            </button>
                        )}
                        <div 
                            onClick={() => setIsSearchCatDropdownOpen(!isSearchCatDropdownOpen)}
                            className="flex items-center gap-1 px-3 py-1.5 border-l border-[var(--card-border)] text-[var(--text-secondary)] text-xs font-bold shrink-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors h-full select-none"
                        >
                            {selectedCategory && selectedCategory !== 'All Products' ? selectedCategory : 'All Categories'} <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                        </div>

                        {/* Search Category Dropdown */}
                        {isSearchCatDropdownOpen && (
                            <div className="absolute right-12 top-full mt-1.5 w-48 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-xl py-1.5 z-50 text-left max-h-60 overflow-y-auto no-scrollbar">
                                <button
                                    onClick={() => {
                                        const params = {};
                                        if (searchQuery) params.search = searchQuery;
                                        setSearchParams(params);
                                        setIsSearchCatDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-[var(--bg-right-panel)] text-xs font-semibold text-[var(--text-secondary)]"
                                >
                                    All Categories
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.name}
                                        onClick={() => {
                                            const params = { category: cat.name };
                                            if (searchQuery) params.search = searchQuery;
                                            setSearchParams(params);
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

                    {/* Right Action Icons & User Info */}
                    <div className="flex items-center gap-3 lg:gap-5">

                        {/* Wishlist */}
                        <button 
                            onClick={() => setIsWishlistDrawerOpen(true)}
                            className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--gold-accent)] font-semibold text-xs transition-colors shrink-0 relative cursor-pointer"
                        >
                            <div className="relative">
                                <Heart className={`h-4.5 w-4.5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-[var(--text-muted)]'}`} />
                                {wishlist.length > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-[var(--card-bg)]">
                                        {wishlist.length}
                                    </span>
                                )}
                            </div>
                            <span className="hidden sm:inline">Wishlist</span>
                        </button>

                        {/* Cart (with cartCount badge) */}
                        <button
                            onClick={() => navigate('/cart')}
                            className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--gold-accent)] font-semibold text-xs transition-colors relative shrink-0"
                        >
                            <div className="relative">
                                <ShoppingBag className="h-4.5 w-4.5 text-[var(--text-muted)]" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-[var(--gold-accent)] text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-[var(--card-bg)]">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="hidden sm:inline">Cart</span>
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="h-9 w-9 rounded-lg border border-[var(--card-border)] flex items-center justify-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
                            title="Toggle Light/Dark Theme"
                        >
                            {isDark ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-[var(--text-secondary)]" />}
                        </button>

                        {/* User Profile Info & Menu */}
                        <div className="relative shrink-0" ref={profileMenuRef}>
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="flex items-center gap-2 text-left hover:opacity-95 transition-opacity"
                            >
                                <div className="h-9 w-9 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--gold-accent)] flex items-center justify-center font-black text-xs">
                                    DT
                                </div>
                                <div className="hidden lg:block leading-none">
                                    <div className="text-xs font-bold text-[var(--text-primary)]">{user?.name || 'Dhruva'}</div>
                                    <div className="text-[9px] font-semibold text-[var(--text-muted)] mt-0.5">Customer Portal</div>
                                </div>
                                <ChevronDown className="h-3 w-3 text-[var(--text-muted)]" />
                            </button>

                            {/* Dropdown Items */}
                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2.5 w-48 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl py-2 z-50 animate-scale-up">
                                    <button
                                        onClick={() => {
                                            setIsProfileDropdownOpen(false)
                                            setIsOrdersDrawerOpen(true)
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-[var(--bg-right-panel)] text-xs font-semibold flex items-center gap-2 text-[var(--text-secondary)]"
                                    >
                                        <Clock className="h-4 w-4 text-[var(--text-muted)]" />
                                        My Orders History
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



            <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-10">

                {selectedCategory === 'All Products' ? (
                    <AllCategoriesView 
                        categories={categories}
                        setSearchParams={setSearchParams}
                    />
                ) : (selectedCategory || searchParam) ? (
                    <div className="space-y-6">
                        {/* Breadcrumb */}
                        <div className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 opacity-80">
                            <span className="cursor-pointer hover:text-[var(--gold-accent)] transition-colors" onClick={() => setSearchParams({})}>Home</span>
                            <span>&gt;</span>
                            <span className="text-[var(--text-primary)] font-bold">{selectedCategory || 'Search Results'}</span>
                        </div>

                        {/* Title & Stats */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-black text-[var(--text-primary)] tracking-tight">
                                    {selectedCategory || `Search Results for "${searchParam}"`}
                                </h1>
                                <p className="text-xs font-semibold text-[var(--text-muted)] mt-1">
                                    Showing {filteredProducts.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                                </p>
                            </div>

                            {/* Sort & Grid/List view */}
                            <div className="flex items-center gap-3 self-end sm:self-center">
                                <span className="text-xs font-bold text-[var(--text-secondary)] whitespace-nowrap">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl py-2 px-3 text-xs font-semibold outline-none cursor-pointer focus:border-[var(--gold-accent)] text-[var(--text-primary)]"
                                >
                                    <option value="popularity">Popularity</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Customer Rating</option>
                                </select>
                            </div>
                        </div>


                        {/* Main Grid: Filter panel + Products grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Left Filter Panel (Col 3) */}
                            <div className="lg:col-span-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 space-y-6 shadow-sm">
                                <div className="flex items-center justify-between border-b pb-4 border-[var(--card-border)]/70">
                                    <span className="font-['Outfit'] font-black text-sm text-[var(--text-primary)] tracking-tight">Filters</span>
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-[10px] font-black uppercase text-[var(--gold-accent)] hover:underline tracking-wider"
                                    >
                                        Clear All
                                    </button>
                                </div>

                                {/* Shop by Category Filter */}
                                <div className="space-y-3 pb-5 border-b border-[var(--card-border)]/40">
                                    <div className="font-extrabold text-[11px] text-[var(--text-primary)] uppercase tracking-wider flex items-center justify-between cursor-pointer">
                                        <span>Shop by Category</span>
                                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                                    </div>
                                    <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1 no-scrollbar text-left">
                                        {/* All Categories Item */}
                                        <div
                                            onClick={() => {
                                                setSearchParams({});
                                            }}
                                            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${(selectedCategory === 'Recommended' || (!selectedCategory && selectedCategory !== 'All Products')) ? 'bg-[var(--gold-bg-pill)] text-[var(--gold-accent)]' : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--text-primary)]'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <rect x="3" y="3" width="7" height="7" />
                                                    <rect x="14" y="3" width="7" height="7" />
                                                    <rect x="14" y="14" width="7" height="7" />
                                                    <rect x="3" y="14" width="7" height="7" />
                                                </svg>
                                                <span>All Categories</span>
                                            </div>
                                            <span className="text-[10px] opacity-70">({products.length})</span>
                                        </div>

                                        {categories.map((cat) => {
                                            const isSelected = selectedCategory === cat.name;
                                            const CategoryIcon = getCategoryIcon(cat.name);
                                            return (
                                                <div
                                                    key={cat.name}
                                                    onClick={() => setSearchParams({ category: cat.name })}
                                                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${isSelected ? 'bg-[var(--gold-bg-pill)] text-[var(--gold-accent)]' : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--text-primary)]'}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <CategoryIcon className={`h-4 w-4 ${isSelected ? 'text-[var(--gold-accent)]' : 'text-[var(--text-muted)]'}`} />
                                                        <span>{cat.name}</span>
                                                    </div>
                                                    <span className="text-[10px] opacity-70">({cat.count})</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Subcategories filter list */}
                                <div className="space-y-3">
                                    <div className="font-extrabold text-[11px] text-[var(--text-primary)] uppercase tracking-wider flex items-center justify-between cursor-pointer">
                                        <span>Subcategories</span>
                                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                                    </div>
                                    <div className="space-y-2">
                                        {availableSubcategories.map((subName) => {
                                            const isChecked = selectedSubcategory === subName;
                                            return (
                                                <label key={subName} className="flex items-center gap-2.5 text-xs font-semibold text-[var(--text-secondary)] cursor-pointer select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => setSelectedSubcategory(isChecked ? null : subName)}
                                                        className="rounded border-[var(--card-border)] text-[var(--gold-accent)] focus:ring-[var(--gold-accent)] h-3.5 w-3.5 cursor-pointer"
                                                    />
                                                    <span>{subName}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Brands filter list */}
                                <div className="space-y-3 pt-4 border-t border-[var(--card-border)]/40">
                                    <div className="font-extrabold text-[11px] text-[var(--text-primary)] uppercase tracking-wider flex items-center justify-between">
                                        <span>Brand</span>
                                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                                    </div>
                                    {/* Brand Search */}
                                    <div className="relative flex items-center border border-[var(--card-border)] rounded-lg overflow-hidden bg-[var(--bg-right-panel)]">
                                        <div className="pl-2.5 text-[var(--text-muted)]">
                                            <Search className="h-3.5 w-3.5" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search Brand"
                                            value={brandSearchQuery}
                                            onChange={(e) => setBrandSearchQuery(e.target.value)}
                                            className="w-full py-1.5 px-2 bg-transparent text-[11px] font-medium outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                        />
                                    </div>
                                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 no-scrollbar">
                                        {availableBrands
                                            .filter(b => b.toLowerCase().includes(brandSearchQuery.toLowerCase()))
                                            .map((brand) => {
                                                const isChecked = selectedBrands.includes(brand);
                                                return (
                                                    <label key={brand} className="flex items-center gap-2.5 text-xs font-semibold text-[var(--text-secondary)] cursor-pointer select-none">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => {
                                                                if (isChecked) {
                                                                    setSelectedBrands(selectedBrands.filter(b => b !== brand));
                                                                } else {
                                                                    setSelectedBrands([...selectedBrands, brand]);
                                                                }
                                                            }}
                                                            className="rounded border-[var(--card-border)] text-[var(--gold-accent)] focus:ring-[var(--gold-accent)] h-3.5 w-3.5 cursor-pointer"
                                                        />
                                                        <span>{brand}</span>
                                                    </label>
                                                );
                                            })}
                                    </div>
                                </div>

                                {/* Price range filter */}
                                <div className="space-y-3 pt-4 border-t border-[var(--card-border)]/40">
                                    <div className="font-extrabold text-[11px] text-[var(--text-primary)] uppercase tracking-wider flex items-center justify-between">
                                        <span>Price Range</span>
                                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                                    </div>
                                    <div className="space-y-2.5">
                                        <input
                                            type="range"
                                            min="499"
                                            max="150000"
                                            step="500"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                                            className="w-full accent-[var(--gold-accent)] h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="flex items-center justify-between text-[10.5px] font-extrabold text-[var(--text-secondary)]">
                                            <span>₹499</span>
                                            <span>{formatCurrency(maxPrice)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Ratings Filter */}
                                <div className="space-y-3 pt-4 border-t border-[var(--card-border)]/40">
                                    <div className="font-extrabold text-[11px] text-[var(--text-primary)] uppercase tracking-wider flex items-center justify-between">
                                        <span>Ratings</span>
                                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                                    </div>
                                    <div className="space-y-2">
                                        {[5, 4, 3].map((stars) => {
                                            const isChecked = selectedRating === stars;
                                            return (
                                                <label key={stars} className="flex items-center gap-2.5 text-xs font-semibold text-[var(--text-secondary)] cursor-pointer select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => setSelectedRating(isChecked ? null : stars)}
                                                        className="rounded border-[var(--card-border)] text-[var(--gold-accent)] focus:ring-[var(--gold-accent)] h-3.5 w-3.5 cursor-pointer"
                                                    />
                                                    <span className="flex items-center gap-1 text-amber-500">
                                                        {[...Array(5)].map((_, s) => (
                                                            <Star key={s} className={`h-3.5 w-3.5 ${s < stars ? 'fill-current' : 'opacity-20'}`} />
                                                        ))}
                                                        <span className="text-[10px] text-[var(--text-muted)] font-bold ml-1">{stars} &amp; Up</span>
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Right side: Product Grid (Col 9) */}
                            <div className="lg:col-span-9 space-y-8">
                                {filteredProducts.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                                        {paginatedProducts.map((prod) => (
                                            <div
                                                key={prod.id}
                                                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
                                            >
                                                {/* Top Image area */}
                                                <div 
                                                    onClick={() => navigate(`/product/${prod.id}`)}
                                                    className="relative bg-[var(--bg-right-panel)] h-36 w-full rounded-xl overflow-hidden flex items-center justify-center border border-[var(--card-border)]/50 shadow-inner cursor-pointer"
                                                >
                                                    <img
                                                        src={prod.image}
                                                        alt={prod.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    {/* Discount sticker */}
                                                    {prod.discount && (
                                                        <span className="absolute top-2 left-2 bg-[#FFEAEB] text-[#D84242] text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm">
                                                            {prod.discount}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Details info */}
                                                <div className="mt-3 space-y-2 flex-1 flex flex-col justify-between">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center justify-between text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                                            <span>{prod.brand}</span>
                                                            <span className="flex items-center text-amber-500 gap-0.5">
                                                                <Star className="h-2.5 w-2.5 fill-current" />
                                                                {prod.rating}
                                                            </span>
                                                        </div>
                                                        <h3 
                                                            onClick={() => navigate(`/product/${prod.id}`)}
                                                            className="font-bold text-[10.5px] text-[var(--text-primary)] line-clamp-2 leading-tight group-hover:text-[var(--gold-accent)] transition-colors min-h-[28px] cursor-pointer"
                                                        >
                                                            {prod.name}
                                                        </h3>
                                                    </div>

                                                    {/* Action button price and wishlist */}
                                                    <div className="space-y-2.5 pt-2 border-t border-[var(--card-border)]/50">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-black text-[var(--text-primary)]">{formatCurrency(prod.price)}</span>
                                                            {prod.originalPrice && (
                                                                <span className="text-[9px] font-semibold text-[var(--text-muted)] line-through leading-none mt-0.5">{formatCurrency(prod.originalPrice)}</span>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-1.5">
                                                            <button
                                                                onClick={() => addToCart(prod)}
                                                                className="flex-1 py-1.5 rounded-lg bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white text-[9.5px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                                            >
                                                                <ShoppingBag className="h-3 w-3" /> Add
                                                            </button>
                                                            <button 
                                                                onClick={() => toggleWishlist(prod.id)}
                                                                className="h-7 w-7 rounded-lg border border-[var(--card-border)] hover:border-rose-500 text-[var(--text-muted)] flex items-center justify-center transition-all bg-[var(--card-bg)] cursor-pointer"
                                                            >
                                                                <Heart className={`h-3.5 w-3.5 ${wishlist.includes(prod.id) ? 'fill-rose-500 text-rose-500' : 'text-[var(--text-muted)] hover:text-rose-500'}`} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-16 text-center shadow-sm space-y-4">
                                        <div className="h-16 w-16 rounded-full bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] flex items-center justify-center mx-auto text-xl font-bold">
                                            🔍
                                        </div>
                                        <h3 className="font-['Outfit'] font-black text-lg text-[var(--text-primary)]">No products found</h3>
                                        <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
                                            No products match your current filters. Try resetting the filters or modifying the price range.
                                        </p>
                                        <button
                                            onClick={clearAllFilters}
                                            className="bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 pt-6 border-t border-[var(--card-border)]/50">
                                        <button 
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            className="h-9 w-9 rounded-lg border border-[var(--card-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all disabled:opacity-40 disabled:hover:bg-transparent"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        {Array.from({ length: totalPages }).map((_, idx) => {
                                            const pageNum = idx + 1;
                                            return (
                                                <button 
                                                    key={pageNum} 
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`h-9 w-9 rounded-lg border flex items-center justify-center text-xs font-black transition-all ${pageNum === currentPage ? 'bg-[var(--gold-accent)] text-white border-transparent shadow-md shadow-[var(--gold-accent)]/15' : 'border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'}`}
                                                >
                                                    {pageNum}
                                                </button>
                                            )
                                        })}
                                        <button 
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            className="h-9 w-9 rounded-lg border border-[var(--card-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all disabled:opacity-40 disabled:hover:bg-transparent"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* 1. Hero Promo Section / Image Slider Banner */}
                        <section className="relative h-[280px] sm:h-[350px] md:h-[400px] rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-500">

                            {/* Slider Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform"
                                style={{
                                    backgroundImage: `url(${SLIDES[activeHeroDot].image})`
                                }}
                            />

                            {/* Theme-aligned gradient overlay for readability */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

                            {/* Slide Content details */}
                            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 space-y-4 max-w-xl text-white z-10 text-left">
                                <span className="w-fit bg-[var(--gold-accent)] text-white text-[9px] font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
                                    {SLIDES[activeHeroDot].badge}
                                </span>
                                <h1 className="font-['Outfit'] text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] text-white">
                                    {SLIDES[activeHeroDot].title}
                                </h1>
                                <p className="text-[10px] sm:text-xs md:text-sm font-medium text-white/90 leading-relaxed">
                                    {SLIDES[activeHeroDot].subtitle}
                                </p>
                                <button
                                    onClick={() => {
                                        const el = document.getElementById('recommended-section')
                                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                                    }}
                                    className="w-fit bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-xs font-extrabold shadow-lg shadow-[var(--gold-accent)]/20 hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center gap-2"
                                >
                                    {SLIDES[activeHeroDot].btnText} <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Dots indicators (Auto sliding loop) */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                                {SLIDES.map((_, dot) => (
                                    <button
                                        key={dot}
                                        onClick={() => setActiveHeroDot(dot)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeHeroDot === dot
                                                ? 'bg-[var(--gold-accent)] w-6.5'
                                                : 'bg-white/50 hover:bg-white'
                                            }`}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* 2. Shop by Categories Section */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="font-['Outfit'] text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
                                    Shop by Categories
                                </h2>
                                <span 
                                    onClick={() => setSearchParams({ category: 'All' })}
                                    className="text-xs font-bold text-[var(--gold-accent)] cursor-pointer hover:underline"
                                >
                                    View All
                                </span>
                            </div>

                            <div className="relative">
                                {/* Carousel Wrapper */}
                                <div ref={categoriesRef} className="flex items-center gap-5 xl:justify-between overflow-x-auto no-scrollbar py-2.5 scroll-smooth">
                                    {categories.map((cat, idx) => (
                                        <CategoryItem
                                            key={idx}
                                            cat={cat}
                                            onClick={() => setSearchParams({ category: cat.name })}
                                        />
                                    ))}
                                </div>

                                {/* Navigation Chevrons */}
                                <button
                                    onClick={() => scroll(categoriesRef, 'left')}
                                    className="absolute -left-3 top-1/2 -translate-y-1/2 bg-[var(--card-bg)] hover:bg-neutral-50 dark:hover:bg-white/5 border border-[var(--card-border)] h-9 w-9 rounded-full flex items-center justify-center shadow-md text-[var(--text-secondary)] transition-all xl:hidden"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => scroll(categoriesRef, 'right')}
                                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-[var(--card-bg)] hover:bg-neutral-50 dark:hover:bg-white/5 border border-[var(--card-border)] h-9 w-9 rounded-full flex items-center justify-center shadow-md text-[var(--text-secondary)] transition-all xl:hidden"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </section>

                        {/* 3. Features highlight ribbon */}
                        <section className="bg-[var(--card-bg)] border border-[var(--card-border)] p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shadow-sm">
                            <div className="flex items-center gap-3.5 px-3">
                                <div className="p-2.5 rounded-xl bg-[var(--badge-bg)] text-[var(--gold-accent)] shrink-0 border border-[var(--badge-border)]">
                                    <Truck className="h-5.5 w-5.5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black tracking-tight">Free Delivery</h4>
                                    <p className="text-[10px] font-semibold text-[var(--text-muted)] mt-0.5">On orders above ₹499</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3.5 px-3">
                                <div className="p-2.5 rounded-xl bg-[var(--badge-bg)] text-[var(--gold-accent)] shrink-0 border border-[var(--badge-border)]">
                                    <CreditCard className="h-5.5 w-5.5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black tracking-tight">Secure Payment</h4>
                                    <p className="text-[10px] font-semibold text-[var(--text-muted)] mt-0.5">100% secure payments</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3.5 px-3">
                                <div className="p-2.5 rounded-xl bg-[var(--badge-bg)] text-[var(--gold-accent)] shrink-0 border border-[var(--badge-border)]">
                                    <RefreshCw className="h-5.5 w-5.5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black tracking-tight">Easy Returns</h4>
                                    <p className="text-[10px] font-semibold text-[var(--text-muted)] mt-0.5">30-day return policy</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3.5 px-3">
                                <div className="p-2.5 rounded-xl bg-[var(--badge-bg)] text-[var(--gold-accent)] shrink-0 border border-[var(--badge-border)]">
                                    <Headphones className="h-5.5 w-5.5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black tracking-tight">24/7 Support</h4>
                                    <p className="text-[10px] font-semibold text-[var(--text-muted)] mt-0.5">We're here to help</p>
                                </div>
                            </div>
                        </section>

                        {/* 4. Recommended for You Section */}
                        <section id="recommended-section" className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="font-['Outfit'] text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
                                    Recommended for you
                                </h2>
                                <span 
                                    onClick={() => setSearchParams({ category: 'Recommended' })}
                                    className="text-xs font-bold text-[var(--gold-accent)] cursor-pointer hover:underline"
                                >
                                    View All
                                </span>
                            </div>

                            <div className="relative">
                                <div ref={recommendedRef} className="flex items-center gap-5 xl:justify-between overflow-x-auto no-scrollbar py-2 scroll-smooth">
                                    {recommendedProducts.map((prod) => (
                                        <div
                                            key={prod.id}
                                            className="flex-shrink-0 w-[220px] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
                                        >
                                            {/* Product Top Image & Tags */}
                                            <div 
                                                onClick={() => navigate(`/product/${prod.id}`)}
                                                className="relative bg-[var(--bg-right-panel)] h-44 w-full flex items-center justify-center overflow-hidden border-b border-[var(--card-border)] cursor-pointer"
                                            >
                                                <img
                                                    src={prod.image}
                                                    alt={prod.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />

                                                {/* Sale Badge */}
                                                <span className="absolute top-2.5 left-2.5 bg-[#FFEAEB] text-[#D84242] text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm">
                                                    {prod.discount}
                                                </span>

                                                {/* Wishlist toggle icon */}
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); toggleWishlist(prod.id); }}
                                                    className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-[var(--card-bg)]/80 dark:bg-black/50 hover:bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--card-border)] flex items-center justify-center transition-all cursor-pointer"
                                                >
                                                    <Heart className={`h-3.5 w-3.5 ${wishlist.includes(prod.id) ? 'fill-rose-500 text-rose-500' : 'text-[var(--text-muted)] hover:text-rose-500'}`} />
                                                </button>
                                            </div>

                                            {/* Product Details */}
                                            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                                <div>
                                                    <span className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider uppercase">
                                                        {prod.category}
                                                    </span>
                                                    <h3 
                                                        onClick={() => navigate(`/product/${prod.id}`)}
                                                        className="font-bold text-xs mt-1 text-[var(--text-primary)] line-clamp-2 leading-tight group-hover:text-[var(--gold-accent)] transition-colors min-h-[32px] cursor-pointer"
                                                    >
                                                        {prod.name}
                                                    </h3>

                                                    {/* Stars Rating */}
                                                    <div className="flex items-center gap-1 mt-2">
                                                        <div className="flex items-center text-amber-400">
                                                            {[...Array(5)].map((_, s) => (
                                                                <Star key={s} className="h-3 w-3 fill-current" />
                                                            ))}
                                                        </div>
                                                        <span className="text-[9.5px] font-bold text-[var(--text-muted)]">
                                                            ({prod.reviews})
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Prices & Actions Button */}
                                                <div>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-sm font-black text-[var(--text-primary)]">
                                                            {formatCurrency(prod.price)}
                                                        </span>
                                                        <span className="text-[10px] font-semibold text-[var(--text-muted)] line-through">
                                                            {formatCurrency(prod.originalPrice)}
                                                        </span>
                                                    </div>

                                                    <button
                                                        onClick={() => addToCart(prod)}
                                                        className="w-full mt-3.5 py-2 rounded-xl bg-transparent hover:bg-[var(--gold-accent)] text-[var(--gold-accent)] hover:text-white border border-[var(--gold-accent)]/35 hover:border-transparent text-[10.5px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
                                                    >
                                                        <ShoppingBag className="h-3.5 w-3.5" /> Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Carousel navigators */}
                                <button
                                    onClick={() => scroll(recommendedRef, 'left')}
                                    className="absolute -left-3 top-1/2 -translate-y-1/2 bg-[var(--card-bg)] hover:bg-neutral-50 dark:hover:bg-white/5 border border-[var(--card-border)] h-9 w-9 rounded-full flex items-center justify-center shadow-md text-[var(--text-secondary)] transition-all xl:hidden"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => scroll(recommendedRef, 'right')}
                                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-[var(--card-bg)] hover:bg-neutral-50 dark:hover:bg-white/5 border border-[var(--card-border)] h-9 w-9 rounded-full flex items-center justify-center shadow-md text-[var(--text-secondary)] transition-all xl:hidden"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </section>

                        {/* 5. Two Banner Promo Grid */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Purple Smartphone banner */}
                            <div className="bg-gradient-to-br from-[#7B66FF] to-[#5944DB] text-white rounded-3xl p-6 lg:p-10 flex items-center justify-between overflow-hidden relative shadow-sm group">
                                <div className="space-y-4 max-w-[60%] relative z-10">
                                    <h3 className="font-['Outfit'] text-2xl lg:text-3xl font-black leading-tight">
                                        Smartphones <br /> Starting at ₹8,999
                                    </h3>
                                    <p className="text-[11px] font-medium text-white/80">Latest deals on top brands</p>
                                    <button
                                        onClick={() => setSearchParams({ category: 'Electronics' })}
                                        className="bg-white text-[#7B66FF] px-4 py-2.5 rounded-lg text-[10.5px] font-black uppercase hover:-translate-y-0.5 transition-all shadow-md shrink-0"
                                    >
                                        Shop Now
                                    </button>
                                </div>
                                <img
                                    src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80"
                                    alt="Phones"
                                    className="w-[180px] h-[180px] object-contain shrink-0 group-hover:scale-105 transition-transform duration-500 drop-shadow-2xl translate-x-2"
                                />
                            </div>

                            {/* Peach Fashion Banner */}
                            <div className="bg-[#FFF0EB] text-[#1F1F1F] rounded-3xl p-6 lg:p-10 flex items-center justify-between overflow-hidden relative shadow-sm group border border-[#FFDFD4]/30">
                                <div className="space-y-4 max-w-[60%] relative z-10">
                                    <h3 className="font-['Outfit'] text-2xl lg:text-3xl font-black text-neutral-900 leading-tight">
                                        Fashion Sale <br /> Min. 50% Off
                                    </h3>
                                    <p className="text-[11px] font-bold text-neutral-500">On latest styles & brands</p>
                                    <button
                                        onClick={() => setSearchParams({ category: 'Fashion' })}
                                        className="bg-[var(--gold-accent)] text-white px-4 py-2.5 rounded-lg text-[10.5px] font-black uppercase hover:-translate-y-0.5 transition-all shadow-md shrink-0"
                                    >
                                        Shop Now
                                    </button>
                                </div>
                                <img
                                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80"
                                    alt="Fashion display rack"
                                    className="w-[180px] h-[180px] object-contain shrink-0 group-hover:scale-105 transition-transform duration-500 drop-shadow-lg translate-x-2 rounded-2xl"
                                />
                            </div>
                        </section>

                        {/* 6. Top Brands Section */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="font-['Outfit'] text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
                                    Top Brands
                                </h2>
                                <span className="text-xs font-bold text-[var(--gold-accent)] cursor-pointer hover:underline">
                                    View All
                                </span>
                            </div>

                            <div className="relative">
                                <div ref={brandsRef} className="flex items-center gap-5 lg:justify-between overflow-x-auto no-scrollbar py-2">
                                    {BRANDS.map((brand, idx) => (
                                        <div
                                            key={idx}
                                            className="flex-shrink-0 w-[140px] bg-[var(--card-bg)] border border-[var(--card-border)] py-5 rounded-2xl text-center shadow-sm hover:shadow-md hover:border-[var(--gold-accent)]/45 transition-all cursor-pointer font-['Outfit'] text-base font-black tracking-widest text-[var(--gold-accent)] uppercase"
                                        >
                                            {brand}
                                        </div>
                                    ))}
                                </div>

                                {/* Navigation chevron floating */}
                                <button
                                    onClick={() => scroll(brandsRef, 'left')}
                                    className="absolute -left-3 top-1/2 -translate-y-1/2 bg-[var(--card-bg)] hover:bg-neutral-50 dark:hover:bg-white/5 border border-[var(--card-border)] h-9 w-9 rounded-full flex items-center justify-center shadow-md text-[var(--text-secondary)] transition-all lg:hidden"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => scroll(brandsRef, 'right')}
                                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-[var(--card-bg)] hover:bg-neutral-50 dark:hover:bg-white/5 border border-[var(--card-border)] h-9 w-9 rounded-full flex items-center justify-center shadow-md text-[var(--text-secondary)] transition-all lg:hidden"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </section>

                        {/* 7. You May Also Like Section */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="font-['Outfit'] text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
                                    You may also like
                                </h2>
                                <span 
                                    onClick={() => setSearchParams({ category: 'All' })}
                                    className="text-xs font-bold text-[var(--gold-accent)] cursor-pointer hover:underline"
                                >
                                    View All
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
                                {youMayAlsoLike.slice(0, 6).map((prod) => (
                                    <div
                                        key={prod.id}
                                        className="bg-[var(--card-bg)] border border-[var(--card-border)] p-3 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                                    >
                                        <div 
                                            onClick={() => navigate(`/product/${prod.id}`)}
                                            className="bg-[var(--bg-right-panel)] h-28 w-full rounded-xl overflow-hidden flex items-center justify-center border border-[var(--card-border)] shadow-inner cursor-pointer"
                                        >
                                            <img
                                                src={prod.image}
                                                alt={prod.name}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                                            />
                                        </div>
                                        <div className="mt-3.5 space-y-2">
                                            <div>
                                                <span className="text-[8.5px] font-bold text-[var(--text-muted)] uppercase">{prod.category}</span>
                                                <h3 
                                                    onClick={() => navigate(`/product/${prod.id}`)}
                                                    className="font-bold text-[11px] text-[var(--text-primary)] line-clamp-1 leading-snug mt-0.5 cursor-pointer hover:text-[var(--gold-accent)] transition-colors"
                                                >
                                                    {prod.name}
                                                </h3>
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

                        {/* 8. Coupon/Footer Promo Banner */}
                        <section className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm relative">
                            <div className="flex items-center gap-4 text-center sm:text-left">
                                <div className="h-14 w-14 rounded-2xl bg-[var(--badge-bg)] border border-[var(--badge-border)] flex items-center justify-center text-[var(--gold-accent)] shrink-0">
                                    <Sparkles className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="text-sm lg:text-base font-black text-[var(--text-primary)] tracking-tight">Extra 10% Off on your first order 🎉</h3>
                                    <p className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5">
                                        Use code: <span className="font-extrabold text-[var(--gold-accent)] tracking-wider font-mono">WELCOME10</span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    const el = document.getElementById('recommended-section')
                                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                                }}
                                className="bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white px-6 py-2.5 rounded-xl text-xs font-extrabold transition-colors shadow-md shrink-0 cursor-pointer"
                            >
                                Shop Now
                            </button>
                        </section>
                    </>
                )}
            </main>

            {/* SLIDE-OVER DRAWER FOR MY ORDERS */}
            {isOrdersDrawerOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Backdrop overlay blur */}
                        <div
                            onClick={() => setIsOrdersDrawerOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
                        />

                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <div className="pointer-events-auto w-screen max-w-md transform bg-[var(--bg-right-panel)] border-l border-[var(--card-border)] shadow-2xl transition-all duration-500 ease-in-out flex flex-col h-full">

                                {/* Drawer Header */}
                                <div className="px-6 py-5 border-b border-[var(--card-border)] bg-[var(--card-bg)] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-[var(--badge-bg)] text-[var(--gold-accent)] rounded-lg">
                                            <ShoppingBag className="h-4.5 w-4.5" />
                                        </div>
                                        <h2 className="font-['Outfit'] text-lg font-black text-[var(--text-primary)]" id="slide-over-title">
                                            My Orders & History
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setIsOrdersDrawerOpen(false)}
                                        className="h-8 w-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 border border-transparent hover:border-[var(--card-border)] flex items-center justify-center text-[var(--text-muted)] transition-all"
                                    >
                                        <X className="h-4.5 w-4.5" />
                                    </button>
                                </div>

                                {/* Drawer Body with Customer metrics and list of orders */}
                                <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">

                                    {/* Metrics section */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-3.5 rounded-xl text-center">
                                            <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-wider block">Total Spent</span>
                                            <span className="text-xs font-black text-[var(--text-primary)] block mt-1">
                                                {formatCurrency(customerStats.totalSpent)}
                                            </span>
                                        </div>
                                        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-3.5 rounded-xl text-center">
                                            <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-wider block">Orders Placed</span>
                                            <span className="text-xs font-black text-[var(--text-primary)] block mt-1">
                                                {customerStats.orderCount}
                                            </span>
                                        </div>
                                        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-3.5 rounded-xl text-center">
                                            <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-wider block">Avg. Value</span>
                                            <span className="text-xs font-black text-[var(--text-primary)] block mt-1">
                                                {formatCurrency(customerStats.avgSpent)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Orders List */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black text-[var(--text-primary)] tracking-wide uppercase flex items-center gap-1.5">
                                            <Clock className="h-4 w-4 text-[var(--text-muted)]" /> Purchase Records
                                        </h3>

                                        {loading ? (
                                            <div className="py-16 text-center flex flex-col items-center justify-center gap-2">
                                                <RefreshCw className="h-6 w-6 text-[var(--text-muted)] animate-spin" />
                                                <span className="text-xs text-[var(--text-muted)]">Loading orders...</span>
                                            </div>
                                        ) : orders.length === 0 ? (
                                            <div className="py-16 text-center border border-dashed border-[var(--card-border)] rounded-2xl flex flex-col items-center justify-center p-6 gap-3 bg-[var(--card-bg)]">
                                                <div className="h-10 w-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500">
                                                    <ShoppingBag className="h-5.5 w-5.5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-black text-[var(--text-primary)]">No Orders Placed Yet</h4>
                                                    <p className="text-[10px] text-[var(--text-muted)] mt-1 max-w-[200px] mx-auto leading-normal">
                                                        Click on any product to simulate a checkout order instantly!
                                                    </p>
                                                </div>
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
                                                    else if (o.OrderStatus === 'Returned') statusColor = 'bg-orange-500/10 text-orange-500 border border-orange-500/15'

                                                    const canCancel = o.OrderStatus === 'Pending' || o.OrderStatus === 'Processing'

                                                    return (
                                                        <div
                                                            key={o.OrderID}
                                                            className="bg-[var(--card-bg)] border border-[var(--card-border)] p-4 rounded-xl space-y-3 hover:border-[var(--gold-accent)]/30 transition-colors shadow-sm"
                                                        >
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div>
                                                                    <div className="text-[9px] font-mono font-bold text-[var(--text-muted)]">
                                                                        ID: {o.OrderID}
                                                                    </div>
                                                                    <h4 className="text-xs font-bold text-[var(--text-primary)] mt-0.5 line-clamp-1 leading-snug">
                                                                        {o.ProductName}
                                                                    </h4>
                                                                    <div className="text-[10px] text-[var(--text-secondary)] mt-1 flex items-center gap-1.5">
                                                                        <span>Category: {o.Category}</span>
                                                                        <span>•</span>
                                                                        <span>Qty: {o.Quantity}</span>
                                                                    </div>
                                                                </div>
                                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider shrink-0 ${statusColor}`}>
                                                                    {o.OrderStatus}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-[var(--card-border)]">
                                                                <div>
                                                                    <div className="text-[10px] font-black text-[var(--text-primary)]">
                                                                        {formatCurrency(o.TotalAmount)}
                                                                    </div>
                                                                    <div className="text-[8.5px] font-semibold text-[var(--text-muted)] mt-0.5">
                                                                        {new Date(o.OrderDate).toLocaleDateString('en-IN', {
                                                                            day: '2-digit', month: 'short', year: 'numeric'
                                                                        })}
                                                                    </div>
                                                                </div>

                                                                {canCancel && (
                                                                    <button
                                                                        onClick={() => handleCancelOrder(o.OrderID)}
                                                                        disabled={actionLoading}
                                                                        className="px-3 py-1.5 rounded-lg border border-rose-500/25 hover:border-transparent hover:bg-rose-500 text-rose-500 hover:text-white text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Drawer Footer */}
                                <div className="px-6 py-4.5 border-t border-[var(--card-border)] bg-[var(--card-bg)] flex items-center justify-between gap-3 shrink-0">
                                    <button
                                        onClick={() => setIsOrdersDrawerOpen(false)}
                                        className="w-full py-2.5 border border-[var(--card-border)] hover:bg-neutral-100 dark:hover:bg-white/5 rounded-xl text-xs font-black text-[var(--text-secondary)] transition-colors uppercase tracking-wider"
                                    >
                                        Close Drawer
                                    </button>
                                    <button
                                        onClick={() => {
                                            setBuyForm({
                                                ProductName: '',
                                                Category: 'Electronics',
                                                Brand: '',
                                                Quantity: 1,
                                                UnitPrice: '',
                                                PaymentMethod: 'UPI',
                                                City: 'Mumbai',
                                                State: 'MH',
                                                Country: 'India'
                                            })
                                            setIsOrdersDrawerOpen(false)
                                            setIsBuyModalOpen(true)
                                        }}
                                        className="w-full py-2.5 bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white rounded-xl text-xs font-black transition-colors uppercase tracking-wider shadow-md inline-flex items-center justify-center gap-1.5"
                                    >
                                        <Plus className="h-4 w-4" /> Simulator
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SLIDE-OVER DRAWER FOR WISHLIST */}
            {isWishlistDrawerOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="wishlist-title" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 overflow-hidden">
                        <div
                            onClick={() => setIsWishlistDrawerOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
                        />
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <div className="pointer-events-auto w-screen max-w-md transform bg-[var(--bg-right-panel)] border-l border-[var(--card-border)] shadow-2xl transition-all duration-500 ease-in-out flex flex-col h-full">
                                <div className="px-6 py-5 border-b border-[var(--card-border)] bg-[var(--card-bg)] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-[var(--badge-bg)] text-rose-500 rounded-lg">
                                            <Heart className="h-4.5 w-4.5 fill-current" />
                                        </div>
                                        <h2 className="font-['Outfit'] text-lg font-black text-[var(--text-primary)]" id="wishlist-title">
                                            My Wishlist
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setIsWishlistDrawerOpen(false)}
                                        className="h-8 w-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 border border-transparent hover:border-[var(--card-border)] flex items-center justify-center text-[var(--text-muted)] transition-all"
                                    >
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
                                                <p className="text-[10px] text-[var(--text-muted)] mt-1 max-w-[200px] mx-auto leading-normal">
                                                    Tap the heart icon on any product to save it here!
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3.5">
                                            {products.filter(p => wishlist.includes(p.id)).map((o) => (
                                                <div
                                                    key={o.id}
                                                    className="bg-[var(--card-bg)] border border-[var(--card-border)] p-4 rounded-xl space-y-3 hover:border-[var(--gold-accent)]/30 transition-colors shadow-sm flex items-center gap-4"
                                                >
                                                    <div className="h-16 w-16 bg-[var(--bg-right-panel)] rounded-lg overflow-hidden border border-[var(--card-border)] flex-shrink-0">
                                                        <img src={o.image} alt={o.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                                            {o.brand}
                                                        </div>
                                                        <h4 className="text-xs font-bold text-[var(--text-primary)] mt-0.5 truncate">
                                                            {o.name}
                                                        </h4>
                                                        <div className="text-xs font-black text-[var(--gold-accent)] mt-1">
                                                            {formatCurrency(o.price)}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-1.5">
                                                        <button
                                                            onClick={() => {
                                                                setIsWishlistDrawerOpen(false);
                                                                triggerCheckout(o);
                                                            }}
                                                            className="px-2.5 py-1.5 bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            Buy
                                                        </button>
                                                        <button
                                                            onClick={() => toggleWishlist(o.id)}
                                                            className="p-1.5 border border-rose-500/25 hover:bg-rose-500/5 text-rose-500 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                                                            title="Remove from wishlist"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="px-6 py-4.5 border-t border-[var(--card-border)] bg-[var(--card-bg)] flex items-center justify-between gap-3 shrink-0">
                                    <button
                                        onClick={() => setIsWishlistDrawerOpen(false)}
                                        className="w-full py-2.5 border border-[var(--card-border)] hover:bg-neutral-100 dark:hover:bg-white/5 rounded-xl text-xs font-black text-[var(--text-secondary)] transition-colors uppercase tracking-wider"
                                    >
                                        Close Wishlist
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CONFIRM PURCHASE CHECKOUT MODAL */}
            {isBuyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-md rounded-2xl border border-[var(--card-border)] p-6 shadow-2xl relative overflow-hidden transition-all bg-[var(--bg-right-panel)] text-[var(--text-primary)] max-h-[90vh] overflow-y-auto no-scrollbar">

                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--card-border)]">
                            <h3 className="font-['Outfit'] text-lg font-black flex items-center gap-2 text-[var(--text-primary)]">
                                <ShoppingBag className="h-5 w-5 text-[var(--gold-accent)]" /> Confirm Purchase Checkout
                            </h3>
                            <button
                                onClick={() => setIsBuyModalOpen(false)}
                                className="h-8 w-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 border border-transparent hover:border-[var(--card-border)] flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-all"
                            >
                                <X className="h-4.5 w-4.5" />
                            </button>
                        </div>

                        <form onSubmit={handleBuySubmit} className="space-y-4 text-xs font-semibold">

                            <div>
                                <label className="block mb-1 text-[var(--text-muted)] uppercase tracking-wider text-[8.5px]">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Drone Mini, Keyboard, Coffee Mug"
                                    value={buyForm.ProductName}
                                    onChange={(e) => setBuyForm(p => ({ ...p, ProductName: e.target.value }))}
                                    className="w-full p-3 rounded-xl border border-[var(--card-border)] outline-none text-xs focus:border-[var(--gold-accent)] bg-[var(--card-bg)] text-[var(--text-primary)] transition-all font-bold"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 text-[var(--text-muted)] uppercase tracking-wider text-[8.5px]">Category</label>
                                    <select
                                        value={buyForm.Category}
                                        onChange={(e) => setBuyForm(p => ({ ...p, Category: e.target.value }))}
                                        className="w-full p-3 rounded-xl border border-[var(--card-border)] outline-none text-xs cursor-pointer bg-[var(--card-bg)] text-[var(--text-primary)] transition-all font-bold"
                                    >
                                        <option value="Electronics">Electronics</option>
                                        <option value="Clothing">Clothing</option>
                                        <option value="Home & Kitchen">Home & Kitchen</option>
                                        <option value="Books">Books</option>
                                        <option value="Sports & Outdoors">Sports & Outdoors</option>
                                        <option value="Toys & Games">Toys & Games</option>
                                        <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Bags & Luggage">Bags & Luggage</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-1 text-[var(--text-muted)] uppercase tracking-wider text-[8.5px]">Brand</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Sony, BrightLux"
                                        value={buyForm.Brand}
                                        onChange={(e) => setBuyForm(p => ({ ...p, Brand: e.target.value }))}
                                        className="w-full p-3 rounded-xl border border-[var(--card-border)] outline-none text-xs focus:border-[var(--gold-accent)] bg-[var(--card-bg)] text-[var(--text-primary)] transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 text-[var(--text-muted)] uppercase tracking-wider text-[8.5px]">Unit Price (INR)</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        placeholder="e.g. 1500"
                                        value={buyForm.UnitPrice}
                                        onChange={(e) => setBuyForm(p => ({ ...p, UnitPrice: e.target.value }))}
                                        className="w-full p-3 rounded-xl border border-[var(--card-border)] outline-none text-xs focus:border-[var(--gold-accent)] bg-[var(--card-bg)] text-[var(--text-primary)] transition-all font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-[var(--text-muted)] uppercase tracking-wider text-[8.5px]">Quantity</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={buyForm.Quantity}
                                        onChange={(e) => setBuyForm(p => ({ ...p, Quantity: e.target.value }))}
                                        className="w-full p-3 rounded-xl border border-[var(--card-border)] outline-none text-xs focus:border-[var(--gold-accent)] bg-[var(--card-bg)] text-[var(--text-primary)] transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1 text-[var(--text-muted)] uppercase tracking-wider text-[8.5px]">Payment Method</label>
                                <select
                                    value={buyForm.PaymentMethod}
                                    onChange={(e) => setBuyForm(p => ({ ...p, PaymentMethod: e.target.value }))}
                                    className="w-full p-3 rounded-xl border border-[var(--card-border)] outline-none text-xs cursor-pointer bg-[var(--card-bg)] text-[var(--text-primary)] transition-all font-bold"
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
                                    <label className="block mb-1 text-[var(--text-muted)] uppercase tracking-wider text-[8.5px]">City</label>
                                    <input
                                        type="text"
                                        value={buyForm.City}
                                        onChange={(e) => setBuyForm(p => ({ ...p, City: e.target.value }))}
                                        className="w-full p-3 rounded-xl border border-[var(--card-border)] outline-none text-xs focus:border-[var(--gold-accent)] bg-[var(--card-bg)] text-[var(--text-primary)] transition-all font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-[var(--text-muted)] uppercase tracking-wider text-[8.5px]">State</label>
                                    <input
                                        type="text"
                                        value={buyForm.State}
                                        onChange={(e) => setBuyForm(p => ({ ...p, State: e.target.value }))}
                                        className="w-full p-3 rounded-xl border border-[var(--card-border)] outline-none text-xs focus:border-[var(--gold-accent)] bg-[var(--card-bg)] text-[var(--text-primary)] transition-all font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-[var(--text-muted)] uppercase tracking-wider text-[8.5px]">Country</label>
                                    <input
                                        type="text"
                                        value={buyForm.Country}
                                        onChange={(e) => setBuyForm(p => ({ ...p, Country: e.target.value }))}
                                        className="w-full p-3 rounded-xl border border-[var(--card-border)] outline-none text-xs focus:border-[var(--gold-accent)] bg-[var(--card-bg)] text-[var(--text-primary)] transition-all font-bold"
                                    />
                                </div>
                            </div>

                            {/* Estimated Total */}
                            <div className="pt-2 flex items-center justify-between text-xs font-black text-[var(--text-primary)] border-t border-[var(--card-border)]">
                                <span>Estimated Total:</span>
                                <span className="text-sm text-[var(--gold-accent)]">
                                    {formatCurrency(Number(buyForm.Quantity) * Number(buyForm.UnitPrice || 0))}
                                </span>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--card-border)]">
                                <button
                                    type="button"
                                    onClick={() => setIsBuyModalOpen(false)}
                                    className="px-4 py-2.5 border border-[var(--card-border)] hover:bg-neutral-100 dark:hover:bg-white/5 rounded-xl font-black text-xs transition-colors uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="px-5 py-2.5 bg-[var(--gold-accent)] hover:bg-[var(--gold-hover)] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md uppercase tracking-wider cursor-pointer disabled:opacity-50"
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
