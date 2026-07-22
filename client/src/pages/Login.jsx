import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
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

        try {
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
        }



    }
    return (
        <section className='w-full min-h-[75vh] flex items-center justify-center px-4 py-8 bg-transparent animate-in fade-in duration-300'>
            <div className='bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 p-8'>
                <h2 className='font-bold text-xl text-gray-800 text-center mb-2'>Welcome Back</h2>
                <p className='text-xs text-gray-400 text-center mb-5 font-medium'>Log in to your account to continue shopping</p>

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
                    <div className='grid gap-1.5'>
                        <label htmlFor='password' className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Password</label>
                        <div className='bg-slate-50 px-4 py-2.5 border border-slate-200 rounded-xl flex items-center focus-within:border-secondary-200 transition-all'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                className='w-full outline-none bg-transparent text-sm font-medium text-gray-700'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                placeholder='Enter your password'
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
                        <Link to={"/forgot-password"} className='block ml-auto text-xs font-bold text-gray-400 hover:text-secondary-200 transition-colors mt-1'>Forgot password ?</Link>
                    </div>
    
                    <button disabled={!valideValue} className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-sm transition-all duration-200 active:scale-95 my-3 ${valideValue ? "bg-secondary-200 hover:bg-secondary-200/90 hover:shadow text-white shadow-md" : "bg-slate-200 text-slate-400 cursor-not-allowed" }`}>Login</button>

                </form>

                <p className='text-sm text-center text-gray-500 mt-4'>
                    Don't have account? <Link to={"/register"} className='font-extrabold text-secondary-200 hover:text-secondary-200/80 transition-colors'>Register</Link>
                </p>
            </div>
        </section>
    )
}

export default Login

