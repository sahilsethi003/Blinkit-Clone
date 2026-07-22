import React from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import AddToCartButton from './AddToCartButton'

const CardProduct = ({data}) => {
    const url = `/product/${valideURLConvert(data.name)}-${data._id}`
    const [loading,setLoading] = useState(false)
  
  return (
    <Link to={url} className='border border-slate-100 p-3.5 grid gap-2 min-w-36 lg:min-w-52 rounded-2xl cursor-pointer bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative group' >
      <div className='min-h-20 w-full max-h-24 lg:max-h-32 rounded-xl overflow-hidden bg-slate-50/50 flex items-center justify-center p-2'>
            <img 
                src={data.image[0]}
                className='max-h-20 lg:max-h-28 object-scale-down group-hover:scale-105 transition-transform duration-300'
            />
      </div>
      <div className='flex items-center gap-1.5 mt-1'>
        <div className='rounded-md text-[10px] font-extrabold px-2 py-0.5 text-secondary-200 bg-secondary-200/10 tracking-wide uppercase'>
              10 min 
        </div>
        <div>
            {
              Boolean(data.discount) && (
                <p className='text-white bg-secondary-200 font-extrabold px-1.5 py-0.5 text-[9px] rounded shadow-sm uppercase tracking-wider'>{data.discount}% OFF</p>
              )
            }
        </div>
      </div>
      <div className='px-1 lg:px-0 font-bold text-gray-800 text-xs lg:text-sm line-clamp-2 leading-tight h-10 group-hover:text-secondary-200 transition-colors duration-200'>
        {data.name}
      </div>
      <div className='px-1 lg:px-0 text-[11px] font-semibold text-gray-400'>
        {data.unit} 
      </div>

      <div className='px-1 lg:px-0 flex items-center justify-between gap-1 mt-auto'>
        <div className='flex items-center gap-1'>
          <div className='font-extrabold text-sm lg:text-base text-gray-900'>
              {DisplayPriceInRupees(pricewithDiscount(data.price,data.discount))} 
          </div>
        </div>
        <div className=''>
          {
            data.stock == 0 ? (
              <p className='text-red-500 text-xs font-bold text-center uppercase tracking-wider'>Out of stock</p>
            ) : (
              <AddToCartButton data={data} />
            )
          }
        </div>
      </div>

    </Link>
  )
}

export default CardProduct
