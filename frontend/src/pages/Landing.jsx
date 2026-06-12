import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  ChevronDown, 
  Package, 
  BarChart3, 
  Users, 
  ShieldCheck, 
  Heart, 
  Timer, 
  Headset, 
  Calendar,
  Globe,
  Smartphone,
  Home,
  BookOpen,
  Scissors,
  Zap,
  Menu,
  X
} from 'lucide-react'

import heroDesk from '../assets/hero_desk.png'
import officeMeeting from '../assets/office_meeting.png'
import amitKumar from '../assets/amit_kumar.png'
import loginBg from '../assets/login_bg.png'

export default function Landing() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const testimonials = [
    {
      quote: "VenderFlow has completely transformed the way we manage our orders and vendors. The insights help us make smarter decisions every day.",
      author: "Amit Kumar",
      role: "Operations Manager, TechStore",
      avatar: amitKumar
    },
    {
      quote: "The multi-vendor features and bulk order processing saved our operations team over 25 hours every single week. Highly recommended!",
      author: "Siddharth Mehta",
      role: "Logistics Lead, GadgetHub",
      avatar: amitKumar
    },
    {
      quote: "Security and uptime are our top priorities. VenderFlow's enterprise architecture gives us full peace of mind at scale.",
      author: "Ritu Sharma",
      role: "CTO, FashionFiesta",
      avatar: amitKumar
    }
  ]

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="min-h-screen bg-[#FCFAF7] font-sans text-neutral-800 antialiased selection:bg-bronze-200 selection:text-bronze-800 relative grid-pattern">
      
      {/* Background Glows for visual depth */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-bronze-100/30 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[600px] left-[-200px] w-[600px] h-[600px] bg-gradient-to-tr from-forest-green/5 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-[200px] right-[-100px] w-[500px] h-[500px] bg-gradient-to-tl from-bronze-100/40 via-cream-300/20 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />

      {/* ── HEADER / NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-bronze-100/30 shadow-[0_2px_15px_-3px_rgba(141,90,43,0.03)] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white border border-bronze-200/80 shadow-sm transition-all duration-500 group-hover:border-bronze-500 group-hover:scale-105 group-hover:rotate-3">
              <svg className="w-5.5 h-5.5 text-bronze-500 transition-transform duration-500 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 22V12" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 12L2 7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 12L22 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="font-sans font-bold text-lg leading-none tracking-tight text-neutral-900 transition-colors group-hover:text-bronze-600">VenderFlow</div>
              <div className="text-[7.5px] font-extrabold tracking-[0.2em] uppercase text-bronze-500 mt-1">Enterprise Commerce</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="relative text-sm font-semibold text-neutral-600 hover:text-bronze-600 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-bronze-500 after:transition-all after:duration-300 hover:after:w-full">Features</a>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-semibold text-neutral-600 hover:text-bronze-600 transition-colors cursor-pointer duration-300">
                Solutions <ChevronDown className="w-4 h-4 opacity-70 transition-transform duration-300 group-hover:rotate-180" />
              </button>
            </div>
            <a href="#pricing" className="relative text-sm font-semibold text-neutral-600 hover:text-bronze-600 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-bronze-500 after:transition-all after:duration-300 hover:after:w-full">Pricing</a>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-semibold text-neutral-600 hover:text-bronze-600 transition-colors cursor-pointer duration-300">
                Resources <ChevronDown className="w-4 h-4 opacity-70 transition-transform duration-300 group-hover:rotate-180" />
              </button>
            </div>
            <a href="#about" className="relative text-sm font-semibold text-neutral-600 hover:text-bronze-600 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-bronze-500 after:transition-all after:duration-300 hover:after:w-full">About</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/login" className="text-sm font-bold text-neutral-600 hover:text-bronze-600 transition-colors duration-300">Log in</Link>
            <Link 
              to="/login" 
              className="px-5 py-2.5 rounded-xl btn-gold text-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-600 hover:text-bronze-600 transition-colors duration-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-lg pt-24 px-6 border-b border-cream-200 animate-fade-in">
          <nav className="flex flex-col gap-6 text-lg font-bold text-neutral-800">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-bronze-600 transition-colors">Features</a>
            <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="hover:text-bronze-600 transition-colors">Solutions</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-bronze-600 transition-colors">Pricing</a>
            <a href="#resources" onClick={() => setMobileMenuOpen(false)} className="hover:text-bronze-600 transition-colors">Resources</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="hover:text-bronze-600 transition-colors">About</a>
            <hr className="border-cream-300" />
            <Link to="/login" className="hover:text-bronze-600 py-2 transition-colors">Log in</Link>
            <Link 
              to="/login" 
              className="w-full text-center py-3.5 rounded-xl btn-gold text-base transition-all duration-300"
            >
              Start Free Trial
            </Link>
          </nav>
        </div>
      )}

      {/* ── HERO SECTION ── */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 lg:pr-4">
            
            {/* Pill Accent */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-bronze-500/10 to-cream-300/35 border border-bronze-500/20 text-[10.5px] font-bold tracking-[0.08em] text-bronze-700 uppercase w-fit animate-fade-in shadow-sm hover:border-bronze-500/40 transition-all duration-300 hover:scale-[1.02] cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bronze-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-bronze-600"></span>
              </span>
              ENTERPRISE ORDER & VENDOR PORTAL
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.8rem] font-extrabold text-neutral-900 tracking-tight leading-[1.08] animate-fade-in">
              Your Orders.<br />
              <span className="gradient-text-gold">Your Insights.</span><br />
              <span className="font-serif italic font-normal relative inline-block group/flow text-bronze-750 pb-1">
                In Flow.
                <span className="absolute bottom-0 left-0 w-1/3 h-[3px] bg-gradient-to-r from-bronze-400 to-bronze-600 transition-all duration-500 group-hover/flow:w-full rounded-full" />
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-lg animate-fade-in animation-delay-100">
              Manage, analyze, and track <span className="font-semibold text-neutral-850">10,000+ orders</span> across products, customers, sellers, and categories — all in one powerful platform.
            </p>

            {/* Buttons Group */}
            <div className="flex flex-wrap gap-4 pt-2 animate-fade-in animation-delay-200">
              <Link 
                to="/login" 
                className="group/btn flex items-center gap-2.5 px-8 py-4 rounded-2xl animate-shimmer-sweep text-white font-bold transition-all duration-350 hover:shadow-xl hover:shadow-bronze-500/25 hover:-translate-y-0.5 active:translate-y-0"
              >
                Start Free Trial 
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
              <button 
                onClick={() => navigate('/login')}
                className="group/demo px-8 py-4 rounded-2xl border border-bronze-500/20 bg-white/40 backdrop-blur-sm text-neutral-800 hover:bg-white/80 hover:border-bronze-500/40 font-bold transition-all duration-350 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                View Live Demo
                <span className="w-1.5 h-1.5 rounded-full bg-bronze-500 group-hover/demo:scale-150 transition-transform duration-350"></span>
              </button>
            </div>

            {/* Checkmark benefits */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-6 border-t border-bronze-200/40 animate-fade-in animation-delay-300">
              {[
                "No credit card required",
                "14-day free trial",
                "Cancel anytime"
              ].map((benefit, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 text-xs font-bold text-neutral-700 bg-white/40 backdrop-blur-sm border border-bronze-200/30 px-4 py-2 rounded-xl transition-all duration-300 hover:border-bronze-500/30 hover:bg-white/80 hover:scale-[1.03] cursor-default shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-bronze-500 shrink-0 transition-transform duration-300 hover:scale-110" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image/Mockup Column */}
          <div className="lg:col-span-7 relative flex justify-center lg:justify-end px-4 hero-perspective">
            
            {/* Constrained layout wrapper for mockup elements */}
            <div className="relative w-full max-w-[480px] sm:max-w-[500px]">
              {/* Ambient glows behind mockup */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-bronze-500/20 via-forest-green/5 to-transparent blur-3xl pointer-events-none rounded-full -z-10 animate-live-pulse" />
              
              {/* Decorative offset frames */}
              <div className="absolute -inset-2 sm:-inset-4 rounded-[2rem] sm:rounded-[2.5rem] border border-bronze-300/30 -z-10 translate-x-4 translate-y-4 sm:translate-x-6 sm:translate-y-6 pointer-events-none transition-transform duration-500 hover:translate-x-3 hover:translate-y-3" />
              <div className="absolute -inset-2 sm:-inset-4 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-bronze-100/20 to-cream-200/40 -z-20 translate-x-4 translate-y-4 sm:translate-x-6 sm:translate-y-6 pointer-events-none shadow-sm" />

              {/* The Main Image Container with 3D Tilt */}
              <div className="hero-tilt-card relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border-[6px] sm:border-[8px] border-white shadow-[0_32px_64px_-16px_rgba(141,90,43,0.15)] bg-white group/hero-img transition-all duration-500 hover:shadow-[0_48px_90px_-20px_rgba(141,90,43,0.22)] animate-fade-in">
                <img 
                  src={heroDesk} 
                  alt="VenderFlow Dashboard Workspace Setup" 
                  className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover/hero-img:scale-[1.025]"
                />
                {/* Overlay Glass/Glow reflection sweep */}
                <div className="absolute inset-0 bg-gradient-to-t from-bronze-500/5 via-transparent to-transparent opacity-0 group-hover/hero-img:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/hero-img:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none" />
              </div>

              {/* Floating Glassmorphic Badges */}
              {/* Badge 1: Top-Left - Active Stats */}
              <div className="absolute top-8 -left-4 sm:-left-8 premium-glass p-3.5 sm:p-4 rounded-2xl shadow-2xl animate-float-slow hidden sm:flex items-center gap-3.5 transition-all duration-350 hover:scale-[1.08] hover:-rotate-1 cursor-default group/badge1">
                <div className="w-10 h-10 rounded-xl bg-forest-green/5 border border-forest-green/10 flex items-center justify-center text-forest-green group-hover/badge1:bg-emerald-600 group-hover/badge1:text-white transition-all duration-300">
                  <BarChart3 className="w-5 h-5 transition-transform duration-300 group-hover/badge1:rotate-3" />
                </div>
                <div>
                  <div className="text-[9.5px] font-extrabold tracking-wider text-neutral-450 uppercase">Live Sales</div>
                  <div className="font-bold text-sm text-neutral-905 leading-none mt-1">$48,290.15</div>
                  <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-600 mt-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    +12.4% today
                  </div>
                </div>
              </div>

              {/* Badge 2: Bottom-Right - Security / Status */}
              <div className="absolute bottom-8 -right-4 sm:-right-6 premium-glass p-3.5 sm:p-4 rounded-2xl shadow-2xl animate-float-medium hidden sm:flex items-center gap-3.5 transition-all duration-350 hover:scale-[1.08] hover:rotate-1 cursor-default group/badge2">
                <div className="w-10 h-10 rounded-xl bg-bronze-500/10 border border-bronze-500/20 flex items-center justify-center text-bronze-500 group-hover/badge2:bg-bronze-500 group-hover/badge2:text-white transition-all duration-300">
                  <ShieldCheck className="w-5 h-5 transition-transform duration-500 group-hover/badge2:scale-110 group-hover/badge2:rotate-[360deg]" />
                </div>
                <div>
                  <div className="text-[9.5px] font-extrabold tracking-wider text-neutral-450 uppercase">Security</div>
                  <div className="font-bold text-sm text-neutral-900 leading-none mt-1">Enterprise Grade</div>
                  <div className="text-[9px] font-semibold text-neutral-500 mt-1.5">SSL & Encrypted</div>
                </div>
              </div>

              {/* Decorative dot grids */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-[radial-gradient(#8d5a2b_1.5px,transparent_1.5px)] [background-size:8px_8px] opacity-40 -z-10 hidden sm:block animate-pulse duration-1000" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-[radial-gradient(#1b2e22_1.5px,transparent_1.5px)] [background-size:8px_8px] opacity-35 -z-10 hidden sm:block animate-pulse duration-1000" />
            </div>

          </div>

        </div>
      </section>

      {/* ── TRUSTED BY LOGOS SECTION ── */}
      <section className="py-14 border-t border-b border-bronze-200/25 bg-[#FCFAF7]/40 overflow-hidden relative">
        {/* Subtle horizontal grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(141,90,43,0.015)_1px,transparent_1px)] bg-[size:100%_8px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <p className="text-[9.5px] font-bold tracking-[0.3em] text-neutral-400 uppercase mb-8 cursor-default">
            TRUSTED BY GROWING BUSINESSES WORLDWIDE
          </p>
          
          <div className="relative w-full overflow-hidden">
            {/* Left and Right blur masks for premium fade-out effect */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FCFAF7] via-[#FCFAF7]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FCFAF7] via-[#FCFAF7]/80 to-transparent z-10 pointer-events-none" />
            
            <div className="flex animate-marquee gap-6 items-center hover:[animation-play-state:paused] py-2">
              {[...Array(2)].map((_, loopIdx) => (
                <div key={loopIdx} className="flex gap-6 shrink-0 items-center">
                  {[
                    { name: "TechStore", icon: Globe },
                    { name: "GadgetHub", icon: Smartphone },
                    { name: "HomeKart", icon: Home },
                    { name: "BookHaven", icon: BookOpen },
                    { name: "FashionFiesta", icon: Scissors },
                    { name: "ElectroMart", icon: Zap }
                  ].map((partner, idx) => (
                    <div 
                      key={`${loopIdx}-${idx}`} 
                      className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/50 backdrop-blur-md border border-bronze-200/35 shadow-[0_4px_15px_-4px_rgba(141,90,43,0.02)] transition-all duration-500 hover:bg-white/95 hover:border-bronze-500/40 hover:-translate-y-1 hover:shadow-[0_12px_24px_-8px_rgba(141,90,43,0.1)] group cursor-default"
                    >
                      <div className="w-8 h-8 rounded-xl bg-bronze-500/5 border border-bronze-500/10 flex items-center justify-center text-neutral-450 group-hover:bg-bronze-500 group-hover:text-white group-hover:border-bronze-500 transition-all duration-500 shadow-sm">
                        <partner.icon className="w-4 h-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
                      </div>
                      <span className="font-sans font-bold text-xs tracking-tight text-neutral-500 group-hover:text-neutral-900 transition-colors duration-300">
                        {partner.name}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── POWERFUL FEATURES SECTION ── */}
      <section id="features" className="py-28 border-t border-b border-bronze-200/20 bg-gradient-to-b from-[#FCFAF7] via-white/40 to-[#FCFAF7] relative overflow-hidden">
        {/* Soft floating background ambient lights */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-bronze-500/5 to-transparent blur-3xl rounded-full pointer-events-none -z-10 animate-live-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-bl from-forest-green/5 to-transparent blur-3xl rounded-full pointer-events-none -z-10 animate-float-medium" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-bronze-500/10 border border-bronze-500/25 text-[10px] font-bold tracking-wider text-bronze-700 uppercase cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-bronze-500 animate-pulse" />
              POWERFUL FEATURES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-neutral-900 tracking-tight leading-[1.15]">
              Everything you need to run your commerce operations <span className="font-serif italic font-normal gradient-text-gold">smoothly.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Package,
                title: "Smart Order Management",
                desc: "Create, update, and manage orders with advanced filtering, search, and bulk actions."
              },
              {
                icon: BarChart3,
                title: "Analytics & Reports",
                desc: "Real-time dashboards and insights to track revenue, orders, and performance."
              },
              {
                icon: Users,
                title: "Vendor & Customer Management",
                desc: "Organize vendors and customers with complete profiles and transaction history."
              },
              {
                icon: ShieldCheck,
                title: "Secure & Reliable",
                desc: "Enterprise-grade security, data encryption, and 99.9% uptime you can trust."
              }
            ].map((feat, idx) => (
              <div 
                key={idx} 
                className="group relative p-8 rounded-[2rem] bg-white/60 backdrop-blur-md border border-bronze-200/35 shadow-[0_15px_35px_-10px_rgba(141,90,43,0.04)] hover:border-bronze-500/40 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(141,90,43,0.12)] transition-all duration-500 flex flex-col justify-between cursor-default animate-fade-in"
              >
                {/* Accent gold corner tag on hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(141,90,43,0.08),transparent_60%)] rounded-tr-[2rem] pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                
                <div>
                  {/* Layered icon badge */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-bronze-500/10 to-cream-300/35 border border-bronze-500/20 flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:from-bronze-600 group-hover:to-bronze-500 group-hover:text-white shadow-sm">
                    <feat.icon className="w-5.5 h-5.5 text-bronze-600 transition-colors duration-500 group-hover:text-white group-hover:rotate-6" />
                  </div>
                  
                  <h3 className="font-extrabold text-neutral-900 text-lg mb-3 tracking-tight group-hover:text-bronze-700 transition-colors duration-300">
                    {feat.title}
                  </h3>
                  
                  <p className="text-sm text-neutral-500 leading-relaxed transition-colors duration-300 group-hover:text-neutral-750">
                    {feat.desc}
                  </p>
                </div>
                
                <Link 
                  to="/login" 
                  className="flex items-center gap-1.5 text-xs font-bold text-bronze-500 hover:text-bronze-700 transition-colors pt-8 group-hover:translate-x-1.5 transition-transform"
                >
                  Learn more <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── STATS RIBBON (DARK GREEN BANNER) ── */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="bg-forest-green/95 backdrop-blur-md text-white border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl shadow-forest-green/15 relative overflow-hidden">
          {/* Subtle glow decoration */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-bronze-500/10 blur-3xl pointer-events-none rounded-full" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-8 gap-x-4 items-center justify-center relative z-10">
            {[
              { icon: Calendar, num: "10,000+", label: "Orders Managed" },
              { icon: Users, num: "1,900+", label: "Active Sellers" },
              { icon: Heart, num: "1,000+", label: "Happy Customers" },
              { icon: Timer, num: "99.9%", label: "Uptime Guarantee" },
              { icon: Headset, num: "24/7", label: "Expert Support" }
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col items-center text-center px-4 transition-transform duration-300 hover:scale-105 ${
                  idx !== 4 ? "lg:border-r border-white/10" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-bronze-200 mb-4 transition-colors duration-300 hover:bg-bronze-500 hover:text-white shadow-sm">
                  <stat.icon className="w-4.5 h-4.5" />
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-none">
                  {stat.num}
                </span>
                <span className="text-[10px] font-extrabold text-neutral-400 mt-2.5 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE SPLIT DETAILS & TESTIMONIAL SECTION ── */}
      <section className="py-12 border-t border-bronze-200/20 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Details + Meeting Photo */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold tracking-[0.2em] text-bronze-500 uppercase">
                BUILT FOR SCALE. DESIGNED FOR CLARITY.
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                Make <span className="font-serif italic font-normal gradient-text-gold">smarter</span> decisions with real-time insights
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              {[
                "Role-based access control",
                "Real-time data & analytics",
                "Cloud-based & always up-to-date",
                "Instant vendor notification sync"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm font-bold text-neutral-700 bg-white border border-bronze-100/50 px-4 py-3 rounded-xl shadow-sm hover:border-bronze-300 transition-colors duration-300">
                  <CheckCircle2 className="w-5 h-5 text-bronze-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <div>
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl btn-gold text-white font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                Explore All Features <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-4 relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-bronze-500/10 to-transparent blur-md opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <img 
                src={officeMeeting} 
                alt="Modern collaborative meeting room" 
                className="w-full rounded-2xl shadow-lg border border-bronze-150/40 object-cover max-h-[360px] relative z-10"
              />
            </div>
          </div>

          {/* Right Column - Client Testimonial Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-bronze-50/50 border border-bronze-200/50 backdrop-blur-md rounded-[2rem] p-8 sm:p-10 shadow-[0_20px_45px_-10px_rgba(141,90,43,0.05)] relative flex flex-col justify-between min-h-[420px] transition-all duration-300 hover:border-bronze-300">
              <div key={activeTestimonial} className="animate-fade-in">
                {/* Large quotes SVG background */}
                <div className="text-7xl font-serif text-bronze-500/20 leading-none select-none -mb-4">“</div>
                <blockquote className="text-neutral-700 text-base sm:text-lg leading-relaxed font-semibold italic">
                  {testimonials[activeTestimonial].quote}
                </blockquote>
              </div>

              {/* Author & controls section */}
              <div className="pt-8 border-t border-bronze-200/20 mt-8">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-3">
                    <img 
                      src={testimonials[activeTestimonial].avatar} 
                      alt={testimonials[activeTestimonial].author}
                      className="w-11 h-11 rounded-full border-2 border-white shadow-sm object-cover"
                    />
                    <div>
                      <div className="font-bold text-neutral-900 text-sm leading-tight">
                        {testimonials[activeTestimonial].author}
                      </div>
                      <div className="text-xs text-neutral-500 font-semibold mt-0.5">
                        {testimonials[activeTestimonial].role}
                      </div>
                    </div>
                  </div>

                  {/* Carousel navigation buttons */}
                  <div className="flex gap-2">
                    <button 
                      onClick={handlePrevTestimonial}
                      className="w-9 h-9 rounded-full border border-bronze-500/20 hover:border-bronze-500/50 hover:bg-bronze-500 hover:text-white flex items-center justify-center text-bronze-600 transition-all duration-300 hover:scale-105 active:scale-95 bg-white shadow-sm cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleNextTestimonial}
                      className="w-9 h-9 rounded-full border border-bronze-500/20 hover:border-bronze-500/50 hover:bg-bronze-500 hover:text-white flex items-center justify-center text-bronze-600 transition-all duration-300 hover:scale-105 active:scale-95 bg-white shadow-sm cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Dot Indicators */}
                <div className="flex gap-1.5 mt-6 justify-center lg:justify-start">
                  {testimonials.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveTestimonial(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        activeTestimonial === idx 
                          ? "bg-bronze-500 w-6" 
                          : "bg-bronze-200 hover:bg-bronze-500/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── CTA BANNER (DARK GREEN BANNER) ── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-forest-green text-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-forest-green/15 grid grid-cols-1 md:grid-cols-12 items-center border border-white/5 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(141,90,43,0.15),transparent_60%)] pointer-events-none" />
          
          {/* Left Text Column */}
          <div className="p-8 sm:p-12 md:p-14 lg:p-16 md:col-span-7 space-y-6 relative z-10">
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-bronze-200 uppercase">
              READY TO GET STARTED?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Take control of your commerce operations today.
            </h2>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link 
                to="/login" 
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl btn-gold text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-bronze-500/20 hover:-translate-y-0.5 active:translate-y-0"
              >
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                onClick={() => navigate('/login')}
                className="px-7 py-3.5 rounded-xl border border-white/20 hover:border-white/40 text-white hover:bg-white/10 font-bold transition-all duration-300 hover:-translate-y-0.5"
              >
                View Live Demo
              </button>
            </div>
            
            {/* Checks list */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-neutral-300 pt-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-bronze-200" />
                No credit card required
              </div>
              <span className="hidden sm:inline text-white/20">|</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-bronze-200" />
                14-day free trial
              </div>
              <span className="hidden sm:inline text-white/20">|</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-bronze-200" />
                Cancel anytime
              </div>
            </div>
          </div>

          {/* Right Image/Mockup Column */}
          <div className="md:col-span-5 h-full relative min-h-[240px] md:min-h-full self-stretch">
            <img 
              src={loginBg} 
              alt="Workspace desk setup with ambient warm lamp" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-lighten opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-forest-green via-forest-green/20 to-transparent" />
          </div>

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#FAF8F5] border-t border-bronze-200/30 pt-20 pb-8 text-neutral-600 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
          
          {/* Brand Col */}
          <div className="sm:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-bronze-200 shadow-sm transition-transform duration-350 group-hover:scale-105 group-hover:rotate-3">
                <svg className="w-4.5 h-4.5 text-bronze-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2L2 7V17L12 22L22 17V7L12 2z" />
                  <path d="M12 22V12" />
                  <path d="M12 12L2 7" />
                  <path d="M12 12L22 7" />
                </svg>
              </div>
              <span className="font-sans font-bold text-base tracking-tight text-neutral-900 group-hover:text-bronze-600 transition-colors">VenderFlow</span>
            </Link>
            <p className="text-xs text-neutral-500 font-semibold max-w-[200px]">
              Your orders. Your insights. In Flow.
            </p>
            {/* Social icons */}
            <div className="flex gap-4 pt-2">
              {[
                { icon: (props) => (
                  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                ), url: "https://linkedin.com" },
                { icon: (props) => (
                  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                ), url: "https://twitter.com" },
                { icon: (props) => (
                  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                ), url: "https://facebook.com" },
                { icon: (props) => (
                  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                ), url: "https://github.com" }
              ].map((soc, idx) => (
                <a 
                  key={idx} 
                  href={soc.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-8 h-8 rounded-lg border border-bronze-200/50 bg-white/60 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-bronze-500 hover:border-bronze-500 transition-all duration-300 hover:scale-110 shadow-sm"
                >
                  <soc.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Col */}
          <div className="space-y-4">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link to="/login" className="hover:text-bronze-500 hover:translate-x-1 transition-all duration-300 inline-block">Features</Link></li>
              <li><Link to="/login" className="hover:text-bronze-500 hover:translate-x-1 transition-all duration-300 inline-block">Pricing</Link></li>
              <li><Link to="/login" className="hover:text-bronze-500 hover:translate-x-1 transition-all duration-300 inline-block">Integrations</Link></li>
              <li><Link to="/login" className="hover:text-bronze-500 hover:translate-x-1 transition-all duration-300 inline-block">Changelog</Link></li>
            </ul>
          </div>

          {/* Solutions Col */}
          <div className="space-y-4">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link to="/login" className="hover:text-bronze-500 hover:translate-x-1 transition-all duration-300 inline-block">Order Management</Link></li>
              <li><Link to="/login" className="hover:text-bronze-500 hover:translate-x-1 transition-all duration-300 inline-block">Analytics</Link></li>
              <li><Link to="/login" className="hover:text-bronze-500 hover:translate-x-1 transition-all duration-300 inline-block">Vendor Management</Link></li>
              <li><Link to="/login" className="hover:text-bronze-500 hover:translate-x-1 transition-all duration-300 inline-block">Inventory</Link></li>
            </ul>
          </div>

          {/* Resources Col */}
          <div className="space-y-4">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><a href="#docs" className="hover:text-bronze-500 hover:translate-x-1 transition-all duration-300 inline-block">Documentation</a></li>
              <li><a href="#api" className="hover:text-bronze-500 hover:translate-x-1 transition-all duration-300 inline-block">API Reference</a></li>
              <li><a href="#blog" className="hover:text-bronze-500 hover:translate-x-1 transition-all duration-300 inline-block">Blog</a></li>
              <li><a href="#help" className="hover:text-bronze-500 hover:translate-x-1 transition-all duration-300 inline-block">Help Center</a></li>
            </ul>
          </div>

          {/* Company Col */}
          <div className="space-y-4">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><a href="#about" className="hover:text-bronze-500 hover:translate-x-1 transition-all duration-300 inline-block">About Us</a></li>
              <li><a href="#careers" className="hover:text-bronze-500 hover:translate-x-1 transition-all duration-300 inline-block">Careers</a></li>
              <li><a href="#contact" className="hover:text-bronze-500 hover:translate-x-1 transition-all duration-300 inline-block">Contact Us</a></li>
              <li><a href="#privacy" className="hover:text-bronze-500 hover:translate-x-1 transition-all duration-300 inline-block">Privacy Policy</a></li>
            </ul>
          </div>

        </div>

        {/* Footer Newsletter Banner */}
        <div className="max-w-7xl mx-auto px-6 border-t border-bronze-200/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left max-w-sm">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">Newsletter</h4>
            <p className="text-xs text-neutral-500 font-semibold">
              Get the latest updates and insights delivered to your inbox.
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex w-full max-w-md border border-bronze-200/50 rounded-xl overflow-hidden bg-white shadow-md focus-within:ring-2 focus-within:ring-bronze-500/20 transition-all duration-300">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow px-4 py-3 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none bg-transparent"
            />
            <button 
              type="submit" 
              className="px-6 bg-gradient-to-r from-bronze-600 to-bronze-500 hover:from-bronze-700 hover:to-bronze-600 text-white font-bold text-sm transition-colors shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Copyright and links */}
        <div className="max-w-7xl mx-auto px-6 border-t border-bronze-200/30 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-neutral-400">
          <span>© 2026 VenderFlow. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-neutral-600 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-neutral-600 transition-colors">Terms of Service</a>
            <a href="#cookies" className="hover:text-neutral-600 transition-colors">Cookies</a>
          </div>
        </div>

      </footer>

    </div>
  )
}
