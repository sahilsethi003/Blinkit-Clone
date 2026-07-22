import React, { useEffect, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [data,setData] = useState({
    email : "",
    newPassword : "",
    confirmPassword : ""
  })
  const [showPassword,setShowPassword] = useState(false)
  const [showConfirmPassword,setShowConfirmPassword] = useState(false)

  const valideValue = Object.values(data).every(el => el)

  useEffect(()=>{
    if(!(location?.state?.data?.success)){
        navigate("/")
    }

    if(location?.state?.email){
        setData((preve)=>{
            return{
                ...preve,
                email : location?.state?.email
            }
        })
    }
  },[])

  const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

  console.log("data reset password",data)

  const handleSubmit = async(e)=>{
    e.preventDefault()

    ///optional 
    if(data.newPassword !== data.confirmPassword){
        toast.error("New password and confirm password must be same.")
        return
    }

    try {
        const response = await Axios({
            ...SummaryApi.resetPassword, //change
            data : data
        })
        
        if(response.data.error){
            toast.error(response.data.message)
        }

        if(response.data.success){
            toast.success(response.data.message)
            navigate("/login")
            setData({
                email : "",
                newPassword : "",
                confirmPassword : ""
            })
            
        }

    } catch (error) {
        AxiosToastError(error)
    }



}

  return (
    <section className='w-full min-h-[75vh] flex items-center justify-center px-4 py-8 bg-transparent animate-in fade-in duration-300'>
            <div className='bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 p-8'>
                <h2 className='font-bold text-xl text-gray-800 text-center mb-2'>Reset Password</h2>
                <p className='text-xs text-gray-400 text-center mb-5 font-medium'>Enter your new secure password details below</p>

                <form className='grid gap-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1.5'>
                        <label htmlFor='newPassword' className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>New Password</label>
                        <div className='bg-slate-50 px-4 py-2.5 border border-slate-200 rounded-xl flex items-center focus-within:border-secondary-200 transition-all'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='newPassword'
                                className='w-full outline-none bg-transparent text-sm font-medium text-gray-700'
                                name='newPassword'
                                value={data.newPassword}
                                onChange={handleChange}
                                placeholder='Enter your new password'
                            />
                            <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer text-gray-400 hover:text-gray-600 transition-colors pl-2'>
                                {
                                    showPassword ? (
                                        <FaRegEye size={16} />
                                    ) : (
                                        <FaRegEyeSlash size={16} />
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <div className='grid gap-1.5'>
                        <label htmlFor='confirmPassword' className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Confirm Password</label>
                        <div className='bg-slate-50 px-4 py-2.5 border border-slate-200 rounded-xl flex items-center focus-within:border-secondary-200 transition-all'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id='confirmPassword'
                                className='w-full outline-none bg-transparent text-sm font-medium text-gray-700'
                                name='confirmPassword'
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder='Enter your confirm password'
                            />
                            <div onClick={() => setShowConfirmPassword(preve => !preve)} className='cursor-pointer text-gray-400 hover:text-gray-600 transition-colors pl-2'>
                                {
                                    showConfirmPassword ? (
                                        <FaRegEye size={16} />
                                    ) : (
                                        <FaRegEyeSlash size={16} />
                                    )
                                }
                            </div>
                        </div>
                    </div>
             
                    <button disabled={!valideValue} className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-sm transition-all duration-200 active:scale-95 my-3 ${valideValue ? "bg-secondary-200 hover:bg-secondary-200/90 hover:shadow text-white shadow-md" : "bg-slate-200 text-slate-400 cursor-not-allowed" }`}>Change Password</button>

                </form>

                <p className='text-sm text-center text-gray-500 mt-4'>
                    Already have account? <Link to={"/login"} className='font-extrabold text-secondary-200 hover:text-secondary-200/80 transition-colors'>Login</Link>
                </p>
            </div>
        </section>
  )
}

export default ResetPassword
