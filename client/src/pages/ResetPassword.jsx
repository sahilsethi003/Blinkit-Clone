import React, { useEffect, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import { FiLock } from 'react-icons/fi'
import { CgSpinner } from 'react-icons/cg'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import AuthLayout from '../layouts/AuthLayout'

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const valideValue = Object.values(data).every(el => el)
    const isPasswordMatch = data.newPassword && data.confirmPassword ? data.newPassword === data.confirmPassword : true

    useEffect(() => {
        if (!(location?.state?.data?.success)) {
            navigate("/")
        }

        if (location?.state?.email) {
            setData((preve) => {
                return {
                    ...preve,
                    email: location?.state?.email
                }
            })
        }
    }, [location, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!valideValue || loading) return

        if (data.newPassword !== data.confirmPassword) {
            toast.error("New password and confirm password must match.")
            return
        }

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.resetPassword,
                data: data
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                navigate("/login")
                setData({
                    email: "",
                    newPassword: "",
                    confirmPassword: ""
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
            title="Reset Password"
            subtitle="Enter your new secure password details below"
            showBackTo="/login"
            backToLabel="Login"
        >
            <form className='grid gap-4' onSubmit={handleSubmit}>
                <div className='grid gap-1.5'>
                    <label htmlFor='newPassword' className='font-bold text-xs text-slate-500 uppercase tracking-wider pl-1'>New Password</label>
                    <div className='bg-slate-50 px-4 py-3 border border-slate-200 rounded-xl flex items-center focus-within:border-secondary-200 focus-within:ring-2 focus-within:ring-secondary-200/10 focus-within:bg-white transition-all'>
                        <FiLock className='text-slate-400 mr-3' size={18} />
                        <input
                            type={showPassword ? "text" : "password"}
                            id='newPassword'
                            autoFocus
                            className='w-full outline-none bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400'
                            name='newPassword'
                            value={data.newPassword}
                            onChange={handleChange}
                            placeholder='Enter your new password'
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
                </div>

                <div className='grid gap-1.5'>
                    <label htmlFor='confirmPassword' className='font-bold text-xs text-slate-500 uppercase tracking-wider pl-1'>Confirm Password</label>
                    <div className={`bg-slate-50 px-4 py-3 border rounded-xl flex items-center transition-all ${!isPasswordMatch ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 focus-within:border-secondary-200 focus-within:ring-2 focus-within:ring-secondary-200/10 focus-within:bg-white'}`}>
                        <FiLock className='text-slate-400 mr-3' size={18} />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id='confirmPassword'
                            className='w-full outline-none bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400'
                            name='confirmPassword'
                            value={data.confirmPassword}
                            onChange={handleChange}
                            placeholder='Confirm your new password'
                        />
                        <div onClick={() => setShowConfirmPassword(preve => !preve)} className='cursor-pointer text-slate-400 hover:text-slate-600 transition-colors pl-2 select-none'>
                            {
                                showConfirmPassword ? (
                                    <FaRegEye size={16} />
                                ) : (
                                    <FaRegEyeSlash size={16} />
                                )
                            }
                        </div>
                    </div>
                    {!isPasswordMatch && (
                        <span className='text-[11px] font-semibold text-rose-500 pl-1'>Passwords do not match</span>
                    )}
                </div>

                <button
                    disabled={!valideValue || !isPasswordMatch || loading}
                    className={`w-full py-3.5 mt-2 rounded-xl font-extrabold text-sm tracking-wide transition-all duration-200 active:scale-95 flex justify-center items-center gap-2 ${
                        valideValue && isPasswordMatch && !loading
                            ? "bg-secondary-200 hover:bg-secondary-200/95 text-white shadow-lg shadow-secondary-200/20 cursor-pointer"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                >
                    {
                        loading ? (
                            <>
                                <CgSpinner className='animate-spin text-lg' />
                                <span>Changing Password...</span>
                            </>
                        ) : (
                            "Change Password"
                        )
                    }
                </button>
            </form>

            <p className='text-xs text-center text-slate-400 font-semibold tracking-wide border-t border-slate-100 pt-4'>
                Already have an account? <Link to={"/login"} className='text-secondary-200 hover:underline font-extrabold'>Login</Link>
            </p>
        </AuthLayout>
    )
}

export default ResetPassword
