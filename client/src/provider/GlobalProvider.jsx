import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct"; 
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

export const GlobalContext = createContext(null)

export const useGlobalContext = ()=> useContext(GlobalContext)

export const AVAILABLE_PROMO_CODES = [
    { code: "GROCIFY10", type: "percentage", value: 10, minOrder: 0, description: "Flat 10% OFF on all grocery orders" },
    { code: "SUPER50", type: "flat", value: 50, minOrder: 199, description: "Flat ₹50 OFF on orders above ₹199" },
    { code: "FRESH20", type: "percentage", value: 20, maxDiscount: 150, minOrder: 299, description: "20% OFF up to ₹150 on fresh items" }
]

export const FREE_DELIVERY_THRESHOLD = 199
export const STANDARD_DELIVERY_FEE = 29

const GlobalProvider = ({children}) => {
    const dispatch = useDispatch()
    const [totalPrice, setTotalPrice] = useState(0)
    const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0)
    const [totalQty, setTotalQty] = useState(0)
    const [appliedPromoCode, setAppliedPromoCode] = useState(null)
    const [promoCodesList, setPromoCodesList] = useState(AVAILABLE_PROMO_CODES)
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state?.user)

    const fetchPublicPromoCodes = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getPublicPromoCodes
            })
            if (response.data.success && response.data.data?.length > 0) {
                setPromoCodesList(response.data.data)
            }
        } catch (error) {
            console.log("Could not load dynamic promo codes:", error)
        }
    }

    useEffect(() => {
        fetchPublicPromoCodes()
    }, [])

    const fetchCartItem = async()=>{
        try {
          const response = await Axios({
            ...SummaryApi.getCartItem
          })
          const { data : responseData } = response
    
          if(responseData.success){
            dispatch(handleAddItemCart(responseData.data))
          }
    
        } catch (error) {
          console.log(error)
        }
    }

    const updateCartItem = async(id,qty)=>{
      try {
          const response = await Axios({
            ...SummaryApi.updateCartItemQty,
            data : {
              _id : id,
              qty : qty
            }
          })
          const { data : responseData } = response

          if(responseData.success){
              fetchCartItem()
              return responseData
          }
      } catch (error) {
        AxiosToastError(error)
        return error
      }
    }

    const deleteCartItem = async(cartId)=>{
      try {
          const response = await Axios({
            ...SummaryApi.deleteCartItem,
            data : {
              _id : cartId
            }
          })
          const { data : responseData} = response

          if(responseData.success){
            toast.success(responseData.message)
            fetchCartItem()
            return responseData
          }
      } catch (error) {
         AxiosToastError(error)
      }
    }

    useEffect(()=>{
      const qty = cartItem.reduce((preve,curr)=>{
          return preve + curr.quantity
      },0)
      setTotalQty(qty)
      
      const tPrice = cartItem.reduce((preve,curr)=>{
          const priceAfterDiscount = pricewithDiscount(curr?.productId?.price,curr?.productId?.discount)

          return preve + (priceAfterDiscount * curr.quantity)
      },0)
      setTotalPrice(tPrice)

      const notDiscountPrice = cartItem.reduce((preve,curr)=>{
        return preve + (curr?.productId?.price * curr.quantity)
      },0)
      setNotDiscountTotalPrice(notDiscountPrice)
  },[cartItem])

    // Calculate Promo Discount
    let promoDiscountAmount = 0
    if (appliedPromoCode && totalPrice > 0) {
        if (appliedPromoCode.type === "percentage") {
            let calc = (totalPrice * appliedPromoCode.value) / 100
            if (appliedPromoCode.maxDiscount) {
                calc = Math.min(calc, appliedPromoCode.maxDiscount)
            }
            promoDiscountAmount = Math.round(calc)
        } else if (appliedPromoCode.type === "flat") {
            promoDiscountAmount = Math.min(totalPrice, appliedPromoCode.value)
        }
    }

    // Auto validate promo if total drops below minOrder
    useEffect(() => {
        if (appliedPromoCode && totalPrice < appliedPromoCode.minOrder) {
            setAppliedPromoCode(null)
            toast.error(`Promo ${appliedPromoCode.code} removed (Min order ₹${appliedPromoCode.minOrder} required)`)
        }
    }, [totalPrice, appliedPromoCode])

    const applyPromoCode = (codeString) => {
        const found = promoCodesList.find(p => p.code.toUpperCase() === codeString.toUpperCase())
        
        if (!found) {
            toast.error("Invalid Promo Code")
            return false
        }

        if (totalPrice < found.minOrder) {
            toast.error(`Minimum order ₹${found.minOrder} required for ${found.code}`)
            return false
        }

        setAppliedPromoCode(found)
        toast.success(`🎉 Promo Code ${found.code} Applied!`)
        return true
    }

    const removePromoCode = () => {
        setAppliedPromoCode(null)
        toast.success("Promo code removed")
    }

    // Free Delivery Calculations
    const isFreeDelivery = totalPrice >= FREE_DELIVERY_THRESHOLD
    const deliveryCharge = (totalPrice === 0 || isFreeDelivery) ? 0 : STANDARD_DELIVERY_FEE
    const freeDeliveryRemaining = Math.max(0, FREE_DELIVERY_THRESHOLD - totalPrice)
    const freeDeliveryProgress = Math.min(100, (totalPrice / FREE_DELIVERY_THRESHOLD) * 100)

    const finalGrandTotal = Math.max(0, totalPrice - promoDiscountAmount + deliveryCharge)

    const fetchAddress = async()=>{
      try {
        const response = await Axios({
          ...SummaryApi.getAddress
        })
        const { data : responseData } = response

        if(responseData.success){
          dispatch(handleAddAddress(responseData.data))
        }
      } catch (error) {
          AxiosToastError(error)
      }
    }
    const fetchOrder = async()=>{
      try {
        const response = await Axios({
          ...SummaryApi.getOrderItems,
        })
        const { data : responseData } = response

        if(responseData.success){
            dispatch(setOrder(responseData.data))
        }
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(()=>{
      if (user?._id) {
        fetchCartItem()
        fetchAddress()
        fetchOrder()
      } else {
        dispatch(handleAddItemCart([]))
        dispatch(handleAddAddress([]))
        dispatch(setOrder([]))
      }
    },[user])
    
    return(
        <GlobalContext.Provider value={{
            fetchCartItem,
            updateCartItem,
            deleteCartItem,
            fetchAddress,
            totalPrice,
            totalQty,
            notDiscountTotalPrice,
            fetchOrder,
            appliedPromoCode,
            promoDiscountAmount,
            finalGrandTotal,
            availablePromoCodes: promoCodesList,
            fetchPublicPromoCodes,
            applyPromoCode,
            removePromoCode,
            FREE_DELIVERY_THRESHOLD,
            STANDARD_DELIVERY_FEE,
            deliveryCharge,
            isFreeDelivery,
            freeDeliveryRemaining,
            freeDeliveryProgress
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider