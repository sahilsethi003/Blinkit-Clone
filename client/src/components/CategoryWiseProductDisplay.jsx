import React, { useEffect, useRef, useState } from 'react'
import { Link, } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const CategoryWiseProductDisplay = ({ id, name }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCardNumber = new Array(6).fill(null)
    const [showLeftChevron, setShowLeftChevron] = useState(false)
    const [showRightChevron, setShowRightChevron] = useState(false)

    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: {
                    id: id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                setData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    const updateChevronVisibility = () => {
        if (containerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
            setShowLeftChevron(scrollLeft > 5)
            setShowRightChevron(scrollLeft < scrollWidth - clientWidth - 5)
        }
    }

    useEffect(() => {
        fetchCategoryWiseProduct()
    }, [])

    useEffect(() => {
        const container = containerRef.current
        if (container) {
            container.addEventListener('scroll', updateChevronVisibility)
            // Run initial check once data loaded
            updateChevronVisibility()
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', updateChevronVisibility)
            }
        }
    }, [data])

    const handleScrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += 200
        }
    }

    const handleScrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft -= 200
        }
    }

  const handleRedirectProductListpage = ()=>{
      const subcategory = subCategoryData.find(sub =>{
        const filterData = sub.category.some(c => {
          return c._id == id
        })

        return filterData ? true : null
      })
      const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`

      return url
  }

  const redirectURL =  handleRedirectProductListpage()
    return (
        <div>
            <div className='container mx-auto p-4 flex items-center justify-between gap-4'>
                <h3 className='font-bold text-gray-800 text-lg md:text-xl'>{name}</h3>
                <Link  to={redirectURL} className='text-secondary-200 hover:text-secondary-200/80 font-bold text-sm transition-colors duration-200'>See All</Link>
            </div>
            <div className='relative flex items-center'>
                <div 
                    className='flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth' 
                    ref={containerRef}
                >
                    {loading &&
                        loadingCardNumber.map((_, index) => {
                            return (
                                <CardLoading key={"CategorywiseProductDisplay123" + index} />
                            )
                        })
                    }


                    {
                        data.map((p, index) => {
                            return (
                                <CardProduct
                                    data={p}
                                    key={p._id + "CategorywiseProductDisplay" + index}
                                />
                            )
                        })
                    }

                </div>
                <div className='w-full left-0 right-0 container mx-auto px-2 absolute hidden lg:flex justify-between pointer-events-none'>
                    {showLeftChevron ? (
                        <button 
                            onClick={handleScrollLeft} 
                            className='pointer-events-auto z-10 relative bg-white hover:bg-gray-100 shadow-lg text-lg p-2 rounded-full transition-all duration-200 active:scale-95'
                        >
                            <FaAngleLeft />
                        </button>
                    ) : (
                        <div className="w-9 h-9"></div>
                    )}
                    {showRightChevron ? (
                        <button 
                            onClick={handleScrollRight} 
                            className='pointer-events-auto z-10 relative bg-white hover:bg-gray-100 shadow-lg p-2 text-lg rounded-full transition-all duration-200 active:scale-95'
                        >
                            <FaAngleRight />
                        </button>
                    ) : (
                        <div className="w-9 h-9"></div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CategoryWiseProductDisplay
