import React, { useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { updatedAvatar } from '../store/userSlice'
import { IoClose } from "react-icons/io5";
import { FiUpload, FiLoader } from "react-icons/fi";

const UserProfileAvatarEdit = ({close}) => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [loading,setLoading] = useState(false)

    const handleSubmit = (e)=>{
        e.preventDefault()
    }

    const handleUploadAvatarImage = async(e)=>{
        const file = e.target.files[0]

        if(!file){
            return
        }

        const formData = new FormData()
        formData.append('avatar',file)

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.uploadAvatar,
                data : formData
            })
            const { data : responseData}  = response

            dispatch(updatedAvatar(responseData.data.avatar))
            close()

        } catch (error) {
            AxiosToastError(error)
        } finally{
            setLoading(false)
        }

    }
  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-950/60 backdrop-blur-sm p-4 flex items-center justify-center z-50 transition-all duration-300'>
        <div className='bg-white max-w-sm w-full rounded-2xl p-6 flex flex-col items-center justify-center shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-200'>
            {/** Close Button */}
            <button 
                onClick={close} 
                className='absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-1.5 rounded-full transition-all duration-200'
                title="Close"
            >
                <IoClose size={20}/>
            </button>

            {/** Modal Title */}
            <div className='text-center mt-2'>
                <h3 className='font-bold text-lg text-neutral-800'>Upload Profile Picture</h3>
                <p className='text-xs text-neutral-500 mt-1 max-w-[240px]'>Choose a new image file from your device to update your avatar.</p>
            </div>

            {/** Preview Area */}
            <div className='w-28 h-28 bg-slate-50 flex items-center justify-center rounded-full overflow-hidden border-2 border-slate-200 shadow-inner mt-6 mb-6 relative group'>
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
            </div>

            {/** Upload Form */}
            <form onSubmit={handleSubmit} className='w-full'>
                <label htmlFor='uploadProfile' className='block w-full'>
                    <div className='w-full bg-primary-200 hover:bg-primary-100 text-neutral-800 font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg active:shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 text-sm select-none'>
                        {
                            loading ? (
                                <>
                                    <FiLoader className='animate-spin' size={18} />
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <FiUpload size={18} />
                                    <span>Choose Image</span>
                                </>
                            )
                        }
                    </div>
                    <input 
                        onChange={handleUploadAvatarImage} 
                        disabled={loading} 
                        type='file' 
                        id='uploadProfile' 
                        className='hidden' 
                        accept="image/*"
                    />
                </label>
            </form>
            
        </div>
    </section>
  )
}

export default UserProfileAvatarEdit
