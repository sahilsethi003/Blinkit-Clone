import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError';

const UploadCategoryModel = ({close, fetchData}) => {
    const [data,setData] = useState({
        name : "",
        image : ""
    })
    const [loading,setLoading] = useState(false)

    const handleOnChange = (e)=>{
        const { name, value} = e.target

        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()


        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.addCategory,
                data : data
            })
            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                close()
                fetchData()
            }
        } catch (error) {
            AxiosToastError(error)
        }finally{
            setLoading(false)
        }
    }

    const handleUploadCategoryImage = async(e)=>{
        const file = e.target.files[0]

        if(!file){
            return
        }

        const response = await uploadImage(file)
        const { data : ImageResponse } = response

        setData((preve)=>{
            return{
                ...preve,
                image : ImageResponse.data.url
            }
        })
    }
  return (
    <section className='fixed inset-0 p-4 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center z-50 transition-all duration-300'>
        <div className='bg-white max-w-2xl w-full p-6 rounded-2xl shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200'>
            <div className='flex items-center justify-between pb-3 border-b border-slate-100'>
                <h1 className='text-lg font-bold text-gray-800 flex items-center gap-2'>
                    <span className="w-1 h-5 bg-secondary-200 rounded-full"></span>
                    Add Category
                </h1>
                <button onClick={close} className='text-gray-400 hover:text-gray-600 p-1.5 hover:bg-slate-100 rounded-full transition-all'>
                    <IoClose size={20}/>
                </button>
            </div>
            <form className='grid gap-4 mt-2' onSubmit={handleSubmit}>
                <div className='grid gap-1.5'>
                    <label id='categoryName' className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Name</label>
                    <input
                        type='text'
                        id='categoryName'
                        placeholder='Enter category name'
                        value={data.name}
                        name='name'
                        onChange={handleOnChange}
                        className='px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-secondary-200 transition-all text-sm font-medium text-gray-700'
                    />
                </div>
                <div className='grid gap-1.5'>
                    <p className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Image</p>
                    <div className='flex gap-4 items-center'>
                        <div className='border border-slate-200 bg-slate-50 h-28 w-28 flex items-center justify-center rounded-xl p-2 overflow-hidden shadow-inner'>
                            {
                                data.image ? (
                                    <img
                                        alt='category'
                                        src={data.image}
                                        className='max-h-full max-w-full object-contain'
                                    />
                                ) : (
                                    <p className='text-xs text-neutral-400 font-medium'>No Image</p>
                                )
                            }
                            
                        </div>
                        <label htmlFor='uploadCategoryImage'>
                            <div className={`
                            ${!data.name ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "border-2 border-dashed border-secondary-200 text-secondary-200 hover:bg-secondary-200 hover:text-white" }  
                                px-4 py-2 rounded-xl cursor-pointer border font-bold text-xs tracking-wide uppercase transition-all select-none active:scale-95
                            `}>Upload Image</div>

                            <input disabled={!data.name} onChange={handleUploadCategoryImage} type='file' id='uploadCategoryImage' className='hidden'/>
                        </label>
                        
                    </div>
                </div>

                <button
                    disabled={!(data.name && data.image)}
                    className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide shadow-sm transition-all duration-200 active:scale-95 text-white mt-4
                    ${data.name && data.image ? "bg-secondary-200 hover:bg-secondary-200/90 hover:shadow" : "bg-gray-300 cursor-not-allowed text-gray-500 "}
                    `}
                >Add Category</button>
            </form>
        </div>
    </section>
  )
}

export default UploadCategoryModel
