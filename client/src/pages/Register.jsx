import React, { useState } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

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
    const isPasswordMatch = data.password && data.confirmPassword ? data.password === data.confirmPassword : true

    const handleSubmit = async(e)=>{
        e.preventDefault()
        if(!valideValue || loading) return

        if(data.password !== data.confirmPassword){
            toast.error("Password and confirm password must match")
            return
        }

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.register,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                setData({
                    name : "",
                    email : "",
                    password : "",
                    confirmPassword : ""
                })
                navigate("/login")
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Sign up to access fresh groceries in minutes"
            showBackTo="/"
            backToLabel="Home"
        >
            <form className='grid gap-2.5 sm:gap-3' onSubmit={handleSubmit}>
                <div className='grid gap-1'>
                    <label htmlFor='name' className='font-bold text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-wider pl-1'>Name</label>
                    <div className='bg-slate-50 px-3.5 py-2 sm:py-2.5 border border-slate-200 rounded-xl flex items-center focus-within:border-secondary-200 focus-within:ring-2 focus-within:ring-secondary-200/10 focus-within:bg-white transition-all'>
                        <FiUser className='text-slate-400 mr-2.5' size={16} />
                        <input
                            type='text'
                            id='name'
                            autoFocus
                            className='w-full outline-none bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400'
                            name='name'
                            value={data.name}
                            onChange={handleChange}
                            placeholder='Enter your name'
                        />
                    </div>
                </div>

                <div className='grid gap-1'>
                    <label htmlFor='email' className='font-bold text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-wider pl-1'>Email Address</label>
                    <div className='bg-slate-50 px-3.5 py-2 sm:py-2.5 border border-slate-200 rounded-xl flex items-center focus-within:border-secondary-200 focus-within:ring-2 focus-within:ring-secondary-200/10 focus-within:bg-white transition-all'>
                        <FiMail className='text-slate-400 mr-2.5' size={16} />
                        <input
                            type='email'
                            id='email'
                            className='w-full outline-none bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                        />
                    </div>
                </div>

                <div className='grid gap-1'>
                    <label htmlFor='password' className='font-bold text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-wider pl-1'>Password</label>
                    <div className='bg-slate-50 px-3.5 py-2 sm:py-2.5 border border-slate-200 rounded-xl flex items-center focus-within:border-secondary-200 focus-within:ring-2 focus-within:ring-secondary-200/10 focus-within:bg-white transition-all'>
                        <FiLock className='text-slate-400 mr-2.5' size={16} />
                        <input
                            type={showPassword ? "text" : "password"}
                            id='password'
                            className='w-full outline-none bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400'
                            name='password'
                            value={data.password}
                            onChange={handleChange}
                            placeholder='Enter your password'
                        />
                        <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer text-slate-400 hover:text-slate-600 transition-colors pl-2 select-none'>
                            {
                                showPassword ? (
                                    <FaRegEye size={15} />
                                ) : (
                                    <FaRegEyeSlash size={15} />
                                )
                            }
                        </div>
                    </div>
                </div>

                <div className='grid gap-1'>
                    <label htmlFor='confirmPassword' className='font-bold text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-wider pl-1'>Confirm Password</label>
                    <div className={`bg-slate-50 px-3.5 py-2 sm:py-2.5 border rounded-xl flex items-center transition-all ${!isPasswordMatch ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 focus-within:border-secondary-200 focus-within:ring-2 focus-within:ring-secondary-200/10 focus-within:bg-white'}`}>
                        <FiLock className='text-slate-400 mr-2.5' size={16} />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id='confirmPassword'
                            className='w-full outline-none bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400'
                            name='confirmPassword'
                            value={data.confirmPassword}
                            onChange={handleChange}
                            placeholder='Confirm your password'
                        />
                        <div onClick={() => setShowConfirmPassword(preve => !preve)} className='cursor-pointer text-slate-400 hover:text-slate-600 transition-colors pl-2 select-none'>
                            {
                                showConfirmPassword ? (
                                    <FaRegEye size={15} />
                                ) : (
                                    <FaRegEyeSlash size={15} />
                                )
                            }
                        </div>
                    </div>
                    {!isPasswordMatch && (
                        <span className='text-[10px] font-semibold text-rose-500 pl-1'>Passwords do not match</span>
                    )}
                </div>

                <button 
                    disabled={!valideValue || !isPasswordMatch || loading} 
                    className={`w-full py-2.5 sm:py-3 mt-1 rounded-xl font-extrabold text-xs sm:text-sm tracking-wide transition-all duration-200 active:scale-95 flex justify-center items-center gap-2 ${
                        valideValue && isPasswordMatch && !loading 
                            ? "bg-secondary-200 hover:bg-secondary-200/95 text-white shadow-lg shadow-secondary-200/20 cursor-pointer" 
                            : "bg-slate-100 text-slate-400 cursor-not-allowed" 
                    }`}
                >
                    {
                        loading ? (
                            <>
                                <CgSpinner className='animate-spin text-base' />
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            "Register"
                        )
                    }
                </button>
            </form>

            <p className='text-[11px] sm:text-xs text-center text-slate-400 font-semibold tracking-wide border-t border-slate-100 pt-3'>
                Already have an account? <Link to={"/login"} className='text-secondary-200 hover:underline font-extrabold'>Login</Link>
            </p>
        </AuthLayout>
    )
}

export default Register
