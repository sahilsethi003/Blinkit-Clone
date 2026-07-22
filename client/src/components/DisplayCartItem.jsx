import React from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/empty_cart.webp'
import toast from 'react-hot-toast'
import PromoCodeSection from './PromoCodeSection'
import FreeDeliveryProgressBar from './FreeDeliveryProgressBar'

const DisplayCartItem = ({close}) => {
    const { 
        notDiscountTotalPrice, 
        totalPrice, 
        totalQty, 
        promoDiscountAmount, 
        finalGrandTotal,
        isFreeDelivery,
        deliveryCharge
    } = useGlobalContext()

    const cartItem  = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    const redirectToCheckoutPage = ()=>{
        if(user?._id){
            navigate("/checkout")
            if(close){
                close()
            }
            return
        }
        toast("Please Login")
    }
  return (
    <section className='bg-neutral-900/40 backdrop-blur-xs fixed top-0 bottom-0 right-0 left-0 z-50 transition-opacity duration-300'>
        <div className='bg-white w-full max-w-md min-h-screen max-h-screen ml-auto flex flex-col shadow-2xl'>
            <div className='flex items-center p-4 border-b border-slate-100 gap-3 justify-between'>
                <h2 className='font-bold text-gray-800 text-base flex items-center gap-2'>
                    <span className="w-1.5 h-5 bg-secondary-200 rounded-full"></span>
                    My Cart ({totalQty} {totalQty === 1 ? 'item' : 'items'})
                </h2>
                <Link to={"/"} className='lg:hidden text-gray-500 hover:text-gray-700 transition-colors'>
                    <IoClose size={24}/>
                </Link>
                <button onClick={close} className='hidden lg:block text-gray-500 hover:text-gray-700 transition-colors'>
                    <IoClose size={24}/>
                </button>
            </div>

            <div className='flex-grow overflow-y-auto bg-slate-50/50 p-4 flex flex-col gap-4 scrollbar-none [scrollbar-width:none]'>
                {/***display items */}
                {
                    cartItem[0] ? (
                        <>
                            {/** Free Delivery Tracker */}
                            <FreeDeliveryProgressBar />

                            <div className='flex items-center justify-between px-4 py-2.5 bg-emerald-50 text-secondary-200 rounded-xl text-xs font-bold tracking-wide uppercase'>
                                    <p>Your total savings</p>
                                    <p>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice + promoDiscountAmount)}</p>
                            </div>

                            <div className='bg-white rounded-2xl p-4 grid gap-5 border border-slate-100 shadow-sm'>
                                    {
                                        cartItem[0] && (
                                            cartItem.map((item,index)=>{
                                                return(
                                                    <div key={item?._id+"cartItemDisplay"} className='flex w-full gap-4 items-center pb-4 border-b border-slate-100 last:border-b-0 last:pb-0'>
                                                        <div className='w-16 h-16 min-h-16 min-w-16 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-1.5 overflow-hidden'>
                                                            <img
                                                                src={item?.productId?.image[0]}
                                                                className='object-scale-down max-h-12'
                                                            />
                                                        </div>
                                                        <div className='w-full text-xs text-gray-600'>
                                                            <p className='text-xs font-bold text-gray-800 text-ellipsis line-clamp-2 leading-tight mb-0.5'>{item?.productId?.name}</p>
                                                            <p className='text-gray-400 font-medium mb-1'>{item?.productId?.unit}</p>
                                                            <p className='font-extrabold text-sm text-gray-900'>{DisplayPriceInRupees(pricewithDiscount(item?.productId?.price,item?.productId?.discount))}</p>
                                                        </div>
                                                        <div className="ml-auto">
                                                            <AddToCartButton data={item?.productId}/>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )
                                    }
                            </div>

                            {/** Promo Code Section */}
                            <PromoCodeSection />

                            {/** Bill Details */}
                            <div className='bg-white p-4 rounded-2xl border border-slate-100 shadow-sm'>
                                <h3 className='font-bold text-xs text-gray-400 uppercase tracking-wider mb-2.5'>Bill details</h3>
                                <div className='flex gap-4 justify-between text-sm text-gray-600 mb-2'>
                                    <p>Items total</p>
                                    <p className='flex items-center gap-2'><span className='line-through text-neutral-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span><span className="font-bold text-gray-800">{DisplayPriceInRupees(totalPrice)}</span></p>
                                </div>
                                <div className='flex gap-4 justify-between text-sm text-gray-600 mb-2'>
                                    <p>Quantity total</p>
                                    <p className='font-semibold text-gray-800'>{totalQty} {totalQty === 1 ? 'item' : 'items'}</p>
                                </div>

                                {Boolean(promoDiscountAmount) && (
                                    <div className='flex gap-4 justify-between text-sm text-secondary-200 font-extrabold mb-2'>
                                        <p className='flex items-center gap-1.5'>
                                            <span>🎟️</span>
                                            <span>Promo Discount</span>
                                        </p>
                                        <p>-{DisplayPriceInRupees(promoDiscountAmount)}</p>
                                    </div>
                                )}

                                <div className='flex gap-4 justify-between text-sm text-gray-600 pb-3 border-b border-slate-200/50 mb-3'>
                                    <p>Delivery Charge</p>
                                    {isFreeDelivery ? (
                                        <p className='text-secondary-200 font-bold uppercase text-xs tracking-wider flex items-center gap-1'>
                                            <span className='line-through text-slate-400 font-normal'>₹29</span>
                                            <span>FREE</span>
                                        </p>
                                    ) : (
                                        <p className='text-slate-800 font-extrabold text-xs'>₹29</p>
                                    )}
                                </div>
                                <div className='font-bold text-base flex items-center justify-between text-gray-800'>
                                    <p>Grand total</p>
                                    <p className="text-secondary-200 font-black text-lg">{DisplayPriceInRupees(finalGrandTotal)}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className='bg-white flex flex-col justify-center items-center py-10 px-4 rounded-2xl border border-slate-100 shadow-sm my-auto text-center'>
                            <img
                                src={imageEmpty}
                                className='w-48 h-48 object-scale-down mb-4' 
                            />
                            <p className="font-bold text-gray-800 text-lg mb-1">Your cart is empty</p>
                            <p className="text-xs text-gray-400 mb-6 font-medium">Add items to get started on your grocery run!</p>
                            <Link onClick={close} to={"/"} className='bg-secondary-200 hover:bg-secondary-200/90 px-6 py-2.5 text-white font-bold rounded-xl transition-all shadow-sm text-sm active:scale-95'>Shop Now</Link>
                        </div>
                    )
                }
                
            </div>

            {
                cartItem[0] && (
                    <div className='p-4 border-t border-slate-100 bg-white'>
                        <div className='bg-secondary-200 text-neutral-100 px-5 font-bold text-sm py-3 rounded-xl flex items-center gap-4 justify-between shadow-md hover:shadow-lg transition-all duration-200 active:scale-98'>
                            <div>
                                <p className="font-black text-base">{DisplayPriceInRupees(finalGrandTotal)}</p>
                                {Boolean(promoDiscountAmount) && (
                                    <p className='text-[10px] text-white/80 font-bold'>Includes promo discount</p>
                                )}
                            </div>
                            <button onClick={redirectToCheckoutPage} className='flex items-center gap-1.5 font-bold uppercase tracking-wider text-xs cursor-pointer'>
                                Proceed to checkout
                                <span><FaCaretRight size={14}/></span>
                            </button>
                        </div>
                    </div>
                )
            }
            
        </div>
    </section>
  )
}

export default DisplayCartItem
