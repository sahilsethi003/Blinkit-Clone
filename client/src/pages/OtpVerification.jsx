import React, { useEffect, useRef, useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OtpVerification = () => {
    const [data, setData] = useState(["","","","","",""])
    const navigate = useNavigate()
    const inputRef = useRef([])
    const location = useLocation()

    console.log("location",location)

    useEffect(()=>{
        if(!location?.state?.email){
            navigate("/forgot-password")
        }
    },[])

    const valideValue = data.every(el => el)

    const handleSubmit = async(e)=>{
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data : {
                    otp : data.join(""),
                    email : location?.state?.email
                }
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                setData(["","","","","",""])
                navigate("/reset-password",{
                    state : {
                        data : response.data,
                        email : location?.state?.email
                    }
                })
            }

        } catch (error) {
            console.log('error',error)
            AxiosToastError(error)
        }



    }

    return (
        <section className='w-full min-h-[75vh] flex items-center justify-center px-4 py-8 bg-transparent animate-in fade-in duration-300'>
            <div className='bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 p-8'>
                <h2 className='font-bold text-xl text-gray-800 text-center mb-2'>OTP Verification</h2>
                <p className='text-xs text-gray-400 text-center mb-5 font-medium'>Enter the 6-digit code sent to your email address</p>

                <form className='grid gap-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1.5'>
                        <label htmlFor='otp' className='font-semibold text-xs text-gray-600 uppercase tracking-wider text-center'>Enter Your OTP</label>
                        <div className='flex items-center gap-2 justify-between mt-3'>
                            {
                                data.map((element,index)=>{
                                    return(
                                        <input
                                            key={"otp"+index}
                                            type='text'
                                            id='otp'
                                            ref={(ref)=>{
                                                inputRef.current[index] = ref
                                                return ref 
                                            }}
                                            value={data[index]}
                                            onChange={(e)=>{
                                                const value =  e.target.value
                                                console.log("value",value)

                                                const newData = [...data]
                                                newData[index] = value
                                                setData(newData)

                                                if(value && index < 5){
                                                    inputRef.current[index+1].focus()
                                                }


                                            }}
                                            maxLength={1}
                                            className='bg-slate-50 w-full max-w-16 p-3 border border-slate-200 rounded-xl outline-none focus:border-secondary-200 text-center font-bold text-lg text-gray-700'
                                        />
                                    )
                                })
                            }
                        </div>
                        
                    </div>
             
                    <button disabled={!valideValue} className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-sm transition-all duration-200 active:scale-95 my-3 ${valideValue ? "bg-secondary-200 hover:bg-secondary-200/90 hover:shadow text-white shadow-md" : "bg-slate-200 text-slate-400 cursor-not-allowed" }`}>Verify OTP</button>

                </form>

                <p className='text-sm text-center text-gray-500 mt-4'>
                    Already have account? <Link to={"/login"} className='font-extrabold text-secondary-200 hover:text-secondary-200/80 transition-colors'>Login</Link>
                </p>
            </div>
        </section>
    )
}

export default OtpVerification



