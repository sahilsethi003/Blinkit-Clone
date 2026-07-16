import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight, FaAngleLeft, FaClock } from "react-icons/fa6";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'

const ProductDisplayPage = () => {
  const params = useParams()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const [data, setData] = useState({
    name: "",
    image: []
  })
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const imageContainer = useRef()

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId
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

  useEffect(() => {
    fetchProductDetails()
  }, [params])

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100
  }
  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100
  }

  return (
    <section className='bg-slate-50 min-h-[90vh] py-8'>
      <div className='container mx-auto p-4 max-w-6xl bg-white rounded-3xl shadow-sm border border-slate-100 grid lg:grid-cols-2 gap-8'>
        
        {/** Left Column: Image and Details **/}
        <div className='flex flex-col gap-6'>
          
          {/** Main Image Viewer **/}
          <div className='bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-6 h-[400px] lg:h-[480px] overflow-hidden relative group'>
            {
              data.image && data.image[image] ? (
                <img
                  src={data.image[image]}
                  alt={data.name}
                  className='max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300'
                />
              ) : (
                <div className='animate-pulse bg-slate-200 w-full h-full rounded-2xl'></div>
              )
            }
          </div>

          {/** Image Pagination Dots (hidden if 1 image) **/}
          {
            data.image && data.image.length > 1 && (
              <div className='flex items-center justify-center gap-1.5'>
                {
                  data.image.map((img, index) => (
                    <div 
                      key={img + index + "point"} 
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${index === image ? "bg-green-600 w-4" : "bg-slate-200"}`}
                    ></div>
                  ))
                }
              </div>
            )
          }

          {/** Image Selector Carousel **/}
          {
            data.image && data.image.length > 1 && (
              <div className='grid relative px-8'>
                <div ref={imageContainer} className='flex gap-3 z-10 relative w-full overflow-x-auto scrollbar-none py-1 scroll-smooth'>
                  {
                    data.image.map((img, index) => (
                      <div 
                        onClick={() => setImage(index)}
                        className={`w-16 h-16 min-h-[4rem] min-w-[4rem] p-1 bg-white rounded-xl border-2 cursor-pointer transition-all duration-250 flex items-center justify-center overflow-hidden
                          ${index === image ? "border-green-600 shadow-md" : "border-slate-100 hover:border-slate-300"}
                        `} 
                        key={img + index}
                      >
                        <img src={img} alt='thumbnail' className='max-h-full max-w-full object-contain' />
                      </div>
                    ))
                  }
                </div>
                <div className='w-full h-full flex justify-between absolute items-center left-0 top-0 px-1 pointer-events-none'>
                  <button onClick={handleScrollLeft} className='pointer-events-auto z-10 bg-white hover:bg-slate-50 text-slate-700 p-1.5 rounded-full shadow-md border border-slate-100'>
                    <FaAngleLeft className='text-sm' />
                  </button>
                  <button onClick={handleScrollRight} className='pointer-events-auto z-10 bg-white hover:bg-slate-50 text-slate-700 p-1.5 rounded-full shadow-md border border-slate-100'>
                    <FaAngleRight className='text-sm' />
                  </button>
                </div>
              </div>
            )
          }

          {/** Description and Details (Desktop) **/}
          <div className='hidden lg:flex flex-col gap-6 border-t border-slate-100 pt-6 mt-2'>
            {
              data.description && (
                <div>
                  <h4 className='font-bold text-slate-800 mb-1.5'>Product Description</h4>
                  <p className='text-slate-600 text-sm leading-relaxed'>{data.description}</p>
                </div>
              )
            }
            {
              data.unit && (
                <div>
                  <h4 className='font-bold text-slate-800 mb-1'>Pack Unit</h4>
                  <p className='text-slate-600 text-sm'>{data.unit}</p>
                </div>
              )
            }
            {
              data?.more_details && Object.keys(data?.more_details).map((key, index) => (
                <div key={key + index}>
                  <h4 className='font-bold text-slate-800 mb-1 capitalize'>{key}</h4>
                  <p className='text-slate-600 text-sm'>{data?.more_details[key]}</p>
                </div>
              ))
            }
          </div>
        </div>

        {/** Right Column: Product Purchasing **/}
        <div className='flex flex-col gap-6 lg:pl-4'>
          
          {/** Delivery Pill & Title **/}
          <div className='flex flex-col gap-2'>
            <span className='bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit'>
              <FaClock className='text-xs' /> 10 Min Delivery
            </span>
            <h2 className='text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight mt-1'>{data.name}</h2>  
            <p className='text-slate-500 font-medium text-sm mt-0.5'>{data.unit}</p> 
          </div>

          <Divider />

          {/** Pricing & Cart Actions **/}
          <div className='bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-4'>
            <div>
              <p className='text-xs text-slate-400 font-bold uppercase tracking-wider mb-1'>Selling Price</p> 
              <div className='flex items-baseline gap-3'>
                <p className='font-black text-2xl lg:text-3xl text-slate-800'>
                  {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
                </p>
                {
                  data.discount ? (
                    <>
                      <p className='line-through text-slate-400 text-sm'>
                        {DisplayPriceInRupees(data.price)}
                      </p>
                      <span className='bg-red-500 text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm'>
                        SAVE {data.discount}%
                      </span>
                    </>
                  ) : null
                }
              </div>
            </div>

            <div className='mt-2'>
              {
                data.stock === 0 ? (
                  <span className='inline-block px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold border border-red-100'>
                    Out of Stock
                  </span>
                ) : (
                  <div className='w-full max-w-[200px]'>
                    <AddToCartButton data={data} />
                  </div>
                )
              }
            </div>
          </div>

          {/** Why Shop Grid **/}
          <div className='flex flex-col gap-4 border-t border-slate-100 pt-6'>
            <h4 className='font-bold text-slate-800 text-sm tracking-wider uppercase'>Why shop from Binkeyit?</h4>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              <div className='flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100/50'>
                <img src={image1} alt='superfast delivery' className='w-14 h-14 object-contain mb-2' />
                <h5 className='font-bold text-slate-800 text-xs mb-1'>Superfast Delivery</h5>
                <p className='text-[10px] text-slate-400 leading-tight'>Get items delivered from dark stores near you in minutes.</p>
              </div>
              <div className='flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100/50'>
                <img src={image2} alt='best prices' className='w-14 h-14 object-contain mb-2' />
                <h5 className='font-bold text-slate-800 text-xs mb-1'>Best Prices</h5>
                <p className='text-[10px] text-slate-400 leading-tight'>Top deals directly from the manufacturers to your cart.</p>
              </div>
              <div className='flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100/50'>
                <img src={image3} alt='wide assortment' className='w-14 h-14 object-contain mb-2' />
                <h5 className='font-bold text-slate-800 text-xs mb-1'>Wide Assortment</h5>
                <p className='text-[10px] text-slate-400 leading-tight'>Choose from 5000+ products across many categories.</p>
              </div>
            </div>
          </div>

          {/** Description and Details (Mobile) **/}
          <div className='flex lg:hidden flex-col gap-6 border-t border-slate-100 pt-6 mt-2'>
            {
              data.description && (
                <div>
                  <h4 className='font-bold text-slate-800 mb-1.5'>Product Description</h4>
                  <p className='text-slate-600 text-sm leading-relaxed'>{data.description}</p>
                </div>
              )
            }
            {
              data.unit && (
                <div>
                  <h4 className='font-bold text-slate-800 mb-1'>Pack Unit</h4>
                  <p className='text-slate-600 text-sm'>{data.unit}</p>
                </div>
              )
            }
            {
              data?.more_details && Object.keys(data?.more_details).map((key, index) => (
                <div key={key + index}>
                  <h4 className='font-bold text-slate-800 mb-1 capitalize'>{key}</h4>
                  <p className='text-slate-600 text-sm'>{data?.more_details[key]}</p>
                </div>
              ))
            }
          </div>

        </div>
      </div>
    </section>
  )
}

export default ProductDisplayPage
