import React, { useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import { useEffect } from 'react';

const UploadProduct = () => {
  const [data,setData] = useState({
      name : "",
      image : [],
      category : [],
      subCategory : [],
      unit : "",
      stock : "",
      price : "",
      discount : "",
      description : "",
      more_details : {},
  })
  const [imageLoading,setImageLoading] = useState(false)
  const [ViewImageURL,setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory,setSelectCategory] = useState("")
  const [selectSubCategory,setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const [openAddField,setOpenAddField] = useState(false)
  const [fieldName,setFieldName] = useState("")


  const handleChange = (e)=>{
    const { name, value} = e.target 

    setData((preve)=>{
      return{
          ...preve,
          [name]  : value
      }
    })
  }

  const handleUploadImage = async(e)=>{
    const file = e.target.files[0]

    if(!file){
      return 
    }
    setImageLoading(true)
    const response = await uploadImage(file)
    const { data : ImageResponse } = response
    const imageUrl = ImageResponse.data.url 

    setData((preve)=>{
      return{
        ...preve,
        image : [...preve.image,imageUrl]
      }
    })
    setImageLoading(false)

  }

  const handleDeleteImage = async(index)=>{
      data.image.splice(index,1)
      setData((preve)=>{
        return{
            ...preve
        }
      })
  }

  const handleRemoveCategory = async(index)=>{
    data.category.splice(index,1)
    setData((preve)=>{
      return{
        ...preve
      }
    })
  }
  const handleRemoveSubCategory = async(index)=>{
      data.subCategory.splice(index,1)
      setData((preve)=>{
        return{
          ...preve
        }
      })
  }

  const handleAddField = ()=>{
    setData((preve)=>{
      return{
          ...preve,
          more_details : {
            ...preve.more_details,
            [fieldName] : ""
          }
      }
    })
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    console.log("data",data)

    try {
      const response = await Axios({
          ...SummaryApi.createProduct,
          data : data
      })
      const { data : responseData} = response

      if(responseData.success){
          successAlert(responseData.message)
          setData({
            name : "",
            image : [],
            category : [],
            subCategory : [],
            unit : "",
            stock : "",
            price : "",
            discount : "",
            description : "",
            more_details : {},
          })

      }
    } catch (error) {
        AxiosToastError(error)
    }


  }

  // useEffect(()=>{
  //   successAlert("Upload successfully")
  // },[])
  return (
    <div className='bg-white'>
        <div className='bg-white px-6 py-4 flex items-center gap-2 border-b border-slate-100'>
            <span className="w-1.5 h-6 bg-secondary-200 rounded-full"></span>
            <h2 className='font-bold text-gray-800 text-lg'>Upload Product</h2>
        </div>
        <div className='p-6 bg-slate-50/50 min-h-[80vh]'>
            <form className='grid gap-5 max-w-3xl' onSubmit={handleSubmit}>
                <div className='grid gap-1.5'>
                  <label htmlFor='name' className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Product Name</label>
                  <input 
                    id='name'
                    type='text'
                    placeholder='Enter product name'
                    name='name'
                    value={data.name}
                    onChange={handleChange}
                    required
                    className='px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-secondary-200 transition-all text-sm font-medium text-gray-700 shadow-xs'
                  />
                </div>
                <div className='grid gap-1.5'>
                  <label htmlFor='description' className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Description</label>
                  <textarea 
                    id='description'
                    placeholder='Enter product description'
                    name='description'
                    value={data.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className='px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-secondary-200 transition-all text-sm font-medium text-gray-700 shadow-xs resize-none'
                  />
                </div>
                <div className='grid gap-1.5'>
                    <p className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Product Images</p>
                    <div className="grid gap-3.5">
                      <label htmlFor='productImage' className='bg-white h-28 border-2 border-dashed border-slate-200 hover:border-secondary-200 hover:text-secondary-200 rounded-2xl flex justify-center items-center cursor-pointer text-slate-400 font-bold transition-all duration-200 text-sm shadow-xs select-none'>
                          <div className='text-center flex justify-center items-center flex-col gap-1.5'>
                            {
                              imageLoading ?  <Loading/> : (
                                <>
                                   <FaCloudUploadAlt size={28} className="text-gray-400 group-hover:text-secondary-200" />
                                   <p className="text-xs uppercase tracking-wider">Upload Product Image</p>
                                </>
                              )
                            }
                          </div>
                          <input 
                            type='file'
                            id='productImage'
                            className='hidden'
                            accept='image/*'
                            onChange={handleUploadImage}
                          />
                      </label>
                      {/**display uploaded image*/}
                      {data.image[0] && (
                        <div className='flex flex-wrap gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs'>
                          {
                            data.image.map((img,index) => {
                                return(
                                  <div key={img+index} className='h-20 w-20 min-w-20 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden relative group shadow-sm flex items-center justify-center p-1.5'>
                                    <img
                                      src={img}
                                      alt={img}
                                      className='max-h-full max-w-full object-contain cursor-pointer' 
                                      onClick={()=>setViewImageURL(img)}
                                    />
                                    <div onClick={()=>handleDeleteImage(index)} className='absolute top-1 right-1 p-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer shadow-md'>
                                      <MdDelete size={14} />
                                    </div>
                                  </div>
                                )
                            })
                          }
                        </div>
                      )}
                    </div>

                </div>
                <div className='grid gap-1.5'>
                  <label className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Category</label>
                  <div className="flex flex-col gap-2">
                    <select
                      className='w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-secondary-200 text-sm text-gray-600 cursor-pointer font-medium shadow-xs'
                      value={selectCategory}
                      onChange={(e)=>{
                        const value = e.target.value 
                        if (!value) return
                        const category = allCategory.find(el => el._id === value )
                        
                        setData((preve)=>{
                          return{
                            ...preve,
                            category : [...preve.category,category],
                          }
                        })
                        setSelectCategory("")
                      }}
                    >
                      <option value={""}>Select Category</option>
                      {
                        allCategory.map((c,index)=>{
                          return(
                            <option value={c?._id} key={c._id + "selectCat"}>{c.name}</option>
                          )
                        })
                      }
                    </select>
                    {data.category[0] && (
                      <div className='flex flex-wrap gap-2.5 p-2 bg-white rounded-xl border border-slate-100 shadow-xs'>
                        {
                          data.category.map((c,index)=>{
                            return(
                              <span key={c._id+index+"productsection"} className='inline-flex items-center gap-1.5 bg-slate-50 text-gray-700 font-semibold px-2.5 py-1 text-xs border border-slate-200 rounded-lg shadow-xs'>
                                {c.name}
                                <button type="button" className='hover:text-red-500 cursor-pointer transition-colors text-gray-400' onClick={()=>handleRemoveCategory(index)}>
                                  <IoClose size={14}/>
                                </button>
                              </span>
                            )
                          })
                        }
                      </div>
                    )}
                  </div>
                </div>
                <div className='grid gap-1.5'>
                  <label className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Sub Category</label>
                  <div className="flex flex-col gap-2">
                    <select
                      className='w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-secondary-200 text-sm text-gray-600 cursor-pointer font-medium shadow-xs'
                      value={selectSubCategory}
                      onChange={(e)=>{
                        const value = e.target.value 
                        if (!value) return
                        const subCategory = allSubCategory.find(el => el._id === value )
 
                        setData((preve)=>{
                          return{
                            ...preve,
                            subCategory : [...preve.subCategory,subCategory]
                          }
                        })
                        setSelectSubCategory("")
                      }}
                    >
                      <option value={""} className='text-neutral-600'>Select Sub Category</option>
                      {
                        allSubCategory.map((c,index)=>{
                          return(
                            <option value={c?._id} key={c._id + "selectSubCat"}>{c.name}</option>
                          )
                        })
                      }
                    </select>
                    {data.subCategory[0] && (
                      <div className='flex flex-wrap gap-2.5 p-2 bg-white rounded-xl border border-slate-100 shadow-xs'>
                        {
                          data.subCategory.map((c,index)=>{
                            return(
                              <span key={c._id+index+"productsection"} className='inline-flex items-center gap-1.5 bg-slate-50 text-gray-700 font-semibold px-2.5 py-1 text-xs border border-slate-200 rounded-lg shadow-xs'>
                                {c.name}
                                <button type="button" className='hover:text-red-500 cursor-pointer transition-colors text-gray-400' onClick={()=>handleRemoveSubCategory(index)}>
                                  <IoClose size={14}/>
                                </button>
                              </span>
                            )
                          })
                        }
                      </div>
                    )}
                  </div>
                </div>
 
                <div className='grid gap-1.5'>
                  <label htmlFor='unit' className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Unit (e.g., 500g, 1L)</label>
                  <input 
                    id='unit'
                    type='text'
                    placeholder='Enter product unit'
                    name='unit'
                    value={data.unit}
                    onChange={handleChange}
                    required
                    className='px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-secondary-200 transition-all text-sm font-medium text-gray-700 shadow-xs'
                  />
                </div>
 
                <div className='grid gap-1.5'>
                  <label htmlFor='stock' className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Number of Stock</label>
                  <input 
                    id='stock'
                    type='number'
                    placeholder='Enter product stock'
                    name='stock'
                    value={data.stock}
                    onChange={handleChange}
                    required
                    className='px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-secondary-200 transition-all text-sm font-medium text-gray-700 shadow-xs'
                  />
                </div>
 
                <div className='grid gap-1.5'>
                  <label htmlFor='price' className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Price (INR)</label>
                  <input 
                    id='price'
                    type='number'
                    placeholder='Enter product price'
                    name='price'
                    value={data.price}
                    onChange={handleChange}
                    required
                    className='px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-secondary-200 transition-all text-sm font-medium text-gray-700 shadow-xs'
                  />
                </div>
 
                <div className='grid gap-1.5'>
                  <label htmlFor='discount' className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>Discount (%)</label>
                  <input 
                    id='discount'
                    type='number'
                    placeholder='Enter product discount'
                    name='discount'
                    value={data.discount}
                    onChange={handleChange}
                    required
                    className='px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-secondary-200 transition-all text-sm font-medium text-gray-700 shadow-xs'
                  />
                </div>
 
 
                {/**add more field**/}
                  {
                    Object?.keys(data?.more_details)?.map((k,index)=>{
                        return(
                          <div className='grid gap-1.5' key={k+index}>
                            <label htmlFor={k} className='font-semibold text-xs text-gray-600 uppercase tracking-wider'>{k}</label>
                            <input 
                              id={k}
                              type='text'
                              value={data?.more_details[k]}
                              onChange={(e)=>{
                                  const value = e.target.value 
                                  setData((preve)=>{
                                    return{
                                        ...preve,
                                        more_details : {
                                          ...preve.more_details,
                                          [k] : value
                                        }
                                    }
                                  })
                              }}
                              required
                              className='px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-secondary-200 transition-all text-sm font-medium text-gray-700 shadow-xs'
                            />
                          </div>
                        )
                    })
                  }
 
                <div onClick={()=>setOpenAddField(true)} className='border-2 border-dashed border-secondary-200 hover:bg-secondary-200 hover:text-white text-secondary-200 font-bold text-xs tracking-wide uppercase px-4 py-2 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer text-center select-none shadow-xs w-36 mt-2'>
                  Add Fields
                </div>
 
                <button
                  className='w-full py-3.5 bg-secondary-200 hover:bg-secondary-200/95 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 mt-4'
                >
                  Submit Product
                </button>
            </form>
        </div>

        {
          ViewImageURL && (
            <ViewImage url={ViewImageURL} close={()=>setViewImageURL("")}/>
          )
        }

        {
          openAddField && (
            <AddFieldComponent 
              value={fieldName}
              onChange={(e)=>setFieldName(e.target.value)}
              submit={handleAddField}
              close={()=>setOpenAddField(false)} 
            />
          )
        }
    </div>
  )
}

export default UploadProduct
