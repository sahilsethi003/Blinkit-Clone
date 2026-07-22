import React from 'react'
import { Link } from 'react-router-dom'
import { FiAlertCircle } from 'react-icons/fi'

const PageNotFound = () => {
  return (
    <section className='min-h-[75vh] flex items-center justify-center px-4 py-12 bg-transparent animate-in fade-in duration-300'>
      <div className='bg-white w-full max-w-md rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 text-center flex flex-col items-center gap-6 relative overflow-hidden'>
        {/** Decorative Blobs */}
        <div className='absolute -top-10 -right-10 w-36 h-36 rounded-full bg-primary-200/10 pointer-events-none'></div>
        <div className='absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-secondary-200/10 pointer-events-none'></div>

        <div className='bg-red-50 text-red-500 p-5 rounded-full flex items-center justify-center shadow-inner relative z-10 animate-bounce'>
          <FiAlertCircle size={40} />
        </div>

        <div className='relative z-10'>
          <h1 className='text-6xl font-black text-slate-800 tracking-tight'>404</h1>
          <h2 className='text-xl font-bold text-slate-700 mt-2'>Page Not Found</h2>
          <p className='text-sm text-gray-400 mt-3 font-medium leading-relaxed'>
            Oops! The page you are looking for doesn't exist or has been moved to another address.
          </p>
        </div>

        <Link 
          to="/" 
          className='w-full py-3.5 bg-secondary-200 hover:bg-secondary-200/95 text-white font-bold text-sm tracking-wide rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 relative z-10'
        >
          Go Back Home
        </Link>
      </div>
    </section>
  )
}

export default PageNotFound
