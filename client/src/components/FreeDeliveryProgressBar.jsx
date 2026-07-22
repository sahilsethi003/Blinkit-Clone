import React from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaTruckFast, FaCircleCheck } from 'react-icons/fa6'

const FreeDeliveryProgressBar = () => {
    const { 
        totalPrice, 
        FREE_DELIVERY_THRESHOLD, 
        isFreeDelivery, 
        freeDeliveryRemaining, 
        freeDeliveryProgress 
    } = useGlobalContext()

    if (totalPrice === 0) return null

    return (
        <div className='bg-gradient-to-r from-emerald-50 via-teal-50/60 to-slate-50 p-3.5 rounded-2xl border border-emerald-100/80 shadow-xs flex flex-col gap-2.5 transition-all duration-300'>
            {/** Header Text & Status */}
            <div className='flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2'>
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shadow-xs ${
                        isFreeDelivery 
                            ? "bg-secondary-200 text-white" 
                            : "bg-amber-100 text-amber-600"
                    }`}>
                        {isFreeDelivery ? <FaCircleCheck size={14} /> : <FaTruckFast size={14} />}
                    </div>
                    <div>
                        {isFreeDelivery ? (
                            <p className='text-xs font-black text-secondary-200 tracking-tight'>
                                🎉 FREE Delivery Unlocked!
                            </p>
                        ) : (
                            <p className='text-xs font-bold text-slate-800 tracking-tight'>
                                Add <span className='font-black text-secondary-200'>{DisplayPriceInRupees(freeDeliveryRemaining)}</span> more for <span className='font-black text-secondary-200'>FREE Delivery</span>
                            </p>
                        )}
                    </div>
                </div>
                <span className='text-[11px] font-black text-slate-400'>
                    {Math.round(freeDeliveryProgress)}%
                </span>
            </div>

            {/** Progress Bar */}
            <div className='w-full h-2.5 bg-slate-200/70 rounded-full overflow-hidden p-0.5 relative shadow-inner'>
                <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out shadow-sm ${
                        isFreeDelivery 
                            ? "bg-gradient-to-r from-emerald-400 via-secondary-200 to-teal-500 animate-pulse" 
                            : "bg-gradient-to-r from-amber-400 to-secondary-200"
                    }`}
                    style={{ width: `${freeDeliveryProgress}%` }}
                ></div>
            </div>
        </div>
    )
}

export default FreeDeliveryProgressBar
