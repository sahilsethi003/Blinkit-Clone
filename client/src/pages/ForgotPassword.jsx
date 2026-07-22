import React, { useState } from 'react'
import { FiMail } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';

const ForgotPassword = () => {
    const [data, setData] = useState({
        email: "",
    })
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

    const handleSubmit = async(e)=>{
        e.preventDefault()
        if(!valideValue || loading) return

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                navigate("/verification-otp",{
                  state : data
                })
                setData({
                    email : "",
                })
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Forgot Password"
            subtitle="Enter your email to receive a password reset OTP"
            showBackTo="/login"
            backToLabel="Login"
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
                            placeholder='Enter your registered email'
                        />
                    </div>
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
                                <span>Sending OTP...</span>
                            </>
                        ) : (
                            "Send OTP"
                        )
                    }
                </button>
            </form>

            <p className='text-xs text-center text-slate-400 font-semibold tracking-wide border-t border-slate-100 pt-4'>
                Remembered password? <Link to={"/login"} className='text-secondary-200 hover:underline font-extrabold'>Login</Link>
            </p>
        </AuthLayout>
    )
}

export default ForgotPassword;

