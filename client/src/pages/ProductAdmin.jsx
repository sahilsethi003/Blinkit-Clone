import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import FullscreenLoader from '../components/FullscreenLoader'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { IoSearchOutline } from "react-icons/io5";
import EditProductAdmin from '../components/EditProductAdmin'

const ProductAdmin = () => {
  const [productData,setProductData] = useState([])
  const [page,setPage] = useState(1)
  const [loading,setLoading] = useState(false)
  const [totalPageCount,setTotalPageCount] = useState(1)
  const [search,setSearch] = useState("")
  
  const fetchProductData = async()=>{
    try {
        setLoading(true)
        const response = await Axios({
           ...SummaryApi.getProduct,
           data : {
              page : page,
              limit : 12,
              search : search 
           }
        })

        const { data : responseData } = response 

        if(responseData.success){
          setTotalPageCount(responseData.totalNoPage)
          setProductData(responseData.data)
        }

    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }
  
  useEffect(()=>{
    fetchProductData()
  },[page])

  const handleNext = ()=>{
    if(page !== totalPageCount){
      setPage(preve => preve + 1)
    }
  }
  const handlePrevious = ()=>{
    if(page > 1){
      setPage(preve => preve - 1)
    }
  }

  const handleOnChange = (e)=>{
    const { value } = e.target
    setSearch(value)
    setPage(1)
  }

  useEffect(()=>{
    let flag = true 

    const interval = setTimeout(() => {
      if(flag){
        fetchProductData()
        flag = false
      }
    }, 300);

    return ()=>{
      clearTimeout(interval)
    }
  },[search])
  
  return (
    <div className='bg-white'>
        <div className='bg-white px-6 py-4 flex items-center justify-between gap-4 border-b border-slate-100'>
                <div className='flex items-center gap-2'>
                    <span className="w-1.5 h-6 bg-secondary-200 rounded-full"></span>
                    <h2 className='font-bold text-gray-800 text-lg'>Products</h2>
                </div>
                <div className='h-full min-w-24 max-w-xs w-full ml-auto bg-slate-50 px-4 flex items-center gap-3 py-2 rounded-xl border border-slate-200 focus-within:border-secondary-200 transition-all shadow-xs'>
                  <IoSearchOutline size={20} className="text-gray-400" />
                  <input
                    type='text'
                    placeholder='Search product here ...' 
                    className='h-full w-full outline-none bg-transparent text-sm font-semibold text-gray-700 placeholder-gray-400'
                    value={search}
                    onChange={handleOnChange}
                  />
                </div>
        </div>
        {
          loading && (
            <FullscreenLoader message="Loading products..."/>
          )
        }


        <div className='p-6 bg-slate-50/50'>


            <div className='min-h-[55vh]'>
              <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                {
                  productData.map((p,index)=>{
                    return(
                      <ProductCardAdmin data={p} fetchProductData={fetchProductData}  key={p._id || index} />
                    )
                  })
                }
              </div>
            </div>
            
            <div className='flex justify-between items-center my-6 max-w-xs mx-auto gap-4'>
              <button disabled={page === 1} onClick={handlePrevious} className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-bold text-gray-700 shadow-xs active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
              <div className='text-xs font-bold text-gray-500 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-xs'>{page} of {totalPageCount}</div>
              <button disabled={page === totalPageCount} onClick={handleNext} className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-bold text-gray-700 shadow-xs active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
            </div>

        </div>
    </div>
  )
}

export default ProductAdmin
