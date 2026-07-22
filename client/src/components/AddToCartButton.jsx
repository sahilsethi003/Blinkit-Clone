import { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from "react-icons/fa6";

const AddToCartButton = ({ data }) => {
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails,setCartItemsDetails] = useState()

    const handleADDTocart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setLoading(true)

            const response = await Axios({
                ...SummaryApi.addTocart,
                data: {
                    productId: data?._id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }

    }

    //checking this item in cart or not
    useEffect(() => {
        const checkingitem = cartItem.some(item => item.productId?._id === data?._id)
        setIsAvailableCart(checkingitem)

        const product = cartItem.find(item => item.productId?._id === data?._id)
        setQty(product?.quantity)
        setCartItemsDetails(product)
    }, [data, cartItem])


    const increaseQty = async(e) => {
        e.preventDefault()
        e.stopPropagation()
    
       const response = await  updateCartItem(cartItemDetails?._id,qty+1)
        
       if(response.success){
        toast.success("Item added")
       }
    }

    const decreaseQty = async(e) => {
        e.preventDefault()
        e.stopPropagation()
        if(qty === 1){
            deleteCartItem(cartItemDetails?._id)
        }else{
            const response = await updateCartItem(cartItemDetails?._id,qty-1)

            if(response.success){
                toast.success("Item remove")
            }
        }
    }
    return (
        <div className='w-full min-w-[70px] lg:min-w-[85px]'>
            {
                isAvailableCart ? (
                    <div className='flex items-center w-full bg-secondary-200 rounded-lg overflow-hidden border border-secondary-200 text-white font-extrabold text-xs h-8 shadow-sm transition-all duration-200'>
                        <button onClick={decreaseQty} className='hover:bg-secondary-200/80 text-white px-2.5 h-full flex items-center justify-center transition-colors duration-200'><FaMinus size={10} /></button>
                        
                        <p className='flex-1 text-center bg-white text-secondary-200 h-full flex items-center justify-center px-1.5 select-none font-bold text-sm'>{qty}</p>
                        
                        <button onClick={increaseQty} className='hover:bg-secondary-200/80 text-white px-2.5 h-full flex items-center justify-center transition-colors duration-200'><FaPlus size={10} /></button>
                    </div>
                ) : (
                    <button onClick={handleADDTocart} className='w-full text-center bg-white hover:bg-secondary-200 hover:text-white text-secondary-200 font-extrabold text-xs px-3.5 py-1.5 rounded-lg border border-secondary-200 shadow-sm transition-all duration-200 active:scale-95'>
                        {loading ? <Loading /> : "ADD"}
                    </button>
                )
            }
        </div>
    )
}

export default AddToCartButton
