import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaXmark, FaRotateLeft, FaHouse } from 'react-icons/fa6'

const Cancel = () => {
  const navigate = useNavigate()

  return (
    <div className='min-h-[75vh] flex items-center justify-center p-4 bg-slate-50/50'>
      <div className='w-full max-w-lg bg-white rounded-3xl p-8 border border-rose-100 shadow-xl shadow-rose-500/5 text-center flex flex-col items-center gap-6 relative overflow-hidden transition-all duration-300'>
        
        {/* Top Decorative Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Warning Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white text-3xl shadow-lg shadow-rose-500/30 relative z-10">
            <FaXmark />
          </div>
        </div>

        {/* Cancel Title & Description */}
        <div className="flex flex-col gap-2">
          <h1 className='text-2xl lg:text-3xl font-extrabold text-gray-800 tracking-tight'>
            Order Cancelled
          </h1>
          <p className='text-sm text-gray-500 max-w-md leading-relaxed'>
            Your payment was not completed or was cancelled. No charges were made to your account.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => navigate('/checkout')}
            className="flex-1 py-3.5 px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <FaRotateLeft /> Try Payment Again
          </button>
          <Link
            to="/"
            className="flex-1 py-3.5 px-5 border-2 border-slate-200 hover:border-slate-300 text-gray-700 font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <FaHouse /> Return to Home
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Cancel
