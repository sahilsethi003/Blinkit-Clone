import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from "react-hook-form"
import { IoClose, IoLocationSharp } from "react-icons/io5"
import { FiPlus, FiCheck, FiArrowLeft } from "react-icons/fi"
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import MapLocationPicker from './MapLocationPicker'

const LocationSelectModal = ({ close, currentActiveId, onSelectAddress }) => {
    const addressList = useSelector(state => state.addresses.addressList) || []
    const [view, setView] = useState("select") // "select" or "add"
    const { fetchAddress } = useGlobalContext()

    // Form settings for Add Address
    const { register, handleSubmit, reset, setValue } = useForm()

    useEffect(() => {
        if (view === "add") {
            register("latitude")
            register("longitude")
        }
    }, [view, register])

    const handleLocationSelect = (location) => {
        setValue("addressline", location.address_line)
        setValue("city", location.city)
        setValue("state", location.state)
        setValue("country", location.country)
        setValue("pincode", location.pincode)
        setValue("latitude", location.latitude)
        setValue("longitude", location.longitude)
    }

    const onSubmitAddress = async (data) => {
        try {
            const response = await Axios({
                ...SummaryApi.createAddress,
                data: {
                    address_line: data.addressline,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    pincode: data.pincode,
                    mobile: data.mobile,
                    latitude: data.latitude || null,
                    longitude: data.longitude || null
                }
            })

            const { data: responseData } = response
            
            if (responseData.success) {
                toast.success(responseData.message)
                reset()
                if (fetchAddress) {
                    await fetchAddress()
                }
                setView("select")
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleSelect = (address) => {
        localStorage.setItem("activeAddressId", address._id)
        if (onSelectAddress) {
            onSelectAddress(address)
        }
        close()
    }

    return (
        <section className='bg-black/60 fixed top-0 left-0 right-0 bottom-0 z-50 backdrop-blur-sm h-screen flex items-center justify-center p-4'>
            <div className='bg-white p-6 w-full max-w-lg rounded-3xl shadow-2xl relative max-h-[85vh] overflow-hidden flex flex-col border border-gray-100 animate-in fade-in zoom-in-95 duration-200'>
                
                {/** Header */}
                <div className='flex justify-between items-center pb-3 border-b border-gray-100 mb-4'>
                    <div className='flex items-center gap-2'>
                        {view === "add" && (
                            <button 
                                onClick={() => setView("select")} 
                                className='text-gray-400 hover:text-slate-700 hover:bg-gray-100 p-1.5 rounded-full transition-all duration-200 mr-1'
                            >
                                <FiArrowLeft size={20}/>
                            </button>
                        )}
                        <h2 className='font-bold text-lg text-gray-800 flex items-center gap-2'>
                            <span className="w-1.5 h-6 bg-primary-200 rounded-full"></span>
                            {view === "select" ? "Select Delivery Location" : "Add Delivery Address"}
                        </h2>
                    </div>
                    <button onClick={close} className='text-gray-400 hover:text-red-500 hover:bg-gray-100 p-1.5 rounded-full transition-all duration-200'>
                        <IoClose size={22}/>
                    </button>
                </div>

                {/** View: Select Location */}
                {view === "select" && (
                    <>
                        <div className='flex-1 overflow-y-auto pr-1 flex flex-col gap-3 py-2 scrollbarCustom'>
                            {addressList.filter(addr => addr.status).length === 0 ? (
                                <div className='text-center py-12 text-gray-400 flex flex-col items-center gap-2'>
                                    <IoLocationSharp size={40} className='text-slate-300' />
                                    <p className='text-sm font-semibold'>No saved addresses found</p>
                                    <p className='text-xs text-gray-400 max-w-xs'>Please add a delivery address to select your location.</p>
                                </div>
                            ) : (
                                addressList.filter(addr => addr.status).map((address) => {
                                    const isCurrent = currentActiveId === address._id
                                    return (
                                        <div 
                                            key={address._id}
                                            onClick={() => handleSelect(address)}
                                            className={`border rounded-2xl p-4 flex justify-between items-start cursor-pointer transition-all duration-200 ${
                                                isCurrent 
                                                    ? "border-secondary-200 bg-secondary-200/5 shadow-sm" 
                                                    : "border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                                            }`}
                                        >
                                            <div className='flex gap-3 items-start'>
                                                <div className={`p-2 rounded-xl mt-0.5 ${isCurrent ? 'bg-secondary-200/10 text-secondary-200' : 'bg-slate-100 text-slate-500'}`}>
                                                    <IoLocationSharp size={18} />
                                                </div>
                                                <div className='flex flex-col text-left'>
                                                    <span className='font-bold text-sm text-slate-800 capitalize'>
                                                        {address.address_line}
                                                    </span>
                                                    <span className='text-xs text-slate-400 font-medium mt-1'>
                                                        {address.city}, {address.state} - {address.pincode}
                                                    </span>
                                                    <span className='text-[11px] text-slate-400 font-medium mt-0.5'>
                                                        Phone: {address.mobile}
                                                    </span>
                                                </div>
                                            </div>

                                            {isCurrent && (
                                                <div className='bg-secondary-200 text-white rounded-full p-1 shadow-md'>
                                                    <FiCheck size={12} />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        <div className='pt-4 border-t border-gray-100 mt-4'>
                            <button 
                                onClick={() => setView("add")}
                                className='w-full py-3 bg-secondary-200 hover:bg-secondary-200/95 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 text-sm'
                            >
                                <FiPlus size={16} />
                                Add New Address
                            </button>
                        </div>
                    </>
                )}

                {/** View: Add Location */}
                {view === "add" && (
                    <form className='flex-1 overflow-y-auto pr-1 grid gap-4 py-2 scrollbarCustom' onSubmit={handleSubmit(onSubmitAddress)}>
                        <div className='grid gap-1.5'>
                            <label className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Select Location on Map</label>
                            <MapLocationPicker onLocationSelect={handleLocationSelect} />
                        </div>
                        
                        <div className='grid gap-1.5 mt-1'>
                            <label htmlFor='addressline' className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Address Line</label>
                            <input
                                type='text'
                                id='addressline' 
                                placeholder='Flat / House No. / Building / Street'
                                className='border border-gray-200 bg-gray-50/50 p-2.5 rounded-lg text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-primary-200/40 focus:border-primary-200 outline-none transition-all duration-200'
                                {...register("addressline",{required : true})}
                            />
                        </div>
                        
                        <div className='grid grid-cols-2 gap-3'>
                            <div className='grid gap-1.5'>
                                <label htmlFor='city' className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>City</label>
                                <input
                                    type='text'
                                    id='city' 
                                    placeholder='City'
                                    className='border border-gray-200 bg-gray-50/50 p-2.5 rounded-lg text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-primary-200/40 focus:border-primary-200 outline-none transition-all duration-200'
                                    {...register("city",{required : true})}
                                />
                            </div>
                            <div className='grid gap-1.5'>
                                <label htmlFor='state' className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>State</label>
                                <input
                                    type='text'
                                    id='state' 
                                    placeholder='State'
                                    className='border border-gray-200 bg-gray-50/50 p-2.5 rounded-lg text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-primary-200/40 focus:border-primary-200 outline-none transition-all duration-200'
                                    {...register("state",{required : true})}
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-3'>
                            <div className='grid gap-1.5'>
                                <label htmlFor='pincode' className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Pincode</label>
                                <input
                                    type='text'
                                    id='pincode' 
                                    placeholder='Pincode'
                                    className='border border-gray-200 bg-gray-50/50 p-2.5 rounded-lg text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-primary-200/40 focus:border-primary-200 outline-none transition-all duration-200'
                                    {...register("pincode",{required : true})}
                                />
                            </div>
                            <div className='grid gap-1.5'>
                                <label htmlFor='country' className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Country</label>
                                <input
                                    type='text'
                                    id='country' 
                                    placeholder='Country'
                                    className='border border-gray-200 bg-gray-50/50 p-2.5 rounded-lg text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-primary-200/40 focus:border-primary-200 outline-none transition-all duration-200'
                                    {...register("country",{required : true})}
                                />
                            </div>
                        </div>

                        <div className='grid gap-1.5'>
                            <label htmlFor='mobile' className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Mobile No.</label>
                            <input
                                type='text'
                                id='mobile' 
                                placeholder='10-digit mobile number'
                                className='border border-gray-200 bg-gray-50/50 p-2.5 rounded-lg text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-primary-200/40 focus:border-primary-200 outline-none transition-all duration-200'
                                {...register("mobile",{required : true})}
                            />
                        </div>

                        <button 
                            type='submit' 
                            className='w-full py-3 mt-2 bg-gradient-to-r from-primary-200 to-primary-100 font-bold text-gray-800 rounded-xl shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 transition-all duration-200 text-sm tracking-wide'
                        >
                            Save Address
                        </button>
                    </form>
                )}

            </div>
        </section>
    )
}

export default LocationSelectModal
