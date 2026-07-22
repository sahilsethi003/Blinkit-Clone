import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import { FiUser, FiMail, FiPhone, FiCamera, FiLoader } from "react-icons/fi";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';


const Profile = () => {
    const user = useSelector(state => state.user)
    const [openProfileAvatarEdit,setProfileAvatarEdit] = useState(false)
    const [userData,setUserData] = useState({
        name : user.name,
        email : user.email,
        mobile : user.mobile,
    })
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(()=>{
        setUserData({
            name : user.name,
            email : user.email,
            mobile : user.mobile,
        })
    },[user])

    const handleOnChange  = (e)=>{
        const { name, value} = e.target 

        setUserData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data : userData
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
            }

        } catch (error) {
            AxiosToastError(error)
        } finally{
            setLoading(false)
        }

    }
  return (
    <div className='relative'>
        {/** Profile decorative banner */}
        <div className='h-36 bg-gradient-to-r from-secondary-100 via-slate-800 to-slate-900 relative rounded-t-2xl'>
            <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100/10 via-transparent to-transparent'></div>
        </div>

        {/** Profile avatar section */}
        <div className='px-8 pb-8 relative'>
            <div className='absolute -top-16 left-8 flex items-end gap-4'>
                <div className='relative w-28 h-28 rounded-full border-4 border-white bg-slate-100 shadow-md overflow-hidden group flex items-center justify-center'>
                    {
                        user.avatar ? (
                            <img 
                              alt={user.name}
                              src={user.avatar}
                              className='w-full h-full object-cover'
                            />
                        ) : (
                            <FaRegUserCircle className='w-full h-full text-slate-300 p-1'/>
                        )
                    }
                    {/** Hover overlay */}
                    <div 
                        onClick={() => setProfileAvatarEdit(true)} 
                        className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 cursor-pointer'
                    >
                        <span className='text-xs text-white font-medium'>Change Photo</span>
                    </div>
                </div>
                
                {/** Floating Action Button for camera */}
                <button 
                    type="button"
                    onClick={() => setProfileAvatarEdit(true)}
                    className='bg-primary-200 hover:bg-primary-100 text-neutral-800 p-2.5 rounded-full border-2 border-white shadow-md transition-all hover:scale-110 absolute bottom-0 -right-2'
                    title="Upload profile picture"
                >
                    <FiCamera size={16} />
                </button>
            </div>

            {/** Spacer and Profile Header */}
            <div className='pt-16'>
                <h2 className='text-2xl font-bold text-neutral-800 flex items-center gap-2'>
                    Profile Settings
                    {user.role === "ADMIN" && (
                        <span className='text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-semibold border border-red-100'>Admin</span>
                    )}
                </h2>
                <p className='text-sm text-neutral-500 mt-1'>Update your personal details and account contact information.</p>
            </div>

            {/** Edit Modal */}
            {
                openProfileAvatarEdit && (
                    <UserProfileAvatarEdit close={()=>setProfileAvatarEdit(false)}/>
                )
            }

            {/** Form details */}
            <form className='mt-8 max-w-2xl' onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/** Name Field */}
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='name' className='text-sm font-semibold text-neutral-600'>Full Name</label>
                        <div className='relative flex items-center'>
                            <FiUser className='absolute left-3.5 text-neutral-400 transition-colors' size={18} />
                            <input
                                type='text'
                                id='name'
                                placeholder='Enter your name' 
                                className='w-full pl-10 pr-4 py-3 bg-neutral-50 hover:bg-neutral-100/50 focus:bg-white outline-none border border-neutral-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-100/20 rounded-xl transition-all text-neutral-800 font-medium'
                                value={userData.name}
                                name='name'
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                    </div>

                    {/** Email Field */}
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='email' className='text-sm font-semibold text-neutral-600'>Email Address</label>
                        <div className='relative flex items-center'>
                            <FiMail className='absolute left-3.5 text-neutral-400 transition-colors' size={18} />
                            <input
                                type='email'
                                id='email'
                                placeholder='Enter your email' 
                                className='w-full pl-10 pr-4 py-3 bg-neutral-50 hover:bg-neutral-100/50 focus:bg-white outline-none border border-neutral-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-100/20 rounded-xl transition-all text-neutral-800 font-medium'
                                value={userData.email}
                                name='email'
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                    </div>

                    {/** Mobile Field */}
                    <div className='flex flex-col gap-2 md:col-span-2'>
                        <label htmlFor='mobile' className='text-sm font-semibold text-neutral-600'>Mobile Number</label>
                        <div className='relative flex items-center'>
                            <FiPhone className='absolute left-3.5 text-neutral-400 transition-colors' size={18} />
                            <input
                                type='text'
                                id='mobile'
                                placeholder='Enter your mobile number' 
                                className='w-full pl-10 pr-4 py-3 bg-neutral-50 hover:bg-neutral-100/50 focus:bg-white outline-none border border-neutral-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-100/20 rounded-xl transition-all text-neutral-800 font-medium'
                                value={userData.mobile}
                                name='mobile'
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className='mt-8 flex justify-end'>
                    <button 
                        type='submit'
                        disabled={loading}
                        className='w-full md:w-auto bg-primary-200 hover:bg-primary-100 text-neutral-800 font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg active:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2'
                    >
                        {
                            loading ? (
                                <>
                                    <FiLoader className='animate-spin' size={18} />
                                    <span>Saving Changes...</span>
                                </>
                            ) : (
                                <span>Save Changes</span>
                            )
                        }
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Profile

