import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CgSpinner } from "react-icons/cg";
import AuthLayout from '../layouts/AuthLayout';

const OtpVerification = () => {
    const [data, setData] = useState(["", "", "", "", "", ""])
    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [timer, setTimer] = useState(60)
    const navigate = useNavigate()
    const inputRef = useRef([])
    const location = useLocation()
    const userEmail = location?.state?.email

    useEffect(() => {
        if (!userEmail) {
            navigate("/forgot-password")
        }
    }, [userEmail, navigate])

    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [timer])

    const valideValue = data.every(el => el.trim() !== "")

    const handlePaste = (e) => {
        e.preventDefault()
        const pasteData = e.clipboardData.getData('text').trim()
        if (/^\d{6}$/.test(pasteData)) {
            const digits = pasteData.split('')
            setData(digits)
            inputRef.current[5]?.focus()
        } else {
            toast.error("Please paste a valid 6-digit numeric OTP code")
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !data[index] && index > 0) {
            inputRef.current[index - 1]?.focus()
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRef.current[index - 1]?.focus()
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRef.current[index + 1]?.focus()
        }
    }

    const handleResendOtp = async () => {
        if (timer > 0 || resendLoading) return
        try {
            setResendLoading(true)
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data: { email: userEmail }
            })
            if (response.data.error) {
                toast.error(response.data.message)
            }
            if (response.data.success) {
                toast.success("New OTP code has been sent to your email!")
                setTimer(60)
                setData(["", "", "", "", "", ""])
                inputRef.current[0]?.focus()
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setResendLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!valideValue || loading) return

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data: {
                    otp: data.join(""),
                    email: userEmail
                }
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                setData(["", "", "", "", "", ""])
                navigate("/reset-password", {
                    state: {
                        data: response.data,
                        email: userEmail
                    }
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
            title="OTP Verification"
            subtitle={`Enter 6-digit code sent to ${userEmail || 'your email'}`}
            showBackTo="/forgot-password"
            backToLabel="Change Email"
        >
            <form className='grid gap-6' onSubmit={handleSubmit}>
                <div className='grid gap-1.5'>
                    <label htmlFor='otp-0' className='font-bold text-xs text-slate-500 uppercase tracking-wider text-center'>Enter Your OTP</label>
                    <div className='flex items-center gap-2 justify-between mt-2' onPaste={handlePaste}>
                        {
                            data.map((element, index) => {
                                return (
                                    <input
                                        key={"otp" + index}
                                        type='text'
                                        id={`otp-${index}`}
                                        ref={(ref) => {
                                            inputRef.current[index] = ref
                                            return ref
                                        }}
                                        value={data[index]}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onChange={(e) => {
                                            const value = e.target.value.slice(-1)
                                            const newData = [...data]
                                            newData[index] = value
                                            setData(newData)

                                            if (value && index < 5) {
                                                inputRef.current[index + 1]?.focus()
                                            }
                                        }}
                                        maxLength={1}
                                        className='bg-slate-50 w-full max-w-[50px] p-3 border border-slate-200 rounded-xl outline-none focus:border-secondary-200 focus:ring-2 focus:ring-secondary-200/10 focus:bg-white text-center font-extrabold text-xl text-slate-800 transition-all'
                                    />
                                )
                            })
                        }
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
                                <span>Verifying...</span>
                            </>
                        ) : (
                            "Verify OTP"
                        )
                    }
                </button>
            </form>

            <div className='flex items-center justify-between text-xs font-semibold text-slate-400'>
                <span>Didn't receive code?</span>
                <button
                    type='button'
                    onClick={handleResendOtp}
                    disabled={timer > 0 || resendLoading}
                    className={`font-bold transition-colors ${
                        timer > 0 || resendLoading
                            ? "text-slate-300 cursor-not-allowed"
                            : "text-secondary-200 hover:underline cursor-pointer font-extrabold"
                    }`}
                >
                    {resendLoading ? "Resending..." : timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                </button>
            </div>

            <p className='text-xs text-center text-slate-400 font-semibold tracking-wide border-t border-slate-100 pt-4'>
                Already have an account? <Link to={"/login"} className='text-secondary-200 hover:underline font-extrabold'>Login</Link>
            </p>
        </AuthLayout>
    )
}

export default OtpVerification;

