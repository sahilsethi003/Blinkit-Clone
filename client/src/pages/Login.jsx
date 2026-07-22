import React, { useState } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { FiMail, FiLock } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import AuthLayout from '../layouts/AuthLayout';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const valideValue = Object.values(data).every(el => el)

    const handleSubmit = async(e)=>{
        e.preventDefault()
        if(!valideValue || loading) return

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.login,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                localStorage.setItem('accesstoken',response.data.data.accesstoken)
                localStorage.setItem('refreshToken',response.data.data.refreshToken)

                const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))

                setData({
                    email : "",
                    password : "",
                })
                navigate("/")
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout 
            title="Welcome Back" 
            subtitle="Sign in to continue shopping fresh groceries"
            showBackTo="/"
            backToLabel="Home"
        >
            <form className='grid gap-4' onSubmit={handleSubmit}>
                <div className='grid gap-1.5'>
                    <label htmlFor='email' className='font-bold text-xs text-slate-500 uppercase tracking-wider pl-1'>Email Address</label>
                    <div className='bg-slate-50 px-4 py-3 border border-slate-200 rounded-xl flex items-center focus-within:border-secondary-200 focus-within:ring-2 focus-within:ring-secondary-200/10 focus-within:bg-white transition-all'>
                        <FiMail className='text-slate-400 mr-3' size={18} />
                        <input
                            type='email'
                            id='email'
                            autoFocus
                            className='w-full outline-none bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                        />
                    </div>
                </div>

                <div className='grid gap-1.5'>
                    <label htmlFor='password' className='font-bold text-xs text-slate-500 uppercase tracking-wider pl-1'>Password</label>
                    <div className='bg-slate-50 px-4 py-3 border border-slate-200 rounded-xl flex items-center focus-within:border-secondary-200 focus-within:ring-2 focus-within:ring-secondary-200/10 focus-within:bg-white transition-all'>
                        <FiLock className='text-slate-400 mr-3' size={18} />
                        <input
                            type={showPassword ? "text" : "password"}
                            id='password'
                            className='w-full outline-none bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400'
                            name='password'
                            value={data.password}
                            onChange={handleChange}
                            placeholder='Enter your password'
                        />
                        <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer text-slate-400 hover:text-slate-600 transition-colors pl-2 select-none'>
                            {
                                showPassword ? (
                                    <FaRegEye size={16} />
                                ) : (
                                    <FaRegEyeSlash size={16} />
                                )
                            }
                        </div>
                    </div>
                    <Link to={"/forgot-password"} className='block ml-auto text-xs font-bold text-gray-400 hover:text-secondary-200 transition-colors mt-0.5 pl-1'>Forgot Password?</Link>
                </div>

                <button 
                    disabled={!valideValue || loading} 
                    className={`w-full py-3.5 mt-2 rounded-xl font-extrabold text-sm tracking-wide transition-all duration-200 active:scale-95 flex justify-center items-center gap-2 ${
                        valideValue && !loading
                            ? "bg-secondary-200 hover:bg-secondary-200/95 text-white shadow-lg shadow-secondary-200/20 cursor-pointer" 
                            : "bg-slate-100 text-slate-400 cursor-not-allowed" 
                    }`}
                >
                    {
                        loading ? (
                            <>
                                <CgSpinner className='animate-spin text-lg' />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            "Login"
                        )
                    }
                </button>
            </form>

            <p className='text-xs text-center text-slate-400 font-semibold tracking-wide border-t border-slate-100 pt-4'>
                Don't have an account? <Link to={"/register"} className='text-secondary-200 hover:underline font-extrabold'>Register</Link>
            </p>
        </AuthLayout>
    )
}

export default Login
