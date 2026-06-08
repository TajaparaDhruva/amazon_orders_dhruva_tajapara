import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    Eye, EyeOff, Mail, Lock, User, ArrowLeft, ArrowRight,
    AlertCircle, CheckCircle, Loader2, Moon, Sun, Building2,
    Package, BarChart3, Search, ShieldCheck, Users, Shield,
    Truck, ShoppingBag, Headphones
} from 'lucide-react'
import loginBg from '../assets/login_bg.png'

const getPasswordStrength = (pass) => {
    if (!pass) return { text: '', color: 'bg-slate-200', width: 'w-0', colorHex: 'var(--text-muted)' }
    let score = 0
    if (pass.length >= 8) score++
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++
    if (/[0-9]/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++
    
    switch(score) {
        case 0:
        case 1:
            return { text: 'Weak', color: 'bg-rose-500', width: 'w-1/4', colorHex: '#EF4444' }
        case 2:
            return { text: 'Fair', color: 'bg-amber-500', width: 'w-2/4', colorHex: '#F59E0B' }
        case 3:
            return { text: 'Good', color: 'bg-blue-500', width: 'w-3/4', colorHex: '#3B82F6' }
        case 4:
        default:
            return { text: 'Strong', color: 'bg-emerald-500', width: 'w-full', colorHex: '#10B981' }
    }
}

export default function Login() {
    const { login, register } = useAuth()
    const navigate = useNavigate()

    const [isDark, setIsDark]           = useState(false)
    const [mode, setMode]               = useState('login') // 'login' or 'register'
    const [role, setRole]               = useState('customer') // 'customer' or 'seller'
    const [form, setForm]               = useState({ name: '', email: '', password: '', confirmPassword: '' })
    const [showPass, setShowPass]       = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading]         = useState(false)
    const [error, setError]             = useState('')
    const [success, setSuccess]         = useState('')
    const [rememberMe, setRememberMe]   = useState(() => {
        return localStorage.getItem('vf_remember_me') === 'true'
    })

    const isSeller = role === 'seller'

    // On mount, restore email if rememberMe was true
    useEffect(() => {
        const savedEmail = localStorage.getItem('vf_remember_email')
        if (rememberMe && savedEmail) {
            setForm(prev => ({ ...prev, email: savedEmail }))
        }
    }, [rememberMe])

    const handleChange = e => { 
        setForm(p => ({ ...p, [e.target.name]: e.target.value }))
        setError('') 
    }

    const validate = () => {
        if (mode === 'register' && !form.name.trim()) return 'Full name is required.'
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) return 'A valid email address is required.'
        if (!form.password || form.password.length < 6) return 'Password must be at least 6 characters.'
        if (mode === 'register' && form.password !== form.confirmPassword) return 'Passwords do not match.'
        return null
    }

    const handleSubmit = async e => {
        e.preventDefault()
        const err = validate()
        if (err) { setError(err); return }
        setLoading(true); setError(''); setSuccess('')
        try {
            const backendRole = isSeller ? 'seller' : 'user'
            const userData = mode === 'login'
                ? await login({ email: form.email, password: form.password })
                : await register({ name: form.name, email: form.email, password: form.password, role: backendRole })
            
            // Handle rememberMe persistence
            if (mode === 'login') {
                if (rememberMe) {
                    localStorage.setItem('vf_remember_me', 'true')
                    localStorage.setItem('vf_remember_email', form.email)
                } else {
                    localStorage.removeItem('vf_remember_me')
                    localStorage.removeItem('vf_remember_email')
                }
            }

            setSuccess(mode === 'login' ? 'Welcome back! Redirecting…' : 'Account created! Redirecting…')
            setTimeout(() => {
                navigate(userData.role === 'seller' ? '/dashboard/seller' : '/dashboard/customer', { replace: true })
            }, 900)
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || 'Something went wrong.')
        } finally { setLoading(false) }
    }

    return (
        <div className={`min-h-screen flex items-center justify-center font-['Inter'] p-4 sm:p-6 md:p-8 relative overflow-hidden transition-colors duration-300 ${isDark ? 'theme-dark' : ''}`} 
             style={{ background: isDark ? 'var(--bg-right-panel)' : 'linear-gradient(135deg, #FAF7F5 0%, #F5EBE6 100%)' }}>
            
            {/* Clean subtle background grid patterns with reduced 25% opacity */}
            <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none" />
            
            {/* Ambient gold/navy blurred background highlights */}
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#8D5A2B]/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#24324A]/5 blur-3xl pointer-events-none" />

            {/* Ambient Plant Twigs Illustration (Bottom Left) */}
            <div className="absolute bottom-0 left-0 p-8 pointer-events-none hidden xl:block z-10 opacity-75">
                <svg width="120" height="240" viewBox="0 0 120 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 60 140 Q 30 90 20 60" stroke="#5C685A" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 60 140 Q 80 80 90 50" stroke="#5C685A" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 60 140 Q 55 60 50 20" stroke="#5C685A" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 20 60 C 15 50 20 40 30 45 C 35 50 30 60 20 60 Z" fill="#7A8A75" opacity="0.8" />
                    <path d="M 90 50 C 95 40 100 45 95 55 C 90 60 85 55 90 50 Z" fill="#7A8A75" opacity="0.8" />
                    <path d="M 50 20 C 45 10 55 10 55 20 C 55 25 50 25 50 20 Z" fill="#7A8A75" opacity="0.8" />
                    <path d="M 35 80 C 30 75 35 70 42 75 C 45 80 40 85 35 80 Z" fill="#7A8A75" opacity="0.8" />
                    <path d="M 78 70 C 82 65 85 70 82 78 C 78 82 75 78 78 70 Z" fill="#7A8A75" opacity="0.8" />
                    <path d="M 45 140 C 45 135 75 135 75 140 L 78 160 C 85 180 85 210 75 225 C 68 232 52 232 45 225 C 35 210 35 180 42 160 Z" fill="#7D6F61" stroke="#685B50" strokeWidth="1" />
                    <ellipse cx="60" cy="140" rx="15" ry="3" fill="#5E5347" />
                </svg>
            </div>

            {/* Global Theme Toggle (Accessible on all screen sizes) */}
            <button 
                onClick={() => setIsDark(!isDark)} 
                className="absolute top-6 right-6 h-9 w-9 rounded-xl flex items-center justify-center border hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer z-30 shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
                style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
            >
                {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* The unified premium SaaS dual-panel card */}
            <div className="w-full max-w-[1100px] min-h-[660px] rounded-2xl flex flex-col md:flex-row overflow-hidden border shadow-2xl relative z-10 transition-colors duration-300"
                 style={{ backgroundColor: 'var(--bg-right-panel)', borderColor: 'var(--card-border)' }}>
                
                {/* ═══════════════════════════════════════════
                    LEFT PANEL — Branding & Dashboard Mockup Visual (50%)
                ════════════════════════════════════════════ */}
                <div className="hidden md:flex md:w-1/2 relative flex-col overflow-hidden justify-between p-10 lg:p-12 border-r bg-cover bg-no-repeat bg-center"
                    style={{ 
                        backgroundImage: isDark ? 'none' : `linear-gradient(rgba(247, 242, 238, 0.45), rgba(247, 242, 238, 0.45)), url(${loginBg})`, 
                        backgroundColor: 'var(--bg-left-panel)',
                        borderColor: 'var(--card-border)' 
                    }}>
                    
                    {/* Grid pattern overlay inside panel */}
                    <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

                    {/* ── Brand Header ── */}
                    <div className="relative z-10 flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-[#FFFFFF] border border-[#EBE3DE] shadow-sm">
                                <svg className="h-5 w-5 text-[#8D5A2B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                    <line x1="12" y1="22.08" x2="12" y2="12" />
                                </svg>
                            </div>
                            <div>
                                <div className="font-['Outfit'] text-xl font-bold tracking-tight" style={{ color: '#1F1F1F' }}>
                                    VenderFlow
                                </div>
                                <div className="text-[8px] font-black tracking-[0.2em] uppercase" style={{ color: '#8D5A2B' }}>
                                    PREMIUM COMMERCE PLATFORM
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Middle Hero & HTML/CSS Dashboard Mockup ── */}
                    <div className="relative z-10 flex-1 flex flex-col justify-center my-6">
                        <div className="max-w-md mb-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 w-fit text-[9px] font-bold tracking-wider uppercase bg-[#F3ECE6] border border-[#EBE3DE]"
                                style={{ color: '#8D5A2B' }}>
                                ENTERPRISE ORDER & VENDOR PORTAL
                            </div>

                            <h1 className="font-['Outfit'] text-4xl lg:text-[2.75rem] font-extrabold tracking-tight mb-3 leading-[1.12]" style={{ color: '#1F1F1F' }}>
                                Powering <br />
                                Modern <span style={{ color: '#8D5A2B' }}>Commerce.</span>
                            </h1>

                            <p className="text-xs lg:text-sm leading-relaxed font-medium" style={{ color: '#5F5F5F' }}>
                                Manage orders, vendors, inventory, customers and analytics from one unified platform.
                            </p>
                        </div>

                        {/* Inline Feature Icons */}
                        <div className="grid grid-cols-4 gap-2 mb-6">
                            {[
                                { icon: Users, title: 'Multi-Vendor', desc: 'Management' },
                                { icon: BarChart3, title: 'Real-time', desc: 'Analytics' },
                                { icon: Shield, title: 'Secure', desc: 'Payments' },
                                { icon: Truck, title: 'Smart Order', desc: 'Tracking' }
                            ].map(({ icon: Icon, title, desc }, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/70 border border-[#EBE3DE]/50 shadow-sm backdrop-blur-sm">
                                    <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-[#FAF6F2] border border-[#EBE3DE] shrink-0">
                                        <Icon className="h-3.5 w-3.5" style={{ color: '#8D5A2B' }} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[8px] font-bold leading-tight" style={{ color: '#1F1F1F' }}>{title}</div>
                                        <div className="text-[7px] font-semibold leading-tight text-slate-400">{desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* High-Fidelity HTML/CSS/SVG Overview Dashboard Widget Mockup */}
                        <div className="w-full bg-white rounded-2xl border border-[#EBE3DE] shadow-xl p-4 relative overflow-hidden">
                            {/* Dashboard Header Bar */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                                <div className="flex items-center gap-1.5 font-bold text-xs" style={{ color: '#1F1F1F' }}>
                                    <span className="h-2 w-2 rounded-full bg-[#8D5A2B] animate-pulse" />
                                    Overview
                                </div>
                                <div className="text-[9px] font-bold px-2 py-0.5 rounded-md border border-[#EBE3DE] bg-[#FAF9F7] cursor-pointer" style={{ color: '#5F5F5F' }}>
                                    This Week
                                </div>
                            </div>

                            {/* Cards Grid */}
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {[
                                    { label: 'Revenue', val: '$12,450', percent: '↑ 22.4%' },
                                    { label: 'Orders', val: '142', percent: '↑ 18.6%' },
                                    { label: 'Active Vendors', val: '1,942', percent: '↑ 12.6%' },
                                    { label: 'Products Listed', val: '48,210', percent: '↑ 16.3%' }
                                ].map(({ label, val, percent }, idx) => (
                                    <div key={idx} className="bg-[#FAF9F7] border border-[#EBE3DE]/60 rounded-xl p-2">
                                        <div className="text-[8px] font-semibold text-slate-400 truncate">{label}</div>
                                        <div className="text-xs font-black mt-0.5" style={{ color: '#1F1F1F' }}>{val}</div>
                                        <div className="text-[7px] font-bold text-emerald-600 mt-0.5 flex items-center gap-0.5">{percent}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Left Chart card */}
                                <div className="border border-slate-100 rounded-xl p-2.5 bg-white">
                                    <div className="text-[8px] font-bold text-slate-400 mb-1">Revenue Trend</div>
                                    <svg viewBox="0 0 160 80" className="w-full">
                                        <defs>
                                            <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#8D5A2B" stopOpacity="0.15" />
                                                <stop offset="100%" stopColor="#8D5A2B" stopOpacity="0.0" />
                                            </linearGradient>
                                        </defs>
                                        <line x1="0" y1="20" x2="160" y2="20" stroke="#FAF8F5" strokeWidth="1" />
                                        <line x1="0" y1="40" x2="160" y2="40" stroke="#FAF8F5" strokeWidth="1" />
                                        <line x1="0" y1="60" x2="160" y2="60" stroke="#FAF8F5" strokeWidth="1" />
                                        <path d="M 0 65 Q 25 50 50 55 T 100 40 T 150 25 L 150 80 L 0 80 Z" fill="url(#chart-fill)" />
                                        <path d="M 0 65 Q 25 50 50 55 T 100 40 T 150 25" stroke="#8D5A2B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                                        <circle cx="150" cy="25" r="2.5" fill="#8D5A2B" />
                                    </svg>
                                    <div className="flex justify-between text-[7px] font-semibold text-slate-400 mt-1.5 px-0.5">
                                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                    </div>
                                </div>

                                {/* Right Orders list card */}
                                <div className="border border-slate-100 rounded-xl p-2.5 bg-white">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="text-[8px] font-bold text-slate-400">Recent Orders</div>
                                        <div className="text-[8px] font-bold text-[#8D5A2B] cursor-pointer hover:underline">View all</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        {[
                                            { id: '#ORD-12543', store: 'TechStore', tag: 'Delivered', style: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                                            { id: '#ORD-12542', store: 'GadgetHub', tag: 'In Transit', style: 'bg-amber-50 text-amber-600 border-amber-100' },
                                            { id: '#ORD-12541', store: 'FashionWorld', tag: 'Processing', style: 'bg-blue-50 text-blue-600 border-blue-100' }
                                        ].map(({ id, store, tag, style }, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-[8px] border-b border-slate-50 pb-1 last:border-b-0 last:pb-0">
                                                <div className="flex items-center gap-1">
                                                    <User className="h-2.5 w-2.5 text-slate-400" />
                                                    <span className="font-bold text-slate-600">{id}</span>
                                                </div>
                                                <div className="text-slate-400 truncate max-w-[40px]">{store}</div>
                                                <div className={`px-1 rounded font-bold border text-[7px] ${style}`}>{tag}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Left Footer Shelf trust metrics ── */}
                    <div className="relative z-10 pt-6 border-t mt-4" style={{ borderColor: 'var(--card-border)' }}>
                        <div className="grid grid-cols-4 gap-2 text-center">
                            {[
                                { val: '10,000+', label: 'Orders Managed', icon: ShoppingBag },
                                { val: '500+', label: 'Vendors Connected', icon: Users },
                                { val: '99.9%', label: 'Uptime Guarantee', icon: ShieldCheck },
                                { val: '24/7', label: 'Expert Support', icon: Headphones }
                            ].map(({ val, label, icon: Icon }, idx) => (
                                <div 
                                    key={idx}
                                    className="p-2.5 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-default select-none bg-[#FAF9F6] border-[#EBE3DE] shadow-[0_4px_6px_-1px_rgba(31,31,31,0.02),0_2px_4px_-1px_rgba(31,31,31,0.01)]"
                                >
                                    <div className="h-6 w-6 mx-auto rounded-lg flex items-center justify-center bg-[#FAF6F2] border border-[#EBE3DE] mb-1">
                                        <Icon className="h-3.5 w-3.5 text-[#8D5A2B]" />
                                    </div>
                                    <div className="text-xs font-black tracking-tight" style={{ color: '#1F1F1F' }}>
                                        {val}
                                    </div>
                                    <div className="text-[7px] font-bold uppercase tracking-wider text-slate-400 mt-0.5 leading-none">
                                        {label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════
                    RIGHT PANEL — Auth Form (50%)
                ════════════════════════════════════════════ */}
                <div className="w-full md:w-1/2 flex flex-col justify-center relative overflow-y-auto p-6 sm:p-10 lg:p-14" style={{ backgroundColor: 'var(--bg-right-panel)' }}>
                    
                    {/* Back Button */}
                    <button 
                        onClick={() => navigate(-1)} 
                        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-1.5 text-xs font-bold hover:opacity-85 transition-all cursor-pointer z-20"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        <ArrowLeft className="h-3.5 w-3.5" /> Back
                    </button>

                    <div className="w-full max-w-[400px] mx-auto py-6">

                        {/* ── Main Form Card (Elevated Soft Mockup) ── */}
                        <div className="rounded-3xl p-6 md:p-8 luxury-card" style={{ backgroundColor: '#FFFFFF', borderColor: '#EBE3DE' }}>
                            
                            {/* Role selection tab bar */}
                            <div className="flex p-1 bg-[#F4EDE7] rounded-xl mb-8 border border-[#EBE3DE]">
                                <button
                                    type="button"
                                    onClick={() => setRole('customer')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                                        !isSeller 
                                            ? 'bg-white text-[#8D5A2B] shadow-sm border-b-2 border-[#8D5A2B]' 
                                            : 'text-[#8A8A8A] hover:text-[#5F5F5F]'
                                    }`}
                                >
                                    <User className="h-4 w-4" />
                                    Customer Portal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('seller')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                                        isSeller 
                                            ? 'bg-white text-[#8D5A2B] shadow-sm border-b-2 border-[#8D5A2B]' 
                                            : 'text-[#8A8A8A] hover:text-[#5F5F5F]'
                                    }`}
                                >
                                    <Building2 className="h-4 w-4" />
                                    Seller Console
                                </button>
                            </div>

                            {/* Welcome Header */}
                            <div className="mb-6">
                                <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-black tracking-tight" style={{ color: '#1F1F1F' }}>
                                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                                </h1>
                                <p className="text-xs font-semibold mt-1" style={{ color: '#5F5F5F' }}>
                                    {mode === 'login' 
                                        ? 'Sign in to access your account and manage your business.' 
                                        : 'Register to get started with VenderFlow.'}
                                </p>
                            </div>

                            {/* Alerts */}
                            {error && (
                                <div className="mb-4 flex items-start gap-2.5 px-4 py-3 rounded-lg text-xs font-semibold animate-fade-in"
                                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', color: '#EF4444' }}>
                                    <AlertCircle className="h-4.5 w-4.5 shrink-0" /> {error}
                                </div>
                            )}
                            {success && (
                                <div className="mb-4 flex items-start gap-2.5 px-4 py-3 rounded-lg text-xs font-semibold animate-fade-in"
                                    style={{ background: 'var(--gold-bg-pill)', border: '1px solid var(--gold-border-pill)', color: 'var(--gold-accent)' }}>
                                    <CheckCircle className="h-4.5 w-4.5 shrink-0" /> {success}
                                </div>
                            )}

                            {/* Form Body */}
                            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                
                                {/* Full Name (Only for Register Mode) */}
                                {mode === 'register' && (
                                    <div className="animate-fade-in-up">
                                        <label className="block text-xs font-bold mb-1.5" style={{ color: '#3F3F3F' }}>Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                                            <input 
                                                id="input-name" 
                                                type="text" 
                                                name="name" 
                                                value={form.name} 
                                                onChange={handleChange}
                                                placeholder="Dhruva Tajapara" 
                                                className="w-full luxury-input rounded-lg pl-10 pr-4 py-2.5 text-sm" 
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Email Address */}
                                <div>
                                    <label className="block text-xs font-bold mb-1.5" style={{ color: '#3F3F3F' }}>Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                                        <input 
                                            id="input-email" 
                                            type="email" 
                                            name="email" 
                                            value={form.email} 
                                            onChange={handleChange}
                                            placeholder="you@example.com" 
                                            className="w-full luxury-input rounded-lg pl-10 pr-4 py-2.5 text-sm" 
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-xs font-bold mb-1.5" style={{ color: '#3F3F3F' }}>Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                                        <input 
                                            id="input-password" 
                                            type={showPass ? 'text' : 'password'} 
                                            name="password" 
                                            value={form.password} 
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                            className="w-full luxury-input rounded-lg pl-10 pr-10 py-2.5 text-sm" 
                                        />
                                        <button 
                                            type="button" 
                                            tabIndex={-1} 
                                            onClick={() => setShowPass(v => !v)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors hover:opacity-80 cursor-pointer"
                                            style={{ color: 'var(--text-muted)' }}
                                        >
                                            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    
                                    {/* Password Strength Meter (Only for Register Mode) */}
                                    {mode === 'register' && form.password && (
                                        <div className="mt-2 space-y-1 animate-fade-in">
                                            <div className="flex justify-between items-center text-[10px] font-bold">
                                                <span style={{ color: '#5F5F5F' }}>Password Strength:</span>
                                                <span style={{ color: getPasswordStrength(form.password).colorHex }}>
                                                    {getPasswordStrength(form.password).text}
                                                </span>
                                            </div>
                                            <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full transition-all duration-300 ${getPasswordStrength(form.password).color} ${getPasswordStrength(form.password).width}`} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password (Only for Register Mode) */}
                                {mode === 'register' && (
                                    <div className="animate-fade-in-up">
                                        <label className="block text-xs font-bold mb-1.5" style={{ color: '#3F3F3F' }}>Confirm Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                                            <input 
                                                id="input-confirm-password" 
                                                type={showConfirm ? 'text' : 'password'} 
                                                name="confirmPassword" 
                                                value={form.confirmPassword} 
                                                onChange={handleChange}
                                                placeholder="Confirm your password"
                                                className="w-full luxury-input rounded-lg pl-10 pr-10 py-2.5 text-sm" 
                                            />
                                            <button 
                                                type="button" 
                                                tabIndex={-1} 
                                                onClick={() => setShowConfirm(v => !v)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors hover:opacity-80 cursor-pointer"
                                                style={{ color: 'var(--text-muted)' }}
                                            >
                                                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Remember Me and Forgot Password (Only for Login Mode) */}
                                {mode === 'login' && (
                                    <div className="flex items-center justify-between mt-1 text-xs">
                                        <label className="flex items-center gap-2 font-semibold cursor-pointer select-none" style={{ color: '#5F5F5F' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={rememberMe} 
                                                onChange={e => setRememberMe(e.target.checked)}
                                                className="rounded border-slate-300 text-[var(--gold-accent)] focus:ring-[var(--gold-accent)] h-3.5 w-3.5 cursor-pointer"
                                            />
                                            Remember me
                                        </label>
                                        <button 
                                            type="button" 
                                            className="font-bold transition-colors cursor-pointer"
                                            style={{ color: '#8D5A2B' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#744A21'}
                                            onMouseLeave={e => e.currentTarget.style.color = '#8D5A2B'}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                )}

                                {/* Account Type Selector (Only for Register Mode) */}
                                {mode === 'register' && (
                                    <div className="animate-fade-in-up pt-1">
                                        <label className="block text-xs font-bold mb-1.5" style={{ color: '#3F3F3F' }}>Account Type</label>
                                        <div className="flex gap-2">
                                            <button 
                                                type="button" 
                                                onClick={() => setRole('customer')}
                                                className="flex-1 py-2 px-3 rounded-lg border text-xs font-bold transition-all duration-200 cursor-pointer"
                                                style={{
                                                    borderColor: !isSeller ? 'var(--gold-accent)' : 'var(--card-border)',
                                                    backgroundColor: !isSeller ? 'var(--gold-bg-pill)' : 'transparent',
                                                    color: !isSeller ? 'var(--gold-accent)' : 'var(--text-muted)'
                                                }}
                                            >
                                                Customer Console
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => setRole('seller')}
                                                className="flex-1 py-2 px-3 rounded-lg border text-xs font-bold transition-all duration-200 cursor-pointer"
                                                style={{
                                                    borderColor: isSeller ? 'var(--gold-accent)' : 'var(--card-border)',
                                                    backgroundColor: isSeller ? 'var(--gold-bg-pill)' : 'transparent',
                                                    color: isSeller ? 'var(--gold-accent)' : 'var(--text-muted)'
                                                }}
                                            >
                                                Seller Console
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button 
                                    id="btn-submit" 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-200 mt-2 btn-gold cursor-pointer"
                                >
                                    {loading ? (
                                        <><Loader2 className="h-4.5 w-4.5 animate-spin" /> Processing…</>
                                    ) : (
                                        <>
                                            <span>{mode === 'login' ? 'Sign In to VenderFlow' : 'Register Account'}</span>
                                            <ArrowRight className="h-4.5 w-4.5" /> 
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="flex items-center gap-4 my-5 animate-fade-in">
                                <div className="flex-1 h-px" style={{ background: 'var(--card-border)' }} />
                                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Or continue with</span>
                                <div className="flex-1 h-px" style={{ background: 'var(--card-border)' }} />
                            </div>

                            {/* Social Buttons (Google & Apple) */}
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <button 
                                    type="button"
                                    className="flex items-center justify-center gap-2.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 border hover:-translate-y-0.5 hover:shadow-sm bg-white hover:bg-slate-50/80 cursor-pointer"
                                    style={{ borderColor: '#E5E7EB', color: '#1F1F1F' }}
                                >
                                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                                    </svg>
                                    Google
                                </button>

                                <button 
                                    type="button"
                                    className="flex items-center justify-center gap-2.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 border hover:-translate-y-0.5 hover:shadow-sm bg-white hover:bg-slate-50/80 cursor-pointer"
                                    style={{ borderColor: '#E5E7EB', color: '#1F1F1F' }}
                                >
                                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.1.09 2.27-.56 2.95-1.39z" />
                                    </svg>
                                    Apple
                                </button>
                            </div>

                            {/* Toggle bottom link */}
                            <div className="mt-6 text-center text-xs text-slate-500">
                                {mode === 'login' ? (
                                    <>
                                        Don't have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={() => { setMode('register'); setError(''); setSuccess('') }}
                                            className="font-bold text-[#8D5A2B] hover:underline cursor-pointer"
                                        >
                                            Register for free
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                                            className="font-bold text-[#8D5A2B] hover:underline cursor-pointer"
                                        >
                                            Sign In
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel Footer trust indicators */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <div className="flex items-center gap-1">
                            <ShieldCheck className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <div>
                                <div className="font-bold text-slate-600">Enterprise Security</div>
                                <div className="text-[8px] text-slate-400 leading-none">Bank-level protection</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 border-x border-slate-100 px-3">
                            <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <div>
                                <div className="font-bold text-slate-600">End-to-end Encryption</div>
                                <div className="text-[8px] text-slate-400 leading-none">Your data is always safe</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <div>
                                <div className="font-bold text-slate-600">99.9% Uptime</div>
                                <div className="text-[8px] text-slate-400 leading-none">Reliable & always on</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
