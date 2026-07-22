import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const EditSubCategory = ({close,data,fetchData}) => {
    const [subCategoryData,setSubCategoryData] = useState({
        _id : data._id,
        name : data.name,
        image : data.image,
        category : data.category || []
    })
    const allCategory = useSelector(state => state.product.allCategory)


    const handleChange = (e)=>{
        const { name, value} = e.target 

        setSubCategoryData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handleUploadSubCategoryImage = async(e)=>{
        const file = e.target.files[0]

        if(!file){
            return
        }

        const response = await uploadImage(file)
        const { data : ImageResponse } = response

        setSubCategoryData((preve)=>{
            return{
                ...preve,
                image : ImageResponse.data.url
            }
        })
    }

    const handleRemoveCategorySelected = (categoryId)=>{
        const index = subCategoryData.category.findIndex(el => el._id === categoryId )
        subCategoryData.category.splice(index,1)
        setSubCategoryData((preve)=>{
            return{
                ...preve
            }
        })
    }

    const handleSubmitSubCategory = async(e)=>{
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.updateSubCategory,
                data : subCategoryData
            })

            const { data : responseData } = response

            console.log("responseData",responseData)
            if(responseData.success){
                toast.success(responseData.message)
                if(close){
                    close()
                }
                if(fetchData){
                    fetchData()
                }
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

  return (
    <section className='fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all duration-300'>
        <div className='w-full max-w-2xl bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200'>
            <div className='flex items-center justify-between pb-3 border-b border-slate-100'>
                <h1 className='text-lg font-bold text-gray-800 flex items-center gap-2'>
                    <span className="w-1 h-5 bg-secondary-200 rounded-full"></span>
                    Edit Sub Category
                </h1>
                <button onClick={close} className='text-gray-400 hover:text-gray-600 p-1.5 hover:bg-slate-100 rounded-full transition-all'>
                    <IoClose size={20}/>
                </button>
            </div>
            <form className='grid gap-4 mt-2' onSubmit={handleSubmitSubCategory}>
                    <div className='grid gap-1.5'>
                        <label htmlFor='name' className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Name</label>
                        <input 
                            id='name'
                            name='name'
                            value={subCategoryData.name}
                            onChange={handleChange}
                            className='px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-secondary-200 transition-all text-sm font-medium text-gray-700'
                            placeholder="Enter subcategory name"
                        />
                    </div>
                    <div className='grid gap-1.5'>
                        <p className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Image</p>
                        <div className='flex items-center gap-4'>
                            <div className='border border-slate-200 h-28 w-28 bg-slate-50 rounded-xl flex items-center justify-center p-2 overflow-hidden shadow-inner'>
                                {
                                    !subCategoryData.image ? (
                                        <p className='text-xs text-neutral-400 font-medium'>No Image</p>
                                    ) : (
                                        <img
                                            alt='subCategory'
                                            src={subCategoryData.image}
                                            className='max-h-full max-w-full object-contain'
                                        />
                                    )
                                }
                            </div>
                            <label htmlFor='uploadSubCategoryImage'>
                                <div className='px-4 py-2 border-2 border-dashed border-secondary-200 text-secondary-200 font-bold rounded-xl hover:bg-secondary-200 hover:text-white transition-all cursor-pointer text-xs tracking-wide uppercase select-none active:scale-95'>
                                    Upload Image
                                </div>
                                <input 
                                    type='file'
                                    id='uploadSubCategoryImage'
                                    className='hidden'
                                    onChange={handleUploadSubCategoryImage}
                                />
                            </label>
                            
                        </div>
                    </div>
                    <div className='grid gap-1.5'>
                        <label className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Select Category</label>
                        <div className='border border-slate-200 rounded-xl p-3 bg-slate-50/50 flex flex-col gap-3'>
                            {/*display value**/}
                            <div className='flex flex-wrap gap-2'>
                                {
                                    subCategoryData.category.map((cat,index)=>{
                                        return (
                                            <span key={cat._id+"selectedValue"} className='inline-flex items-center gap-1.5 bg-white text-gray-700 font-semibold px-2.5 py-1 text-xs border border-slate-200 rounded-lg shadow-xs'>
                                                {cat.name}
                                                <button type="button" className='cursor-pointer text-gray-400 hover:text-red-500 transition-colors' onClick={()=>handleRemoveCategorySelected(cat._id)}>
                                                    <IoClose size={14}/>
                                                </button>
                                            </span>
                                        )
                                    })
                                }
                            </div>

                            {/*select category**/}
                            <select
                                className='w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-secondary-200 text-sm text-gray-600 cursor-pointer font-medium'
                                onChange={(e)=>{
                                    const value = e.target.value
                                    if(!value) return
                                    const categoryDetails = allCategory.find(el => el._id == value)
                                    
                                    setSubCategoryData((preve)=>{
                                        return{
                                            ...preve,
                                            category : [...preve.category,categoryDetails]
                                        }
                                    })
                                }}
                            >
                                <option value={""}>Select Category</option>
                                {
                                    allCategory.map((category,index)=>{
                                        return(
                                            <option value={category?._id} key={category._id+"subcategory"}>{category?.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>

                    <button
                        disabled={!(subCategoryData?.name && subCategoryData?.image && subCategoryData?.category[0])}
                        className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide shadow-sm transition-all duration-200 active:scale-95 text-white mt-4
                            ${subCategoryData?.name && subCategoryData?.image && subCategoryData?.category[0] 
                              ? "bg-secondary-200 hover:bg-secondary-200/90 hover:shadow" 
                              : "bg-gray-300 cursor-not-allowed text-gray-500"
                            }
                        `}
                    >
                        Submit
                    </button>
                    
            </form>
        </div>
    </section>
  )
}

export default EditSubCategory

