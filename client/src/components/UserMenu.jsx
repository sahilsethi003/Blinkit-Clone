import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from '../utils/isAdmin'

const UserMenu = ({close}) => {
   const user = useSelector((state)=> state.user)
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const handleLogout = async()=>{
        try {
          const response = await Axios({
             ...SummaryApi.logout
          })
          console.log("logout",response)
          if(response.data.success){
            if(close){
              close()
            }
            dispatch(logout())
            localStorage.clear()
            toast.success(response.data.message)
            navigate("/login")
          }
        } catch (error) {
          console.log(error)
          AxiosToastError(error)
        }
   }

   const handleClose = ()=>{
      if(close){
        close()
      }
   }
  return (
    <div>
        <div className='font-semibold'>My Account</div>
        <div className='text-sm flex items-center gap-2'>
          <span className='max-w-52 text-ellipsis line-clamp-1'>{user.name || user.mobile} <span className='text-medium text-red-600'>{user.role === "ADMIN" ? "(Admin)" : "" }</span></span>
          <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:text-primary-200'>
            <HiOutlineExternalLink size={15}/>
          </Link>
        </div>

        <Divider/>

        <div className='text-sm grid gap-1 mt-3'>
            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/category"} className='px-3 py-2 hover:bg-slate-50 hover:text-secondary-200 rounded-lg transition-all duration-200 font-bold text-gray-700'>Category</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/subcategory"} className='px-3 py-2 hover:bg-slate-50 hover:text-secondary-200 rounded-lg transition-all duration-200 font-bold text-gray-700'>Sub Category</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/upload-product"} className='px-3 py-2 hover:bg-slate-50 hover:text-secondary-200 rounded-lg transition-all duration-200 font-bold text-gray-700'>Upload Product</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/product"} className='px-3 py-2 hover:bg-slate-50 hover:text-secondary-200 rounded-lg transition-all duration-200 font-bold text-gray-700'>Product</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/promocode"} className='px-3 py-2 hover:bg-slate-50 hover:text-secondary-200 rounded-lg transition-all duration-200 font-bold text-gray-700 flex items-center justify-between'>
                  <span>Promo Codes</span>
                  <span className='bg-emerald-100 text-secondary-200 text-[10px] px-1.5 py-0.5 rounded font-black'>NEW</span>
                </Link>
              )
            }

            <Link onClick={handleClose} to={"/dashboard/myorders"} className='px-3 py-2 hover:bg-slate-50 hover:text-secondary-200 rounded-lg transition-all duration-200 font-bold text-gray-700'>My Orders</Link>

            <Link onClick={handleClose} to={"/dashboard/address"} className='px-3 py-2 hover:bg-slate-50 hover:text-secondary-200 rounded-lg transition-all duration-200 font-bold text-gray-700'>Save Address</Link>

            <button onClick={handleLogout} className='text-left px-3 py-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 font-bold text-gray-700'>Log Out</button>

        </div>
    </div>
  )
}

export default UserMenu
