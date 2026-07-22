import React from 'react'
import { Link } from 'react-router-dom'
import { FiShield } from 'react-icons/fi'

const AccessDenied = () => {
  return (
    <section className='min-h-[75vh] flex items-center justify-center px-4 py-12 bg-transparent animate-in fade-in duration-300'>
      <div className='bg-white w-full max-w-md rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 text-center flex flex-col items-center gap-6 relative overflow-hidden'>
        {/** Decorative Blobs */}
        <div className='absolute -top-10 -right-10 w-36 h-36 rounded-full bg-secondary-200/10 pointer-events-none'></div>
        <div className='absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-primary-200/10 pointer-events-none'></div>

        <div className='bg-red-50 text-red-500 p-5 rounded-full flex items-center justify-center shadow-inner relative z-10 animate-pulse'>
          <FiShield size={40} />
        </div>

        <div className='relative z-10'>
          <h1 className='text-6xl font-black text-slate-800 tracking-tight'>403</h1>
          <h2 className='text-xl font-bold text-slate-700 mt-2'>Access Denied</h2>
          <p className='text-sm text-gray-400 mt-3 font-medium leading-relaxed'>
            You do not have permission to access this page. Please log in with authorized credentials or return to the main catalog.
          </p>
        </div>

        <div className='w-full flex flex-col sm:flex-row gap-3 relative z-10'>
          <Link 
            to="/login" 
            className='flex-1 py-3 bg-primary-200 hover:bg-primary-200/95 text-secondary-100 font-bold text-sm tracking-wide rounded-xl shadow-md transition-all duration-200 active:scale-95'
          >
            Login
          </Link>
          <Link 
            to="/" 
            className='flex-1 py-3 bg-secondary-200 hover:bg-secondary-200/95 text-white font-bold text-sm tracking-wide rounded-xl shadow-md transition-all duration-200 active:scale-95'
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AccessDenied
