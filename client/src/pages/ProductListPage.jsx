import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { Link, useParams } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import FullscreenLoader from '../components/FullscreenLoader'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const ProductListPage = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const params = useParams()
  const AllSubCategory = useSelector(state => state.product.allSubCategory)
  const [DisplaySubCatory, setDisplaySubCategory] = useState([])

  const subCategory = params?.subCategory?.split("-")
  const subCategoryName = subCategory?.slice(0, subCategory?.length - 1)?.join(" ")

  const categoryId = params.category.split("-").slice(-1)[0]
  const subCategoryId = params.subCategory.split("-").slice(-1)[0]

  const fetchProductdata = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 50, // Increased limit to load all products without pagination blocks
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData([...data, ...responseData.data])
        }
        setTotalPage(responseData.totalCount)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductdata()
  }, [params])

  useEffect(() => {
    const sub = AllSubCategory.filter(s => {
      const filterData = s.category.some(el => {
        return el._id == categoryId
      })
      return filterData ? filterData : null
    })
    setDisplaySubCategory(sub)
  }, [params, AllSubCategory])

  return (
    <section className='sticky top-24 lg:top-20 bg-transparent min-h-[90vh]'>
      <div className='container mx-auto grid grid-cols-[100px,1fr] md:grid-cols-[220px,1fr] lg:grid-cols-[300px,1fr]'>
        
        {/** sub category sidebar **/}
        <div className='min-h-[88vh] max-h-[88vh] overflow-y-auto border-r border-slate-200 bg-white py-3 flex flex-col gap-1 shadow-sm scrollbarCustom'>
          <div className='px-4 py-2 hidden md:block'>
            <h4 className='text-xs font-bold text-slate-400 uppercase tracking-wider'>Sub Categories</h4>
          </div>
          {
            DisplaySubCatory.map((s, index) => {
              const link = `/${valideURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${valideURLConvert(s.name)}-${s._id}`
              const isActive = subCategoryId === s._id
              return (
                <Link 
                  to={link} 
                  key={s._id}
                  className={`w-full px-3 py-3 md:py-4 flex flex-col md:flex-row items-center gap-3 border-l-4 transition-all duration-250 cursor-pointer border-b border-slate-100/50
                    ${isActive 
                      ? "border-secondary-200 bg-secondary-200/5 text-secondary-200 font-bold" 
                      : "border-transparent hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                    }
                  `}
                >
                  <div className='w-12 h-12 min-w-[3rem] min-h-[3rem] bg-slate-100 rounded-lg p-1 flex items-center justify-center overflow-hidden shadow-inner' >
                    <img
                      src={s.image}
                      alt={s.name}
                      className='w-full h-full object-contain hover:scale-110 transition-transform duration-200'
                    />
                  </div>
                  <p className='text-[10px] md:text-sm text-center md:text-left leading-tight line-clamp-2'>{s.name}</p>
                </Link>
              )
            })
          }
        </div>

        {/** Product List **/}
        <div className='flex flex-col min-h-[88vh] max-h-[88vh] overflow-y-auto bg-transparent'>
          
          {/** Header with Breadcrumb/Title **/}
          <div className='bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-20 border-b border-slate-200'>
            <div>
              <h3 className='font-bold text-lg md:text-xl text-slate-800 capitalize'>{subCategoryName}</h3>
              <p className='text-xs text-slate-400 mt-0.5'>{data.length} products available</p>
            </div>
          </div>
          
          {/** Product Grid **/}
          <div className='p-6 flex-1'>
            {
              loading && data.length === 0 && (
                <FullscreenLoader message="Loading products..." />
              )
            }
            {
              data.length === 0 && !loading ? (
                <div className='flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center'>
                  <div className='text-slate-300 text-6xl mb-4'>🛒</div>
                  <h4 className='text-lg font-semibold text-slate-700'>No Products Found</h4>
                  <p className='text-slate-400 text-sm mt-1 max-w-sm'>We couldn't find any products in this subcategory. Try checking other sections or add new products via the Admin dashboard.</p>
                </div>
              ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                  {
                    data.map((p, index) => {
                      return (
                        <CardProduct
                          data={p}
                          key={p._id + "productSubCategory" + index}
                        />
                      )
                    })
                  }
                </div>
              )
            }
          </div>
        </div>

      </div>
    </section>
  )
}

export default ProductListPage
