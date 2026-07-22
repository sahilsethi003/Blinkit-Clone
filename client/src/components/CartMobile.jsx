import React from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { FaCartShopping } from 'react-icons/fa6'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'

const CartMobileLink = () => {
    const { totalPrice, totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)

  return (
    <>
        {
            cartItem[0] && (
            <div className='sticky bottom-4 p-2'>
            <div className='bg-secondary-200 px-4 py-2.5 rounded-xl text-neutral-100 text-sm flex items-center justify-between gap-3 lg:hidden shadow-lg border border-secondary-200/20 active:scale-98 transition-all duration-200'>
                    <div className='flex items-center gap-2'>
                        <div className='p-2 bg-white/15 rounded-lg w-fit'>
                            <FaCartShopping size={14}/>
                        </div>
                        <div className='text-xs font-bold leading-tight'>
                                <p>{totalQty} {totalQty === 1 ? 'item' : 'items'}</p>
                                <p className="text-sm">{DisplayPriceInRupees(totalPrice)}</p>
                        </div>
                    </div>

                    <Link to={"/cart"} className='flex items-center gap-1 font-bold text-xs uppercase tracking-wider'>
                        <span>View Cart</span>
                        <FaCaretRight size={14}/>
                    </Link>
                </div>
            </div>
            )
        }
    </>
    
  )
}

export default CartMobileLink
