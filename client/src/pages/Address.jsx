import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAddress from '../components/AddAddress'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';

const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList)
  const [openAddress,setOpenAddress] = useState(false)
  const [OpenEdit,setOpenEdit] = useState(false)
  const [editData,setEditData] = useState({})
  const { fetchAddress} = useGlobalContext()

  const handleDisableAddress = async(id)=>{
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data : {
          _id : id
        }
      })
      if(response.data.success){
        toast.success("Address Remove")
        if(fetchAddress){
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
  return (
    <div className='bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden'>
        <div className='bg-white px-4 py-4 flex justify-between gap-4 items-center border-b border-slate-100'>
            <h2 className='font-bold text-gray-800 text-lg flex items-center gap-2'>
                <span className="w-1.5 h-6 bg-secondary-200 rounded-full"></span>
                Saved Addresses
            </h2>
            <button onClick={()=>setOpenAddress(true)} className='border border-secondary-200 text-secondary-200 px-4 py-1.5 hover:bg-secondary-200 hover:text-white rounded-full transition-all duration-200 font-bold text-xs tracking-wide shadow-sm'>
                Add Address
            </button>
        </div>
        <div className='p-4 grid gap-4 bg-slate-50/50'>
              {
                addressList.map((address,index)=>{
                  return(
                      <div key={address._id + index} className={`border border-slate-100 rounded-xl p-4 flex gap-4 bg-white shadow-sm hover:shadow-md transition-all duration-300 ${!address.status && 'hidden'}`}>
                          <div className='w-full'>
                            <p className='font-bold text-gray-800 text-sm lg:text-base leading-tight mb-1'>{address.address_line}</p>
                            <p className='text-xs lg:text-sm text-gray-500 font-medium'>{address.city}, {address.state}</p>
                            <p className='text-xs lg:text-sm text-gray-500 font-medium'>{address.country} - {address.pincode}</p>
                            <p className='text-xs font-semibold text-gray-400 mt-2.5 flex items-center gap-1'>
                              <span className="text-[10px] text-slate-300">📞</span> {address.mobile}
                            </p>
                            {address.latitude && address.longitude && (
                              <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${address.latitude},${address.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 mt-3 text-xs text-secondary-200 hover:underline font-bold"
                              >
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-200 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-200"></span>
                                </span>
                                Pinpoint Location
                              </a>
                            )}
                          </div>
                          <div className='flex flex-col gap-2 justify-start'>
                            <button 
                              onClick={()=>{
                                setOpenEdit(true)
                                setEditData(address)
                              }} 
                              className='bg-emerald-50 text-secondary-200 hover:text-white hover:bg-secondary-200 p-2 rounded-lg transition-all duration-200 shadow-sm active:scale-95'
                              title="Edit Address"
                            >
                              <MdEdit size={16} />
                            </button>
                            <button 
                              onClick={()=>handleDisableAddress(address._id)} 
                              className='bg-red-50 text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-all duration-200 shadow-sm active:scale-95'
                              title="Delete Address"
                            >
                              <MdDelete size={16} />  
                            </button>
                          </div>
                      </div>
                  )
                })
              }
              <div 
                onClick={()=>setOpenAddress(true)} 
                className='h-20 bg-white border-2 border-dashed border-slate-200 hover:border-secondary-200 rounded-xl flex justify-center items-center cursor-pointer text-slate-400 hover:text-secondary-200 font-bold transition-all duration-200 text-sm shadow-sm'
              >
                + Add new address
              </div>
        </div>

        {
          openAddress && (
            <AddAddress close={()=>setOpenAddress(false)}/>
          )
        }

        {
          OpenEdit && (
            <EditAddressDetails data={editData} close={()=>setOpenEdit(false)}/>
          )
        }
    </div>
  )
}

export default Address
