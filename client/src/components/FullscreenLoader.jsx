import React from 'react'

const FullscreenLoader = () => {
  return (
    <div className='fixed inset-0 bg-white/50 backdrop-blur-xs z-[9999] flex items-center justify-center animate-in fade-in duration-200'>
      <div className='relative flex items-center justify-center w-12 h-12'>
        <div className='absolute inset-0 rounded-full border-4 border-slate-100'></div>
        <div className='absolute inset-0 rounded-full border-4 border-secondary-200 border-t-transparent animate-spin'></div>
      </div>
    </div>
  )
}

export default FullscreenLoader
