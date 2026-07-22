import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [data, setData] = useState({
        email: "",
    })
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

        try {
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
        }



    }

    return (
        <section className='w-full min-h-[75vh] flex items-center justify-center px-4 py-8 bg-transparent animate-in fade-in duration-300'>
            <div className='bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 p-8'>
                <h2 className='font-bold text-xl text-gray-800 text-center mb-2'>Forgot Password</h2>
                <p className='text-xs text-gray-400 text-center mb-5 font-medium'>Enter your email to receive a password reset OTP</p>

                <form className='grid gap-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1.5'>
                        <label htmlFor='email' className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Email</label>
                        <input
                            type='email'
                            id='email'
                            className='px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-secondary-200 transition-all text-sm font-medium text-gray-700'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                        />
                    </div>
             
                    <button disabled={!valideValue} className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-sm transition-all duration-200 active:scale-95 my-3 ${valideValue ? "bg-secondary-200 hover:bg-secondary-200/90 hover:shadow text-white shadow-md" : "bg-slate-200 text-slate-400 cursor-not-allowed" }`}>Send OTP</button>

                </form>

                <p className='text-sm text-center text-gray-500 mt-4'>
                    Already have account? <Link to={"/login"} className='font-extrabold text-secondary-200 hover:text-secondary-200/80 transition-colors'>Login</Link>
                </p>
            </div>
        </section>
    )
}

export default ForgotPassword


