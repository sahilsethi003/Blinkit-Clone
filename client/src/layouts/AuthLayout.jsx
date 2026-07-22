import React from 'react'
import { Link } from 'react-router-dom'
import { FaBolt, FaShieldHalved, FaBasketShopping, FaLeaf, FaStar } from 'react-icons/fa6'

const AuthLayout = ({ children, title, subtitle, showBackTo = "/", backToLabel = "Home" }) => {
  return (
    <div className='relative w-full min-h-screen flex items-center justify-center bg-slate-50/70 font-sans py-4 sm:py-6 px-4 selection:bg-secondary-200 selection:text-white overflow-hidden'>
      
      {/** 1. Multi-layered Ambient Light Gradient Orbs */}
      <div className='absolute -top-36 -left-36 w-[550px] h-[550px] rounded-full bg-emerald-200/45 blur-[120px] animate-pulse pointer-events-none' style={{ animationDuration: '8s' }}></div>
      <div className='absolute -bottom-36 -right-36 w-[600px] h-[600px] rounded-full bg-amber-200/40 blur-[130px] animate-pulse pointer-events-none' style={{ animationDuration: '10s' }}></div>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-teal-100/30 blur-[150px] pointer-events-none'></div>

      {/** 2. Geometric Dot Grid Pattern Overlay */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none'></div>

      {/** 3. Floating Light Decorative Grocery & Feature Badges (Desktop View) */}
      <div className='hidden lg:block pointer-events-none select-none'>
        {/** Top-Left Badge */}
        <div className='absolute top-10 left-10 bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-3.5 shadow-[0_15px_30px_-10px_rgba(12,131,31,0.15)] flex items-center gap-3 animate-bounce' style={{ animationDuration: '6s' }}>
          <div className='w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-secondary-200 shadow-inner'>
            <FaBolt size={18} />
          </div>
          <div>
            <p className='text-[11px] font-black text-slate-800 tracking-tight uppercase'>Superfast Delivery</p>
            <p className='text-[10px] font-bold text-secondary-200'>Fresh at your doorstep in 10 mins</p>
          </div>
        </div>

        {/** Bottom-Left Badge */}
        <div className='absolute bottom-10 left-12 bg-white/90 backdrop-blur-xl border border-amber-100 rounded-2xl p-3.5 shadow-[0_15px_30px_-10px_rgba(255,191,0,0.2)] flex items-center gap-3 animate-bounce' style={{ animationDuration: '7s', animationDelay: '1s' }}>
          <div className='w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-500 shadow-inner'>
            <FaBasketShopping size={18} />
          </div>
          <div>
            <div className='flex items-center gap-1 text-amber-400 text-[10px]'>
              <FaStar size={9} /><FaStar size={9} /><FaStar size={9} /><FaStar size={9} /><FaStar size={9} />
            </div>
            <p className='text-[10px] font-bold text-slate-600 mt-0.5'>50,000+ Happy Orders Delivered</p>
          </div>
        </div>

        {/** Top-Right Badge */}
        <div className='absolute top-12 right-12 bg-white/90 backdrop-blur-xl border border-teal-100 rounded-2xl p-3.5 shadow-[0_15px_30px_-10px_rgba(20,184,166,0.15)] flex items-center gap-3 animate-bounce' style={{ animationDuration: '8s', animationDelay: '2s' }}>
          <div className='w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600 shadow-inner'>
            <FaLeaf size={18} />
          </div>
          <div>
            <p className='text-[11px] font-black text-slate-800 tracking-tight uppercase'>100% Organic & Fresh</p>
            <p className='text-[10px] font-bold text-slate-500'>Directly sourced from trusted farms</p>
          </div>
        </div>

        {/** Bottom-Right Badge */}
        <div className='absolute bottom-12 right-10 bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-3.5 shadow-[0_15px_30px_-10px_rgba(12,131,31,0.15)] flex items-center gap-3 animate-bounce' style={{ animationDuration: '6.5s', animationDelay: '0.5s' }}>
          <div className='w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-secondary-200 shadow-inner'>
            <FaShieldHalved size={18} />
          </div>
          <div>
            <p className='text-[11px] font-black text-slate-800 tracking-tight uppercase'>256-Bit Encrypted</p>
            <p className='text-[10px] font-bold text-secondary-200'>100% Secure & Verified Access</p>
          </div>
        </div>
      </div>

      {/** 4. Light Glassmorphism Card Container (Optimized vertical padding for 100vh fit) */}
      <div className='relative z-10 w-full max-w-[410px] bg-white/95 backdrop-blur-2xl rounded-[28px] sm:rounded-[32px] shadow-[0_20px_60px_-15px_rgba(12,131,31,0.14),0_10px_35px_-10px_rgba(0,0,0,0.05)] border border-white p-5 sm:p-6 md:p-7 flex flex-col gap-4 transition-all duration-300 my-auto max-h-[96vh] justify-center'>
        
        {/** Top Bar Navigation */}
        {showBackTo && (
          <div className='flex items-center justify-between -mb-1'>
            <Link 
              to={showBackTo} 
              className='inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-secondary-200 transition-colors group px-2.5 py-1 rounded-full bg-slate-100/80 border border-slate-200/60 hover:border-secondary-200/30'
            >
              <span className='group-hover:-translate-x-1 transition-transform'>←</span>
              <span>{backToLabel}</span>
            </Link>
          </div>
        )}

        {/** Brand Header */}
        <div className='text-center flex flex-col items-center gap-0.5'>
          <Link to={"/"} className='select-none flex items-center mb-0.5 group'>
            <span className='font-black text-3xl sm:text-4xl tracking-tight text-secondary-200 group-hover:scale-105 transition-transform duration-200'>
              Groc<span className='text-primary-200'>ify</span>
            </span>
          </Link>
          {title && <h2 className='font-black text-xl sm:text-2xl text-slate-800 tracking-tight leading-tight'>{title}</h2>}
          {subtitle && <p className='text-[11px] sm:text-xs text-slate-400 font-bold tracking-wide leading-tight'>{subtitle}</p>}
        </div>

        {/** Form Content */}
        {children}

      </div>
    </div>
  )
}

export default AuthLayout
