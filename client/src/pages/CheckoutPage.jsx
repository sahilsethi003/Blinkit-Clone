import React, { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem,fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const [selectAddress, setSelectAddress] = useState(0)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const handleCashOnDelivery = async() => {
      try {
          if (!addressList[selectAddress]) {
            toast.error("Please select a delivery address")
            return
          }
          const response = await Axios({
            ...SummaryApi.CashOnDeliveryOrder,
            data : {
              list_items : cartItemsList,
              addressId : addressList[selectAddress]?._id,
              subTotalAmt : totalPrice,
              totalAmt :  totalPrice,
            }
          })

          const { data : responseData } = response

          if(responseData.success){
              toast.success(responseData.message)
              if(fetchCartItem){
                fetchCartItem()
              }
              if(fetchOrder){
                fetchOrder()
              }
              navigate('/success',{
                state : {
                  text : "Order"
                }
              })
          }

      } catch (error) {
        AxiosToastError(error)
      }
  }

  const handleOnlinePayment = async()=>{
    try {
        if (!addressList[selectAddress]) {
            toast.error("Please select a delivery address")
            return
        }

        toast.loading("Loading payment gateway...")
        const isLoaded = await loadRazorpayScript()
        if (!isLoaded) {
            toast.dismiss()
            toast.error("Razorpay SDK failed to load. Are you online?")
            return
        }

        const response = await Axios({
            ...SummaryApi.createRazorpayOrder,
            data : {
              amount: Math.round(totalPrice * 100) // amount in paise
            }
        })

        const { data : orderData } = response
        toast.dismiss()

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Grocify",
            description: "Full-Stack Grocify Clone Payment",
            order_id: orderData.order_id,
            handler: async function (response) {
                toast.loading("Verifying payment...")
                try {
                    const verifyResponse = await Axios({
                        ...SummaryApi.verifyRazorpayPayment,
                        data: {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            list_items: cartItemsList,
                            addressId: addressList[selectAddress]?._id,
                            subTotalAmt: totalPrice,
                            totalAmt: totalPrice
                        }
                    })

                    toast.dismiss()
                    if (verifyResponse.data.success) {
                        toast.success("Payment Successful! Order placed.")
                        if (fetchCartItem) {
                            fetchCartItem()
                        }
                        if (fetchOrder) {
                            fetchOrder()
                        }
                        navigate('/success', {
                            state: {
                                text: "Order"
                            }
                        })
                    } else {
                        toast.error(verifyResponse.data.message || "Payment verification failed")
                    }
                } catch (error) {
                    toast.dismiss()
                    AxiosToastError(error)
                }
            },
            prefill: {
                name: user?.name || "",
                email: user?.email || "",
                contact: addressList[selectAddress]?.mobile || ""
            },
            theme: {
                color: "#0c831f"
            },
            modal: {
                ondismiss: function () {
                    toast.error("Payment cancelled by user")
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
            toast.error(response.error.description || "Payment failed");
        });
        rzp.open();

    } catch (error) {
        toast.dismiss()
        AxiosToastError(error)
    }
  }
  return (
    <section className='bg-transparent'>
      <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>
        <div className='w-full'>
          {/***address***/}
          <h3 className='text-lg font-bold text-gray-800 mb-3 flex items-center gap-2'>
              <span className="w-1.5 h-5 bg-secondary-200 rounded-full"></span>
              Choose Delivery Address
          </h3>
          <div className='bg-white p-4 rounded-2xl shadow-sm border border-slate-100 grid gap-4'>
            {
              addressList.map((address, index) => {
                return (
                  <label htmlFor={"address" + index} className={`cursor-pointer ${!address.status && "hidden"}`} key={address._id}>
                    <div className={`border rounded-xl p-4 flex gap-3 transition-all duration-200 ${selectAddress == index ? "border-secondary-200 bg-secondary-200/5" : "border-slate-100 hover:bg-slate-50"}`}>
                      <div className="pt-1">
                        <input id={"address" + index} type='radio' value={index} checked={selectAddress == index} onChange={(e) => setSelectAddress(e.target.value)} name='address' className="accent-secondary-200 w-4 h-4" />
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="font-bold text-gray-800 text-sm mb-1">{address.address_line}</p>
                        <p>{address.city}, {address.state}</p>
                        <p>{address.country} - {address.pincode}</p>
                        <p className="text-xs font-semibold text-gray-400 mt-2">📞 {address.mobile}</p>
                      </div>
                    </div>
                  </label>
                )
              })
            }
            <div 
              onClick={() => setOpenAddress(true)} 
              className='h-16 bg-slate-50/50 border-2 border-dashed border-slate-200 hover:border-secondary-200 hover:text-secondary-200 rounded-xl flex justify-center items-center cursor-pointer text-slate-400 font-bold transition-all duration-200 text-sm shadow-sm'
            >
              + Add new address
            </div>
          </div>

        </div>

        <div className='w-full max-w-md bg-white p-5 rounded-2xl shadow-sm border border-slate-100 h-fit'>
          {/**summary**/}
          <h3 className='text-lg font-bold text-gray-800 pb-3 border-b border-slate-100 mb-4'>Order Summary</h3>
          <div className='bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 mb-5'>
            <h3 className='font-bold text-xs text-gray-400 uppercase tracking-wider mb-2.5'>Bill details</h3>
            <div className='flex gap-4 justify-between text-sm text-gray-600 mb-2'>
              <p>Items total</p>
              <p className='flex items-center gap-2'><span className='line-through text-neutral-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span><span className="font-bold text-gray-800">{DisplayPriceInRupees(totalPrice)}</span></p>
            </div>
            <div className='flex gap-4 justify-between text-sm text-gray-600 mb-2'>
              <p>Quantity total</p>
              <p className='font-semibold text-gray-800'>{totalQty} {totalQty === 1 ? 'item' : 'items'}</p>
            </div>
            <div className='flex gap-4 justify-between text-sm text-gray-600 pb-3 border-b border-slate-200/50 mb-3'>
              <p>Delivery Charge</p>
              <p className='text-secondary-200 font-bold uppercase text-xs tracking-wider'>Free</p>
            </div>
            <div className='font-bold text-base flex items-center justify-between text-gray-800'>
              <p>Grand total</p>
              <p className="text-lg text-secondary-200 font-black">{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>
          <div className='w-full flex flex-col gap-3.5'>
            <button className='w-full py-3 bg-secondary-200 hover:bg-secondary-200/95 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95' onClick={handleOnlinePayment}>Online Payment</button>

            <button className='w-full py-3 border-2 border-secondary-200 font-bold text-secondary-200 rounded-xl hover:bg-emerald-50/70 transition-all duration-200 text-sm active:scale-95' onClick={handleCashOnDelivery}>Cash on Delivery</button>
          </div>
        </div>
      </div>


      {
        openAddress && (
          <AddAddress close={() => setOpenAddress(false)} />
        )
      }
    </section>
  )
}

export default CheckoutPage
