import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaCheck, FaBagShopping, FaArrowRight, FaTruckFast } from 'react-icons/fa6'

const Success = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const successText = location?.state?.text || "Order"

  return (
    <div className='min-h-[75vh] flex items-center justify-center p-4 bg-slate-50/50'>
      <div className='w-full max-w-lg bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-emerald-500/5 text-center flex flex-col items-center gap-6 relative overflow-hidden transition-all duration-300'>
        
        {/* Top Decorative Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Success Icon with Glow and Ring Animation */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75"></div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white text-3xl shadow-lg shadow-emerald-500/30 relative z-10 scale-100 transition-transform hover:scale-105">
            <FaCheck />
          </div>
        </div>

        {/* Order Success Title & Description */}
        <div className="flex flex-col gap-2">
          <span className="inline-flex items-center justify-center gap-1.5 self-center bg-emerald-50 text-secondary-200 border border-emerald-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <FaTruckFast className="text-sm" /> Delivery in 10 Mins
          </span>
          <h1 className='text-2xl lg:text-3xl font-extrabold text-gray-800 tracking-tight mt-1'>
            {successText} Placed Successfully! 🎉
          </h1>
          <p className='text-sm text-gray-500 max-w-md leading-relaxed'>
            Thank you for shopping with <span className="font-bold text-gray-800">Grocify</span>. Your order has been confirmed and is being packed for superfast delivery.
          </p>
        </div>

        {/* Live Status Tracker Preview */}
        <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs font-bold text-gray-600">
            <span>Order Status</span>
            <span className="text-secondary-200 font-extrabold uppercase tracking-wide">Confirmed & Packing</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-full w-2/3 rounded-full animate-pulse"></div>
          </div>
          <div className="flex justify-between text-[11px] text-gray-400 font-medium pt-1">
            <span className="text-secondary-200 font-bold">1. Confirmed ✓</span>
            <span className="text-secondary-200 font-bold">2. Packing 📦</span>
            <span>3. On the Way 🛵</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => navigate('/dashboard/myorders')}
            className="flex-1 py-3.5 px-5 bg-secondary-200 hover:bg-secondary-200/95 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <FaBagShopping /> View My Orders
          </button>
          <Link
            to="/"
            className="flex-1 py-3.5 px-5 border-2 border-slate-200 hover:border-secondary-200 text-gray-700 hover:text-secondary-200 font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            Continue Shopping <FaArrowRight />
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Success;
