import React, { useEffect } from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from '../provider/GlobalProvider'
import MapLocationPicker from './MapLocationPicker'

const EditAddressDetails = ({close, data}) => {
    const { register, handleSubmit, reset, setValue } = useForm({
        defaultValues : {
            _id : data._id,
            userId : data.userId,
            address_line : data.address_line,
            city : data.city,
            state : data.state,
            country : data.country,
            pincode : data.pincode,
            mobile : data.mobile,
            latitude : data.latitude,
            longitude : data.longitude
        }
    })
    const { fetchAddress } = useGlobalContext()

    useEffect(() => {
        register("latitude")
        register("longitude")
    }, [register])

    const handleLocationSelect = (location) => {
        setValue("address_line", location.address_line)
        setValue("city", location.city)
        setValue("state", location.state)
        setValue("country", location.country)
        setValue("pincode", location.pincode)
        setValue("latitude", location.latitude)
        setValue("longitude", location.longitude)
    }

    const onSubmit = async(data)=>{
        try {
            const response = await Axios({
                ...SummaryApi.updateAddress,
                data : {
                    ...data,
                    address_line : data.address_line,
                    city : data.city,
                    state : data.state,
                    country : data.country,
                    pincode : data.pincode,
                    mobile : data.mobile,
                    latitude : data.latitude || null,
                    longitude : data.longitude || null
                }
            })

            const { data : responseData } = response
            
            if(responseData.success){
                toast.success(responseData.message)
                if(close){
                    close()
                    reset()
                    fetchAddress()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }
  return (
    <section className='bg-black/60 fixed top-0 left-0 right-0 bottom-0 z-50 backdrop-blur-sm h-screen overflow-auto flex items-center justify-center p-4'>
        <div className='bg-white p-6 w-full max-w-lg rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto border border-gray-100 animate-in fade-in zoom-in-95 duration-200'>
            <div className='flex justify-between items-center pb-3 border-b border-gray-100 mb-4'>
                <h2 className='font-bold text-lg text-gray-800 flex items-center gap-2'>
                    <span className="w-1.5 h-6 bg-primary-200 rounded-full"></span>
                    Edit Delivery Address
                </h2>
                <button onClick={close} className='text-gray-400 hover:text-red-500 hover:bg-gray-100 p-1.5 rounded-full transition-all duration-200'>
                    <IoClose size={22}/>
                </button>
            </div>
            
            <form className='grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                <div className='grid gap-1.5'>
                    <label className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Select Location on Map</label>
                    <MapLocationPicker 
                        onLocationSelect={handleLocationSelect} 
                        initialLat={data.latitude}
                        initialLng={data.longitude}
                    />
                </div>
                
                <div className='grid gap-1.5 mt-2'>
                    <label htmlFor='addressline' className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Address Line</label>
                    <input
                        type='text'
                        id='addressline' 
                        placeholder='Flat / House No. / Building / Street'
                        className='border border-gray-200 bg-gray-50/50 p-2.5 rounded-lg text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-primary-200/40 focus:border-primary-200 outline-none transition-all duration-200'
                        {...register("address_line",{required : true})}
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
                    className='w-full py-3 mt-4 bg-gradient-to-r from-primary-200 to-primary-100 font-bold text-gray-800 rounded-xl shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 transition-all duration-200 text-sm tracking-wide'
                >
                    Update Address
                </button>
            </form>
        </div>
    </section>
  )
}

export default EditAddressDetails

