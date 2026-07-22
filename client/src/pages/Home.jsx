import React from 'react'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import {Link, useNavigate} from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import FullscreenLoader from '../components/FullscreenLoader'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListpage = (id,cat)=>{
      console.log(id,cat)
      const subcategory = subCategoryData.find(sub =>{
        const filterData = sub.category.some(c => {
          return c._id == id
        })

        return filterData ? true : null
      })
      const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`

      navigate(url)
      console.log(url)
  }


  return (
   <section className='bg-transparent py-4 lg:py-6'>
      {
        loadingCategory && (
          <FullscreenLoader />
        )
      }
      <div className='container mx-auto px-4'>
          <div className='relative w-full h-48 lg:h-64 rounded-3xl overflow-hidden shadow-sm border border-slate-100/50 bg-gradient-to-r from-secondary-200 to-emerald-800 text-white flex items-center p-6 lg:p-12 mb-6'>
              {/* Decorative background image with opacity overlay */}
              <div className="absolute inset-0 z-0 opacity-20">
                  <img 
                      src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80" 
                      className="w-full h-full object-cover"
                      alt="groceries background"
                  />
              </div>
              
              <div className='relative z-10 max-w-lg flex flex-col gap-2'>
                  <span className='bg-primary-200 text-secondary-100 font-extrabold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider w-fit'>
                      ⚡ Superfast Delivery
                  </span>
                  <h1 className='text-2xl lg:text-4xl font-black tracking-tight leading-none'>
                      Fresh Groceries <br className="hidden sm:inline"/>Delivered in Minutes
                  </h1>
                  <p className='text-xs lg:text-sm text-emerald-100 font-medium max-w-sm'>
                      Get the best deals on daily essentials, fruits, vegetables, and pantry items directly at your doorstep.
                  </p>
              </div>
          </div>
      </div>
      
      {/* <div className='container mx-auto px-4 my-2 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10  gap-2'>
          {
            loadingCategory ? (
              new Array(12).fill(null).map((c,index)=>{
                return(
                  <div key={index+"loadingcategory"} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                    <div className='bg-blue-100 min-h-24 rounded'></div>
                    <div className='bg-blue-100 h-8 rounded'></div>
                  </div>
                )
              })
            ) : (
              categoryData.map((cat,index)=>{
                return(
                  <div key={cat._id+"displayCategory"} className='w-full h-full' onClick={()=>handleRedirectProductListpage(cat._id,cat.name)}>
                    <div>
                        <img 
                          src={cat.image}
                          className='w-full h-full object-scale-down'
                        />
                    </div>
                  </div>
                )
              })
              
            )
          }
      </div> */}

      {/***display category product */}
      {
        categoryData?.map((c,index)=>{
          return(
            <CategoryWiseProductDisplay 
              key={c?._id+"CategorywiseProduct"} 
              id={c?._id} 
              name={c?.name}
            />
          )
        })
      }



   </section>
  )
}

export default Home
