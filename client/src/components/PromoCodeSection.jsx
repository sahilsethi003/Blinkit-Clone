import React, { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { FaTicketSimple, FaCheck, FaXmark, FaTag } from 'react-icons/fa6'

const PromoCodeSection = () => {
    const { 
        appliedPromoCode, 
        applyPromoCode, 
        removePromoCode, 
        availablePromoCodes,
        totalPrice 
    } = useGlobalContext()

    const [inputCode, setInputCode] = useState('')
    const [showAvailableList, setShowAvailableList] = useState(false)

    const handleApplyInput = (e) => {
        e.preventDefault()
        if (!inputCode.trim()) return
        const success = applyPromoCode(inputCode.trim())
        if (success) {
            setInputCode('')
            setShowAvailableList(false)
        }
    }

    const handleSelectPromoFromList = (code) => {
        const success = applyPromoCode(code)
        if (success) {
            setShowAvailableList(false)
        }
    }

    return (
        <div className='bg-white rounded-2xl p-4 border border-slate-100 shadow-sm grid gap-3'>
            <div className='flex items-center justify-between'>
                <h3 className='font-bold text-xs text-gray-800 uppercase tracking-wider flex items-center gap-2'>
                    <FaTag className='text-secondary-200' size={14} />
                    <span>Apply Promo Code</span>
                </h3>
                <button 
                    type='button'
                    onClick={() => setShowAvailableList(prev => !prev)}
                    className='text-[11px] font-extrabold text-secondary-200 hover:underline'
                >
                    {showAvailableList ? "Hide Offers" : "View Offers"}
                </button>
            </div>

            {/** Active Applied Promo Code Badge */}
            {appliedPromoCode ? (
                <div className='bg-emerald-50 border border-emerald-200/70 rounded-xl p-3 flex items-center justify-between gap-3 animate-fadeIn'>
                    <div className='flex items-center gap-2.5'>
                        <div className='w-8 h-8 rounded-lg bg-secondary-200 text-white flex items-center justify-center shadow-sm'>
                            <FaTicketSimple size={14} />
                        </div>
                        <div>
                            <div className='flex items-center gap-1.5'>
                                <span className='font-black text-xs text-secondary-200 uppercase tracking-wider'>{appliedPromoCode.code}</span>
                                <span className='bg-secondary-200 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5'>
                                    <FaCheck size={8} /> Applied
                                </span>
                            </div>
                            <p className='text-[11px] font-semibold text-slate-600 mt-0.5'>{appliedPromoCode.description}</p>
                        </div>
                    </div>
                    <button 
                        type='button'
                        onClick={removePromoCode}
                        className='text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-white transition-colors'
                        title="Remove Coupon"
                    >
                        <FaXmark size={16} />
                    </button>
                </div>
            ) : (
                <form onSubmit={handleApplyInput} className='flex items-center gap-2'>
                    <div className='relative flex-1'>
                        <input
                            type='text'
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                            placeholder='Enter promo code (e.g. GROCIFY10)'
                            className='w-full bg-slate-50 px-3.5 py-2 border border-slate-200 rounded-xl outline-none text-xs font-bold uppercase tracking-wider text-slate-800 placeholder:normal-case placeholder:font-semibold placeholder:text-slate-400 focus:border-secondary-200 focus:bg-white transition-all'
                        />
                    </div>
                    <button
                        type='submit'
                        disabled={!inputCode.trim()}
                        className={`px-4 py-2 rounded-xl font-black text-xs tracking-wider transition-all duration-200 active:scale-95 ${
                            inputCode.trim() 
                                ? "bg-secondary-200 hover:bg-secondary-200/90 text-white cursor-pointer shadow-sm" 
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                    >
                        APPLY
                    </button>
                </form>
            )}

            {/** Available Offers Quick List */}
            {showAvailableList && (
                <div className='pt-2 border-t border-slate-100 grid gap-2.5 mt-1 max-h-56 overflow-y-auto scrollbar-none [scrollbar-width:none] pr-0.5'>
                    <p className='text-[10px] font-bold uppercase tracking-wider text-slate-400'>Available Coupons</p>
                    {availablePromoCodes.map((promo) => {
                        const isApplicable = totalPrice >= promo.minOrder
                        const isApplied = appliedPromoCode?.code === promo.code

                        return (
                            <div 
                                key={promo.code} 
                                className={`border rounded-xl p-2.5 flex items-center justify-between gap-2 transition-all ${
                                    isApplied 
                                        ? "border-secondary-200 bg-secondary-200/5" 
                                        : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                                }`}
                            >
                                <div className='flex items-center gap-2'>
                                    <div className='w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs'>
                                        🏷️
                                    </div>
                                    <div>
                                        <p className='font-black text-xs text-slate-800 tracking-wide'>{promo.code}</p>
                                        <p className='text-[10px] font-bold text-secondary-200'>{promo.description}</p>
                                        {!isApplicable && (
                                            <p className='text-[9px] font-semibold text-rose-500'>Min order ₹{promo.minOrder}</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type='button'
                                    disabled={!isApplicable || isApplied}
                                    onClick={() => handleSelectPromoFromList(promo.code)}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-extrabold tracking-wider transition-all ${
                                        isApplied
                                            ? "bg-emerald-100 text-secondary-200 cursor-default"
                                            : isApplicable
                                                ? "bg-secondary-200 text-white hover:bg-secondary-200/90 active:scale-95 cursor-pointer shadow-xs"
                                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    }`}
                                >
                                    {isApplied ? "APPLIED" : "APPLY"}
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default PromoCodeSection
