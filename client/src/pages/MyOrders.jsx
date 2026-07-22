import React from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)

  console.log("order Items",orders)

  // Group items belonging to the same checkout transaction
  const groupedOrders = []
  
  if (orders && orders.length > 0) {
    orders.forEach(order => {
      const existingGroup = groupedOrders.find(group => {
        if (group.orderId === order.orderId) return true;
        if (order.paymentId && group.paymentId === order.paymentId) return true;
        
        const groupTime = new Date(group.createdAt).getTime();
        const orderTime = new Date(order.createdAt).getTime();
        if (Math.abs(groupTime - orderTime) < 5000) return true;
        
        return false;
      });
      
      if (existingGroup) {
        existingGroup.items.push(order);
      } else {
        groupedOrders.push({
          orderId: order.orderId,
          paymentId: order.paymentId,
          payment_status: order.payment_status,
          totalAmt: order.totalAmt,
          createdAt: order.createdAt,
          items: [order]
        });
      }
    });
  }

  return (
    <div className='bg-white'>
      <div className='bg-white px-4 py-4 flex items-center gap-2 border-b border-slate-100'>
        <span className="w-1.5 h-6 bg-secondary-200 rounded-full"></span>
        <h1 className='font-bold text-gray-800 text-lg'>Order History</h1>
      </div>
      <div className='p-4 bg-slate-50/50 min-h-[60vh] flex flex-col gap-4'>
        {
          (!orders || !orders[0]) && (
            <NoData/>
          )
        }
        {
          groupedOrders.map((orderGroup,index)=>{
            const orderDate = orderGroup.createdAt 
              ? new Date(orderGroup.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'N/A';
            return(
              <div key={orderGroup.orderId+index} className='border border-slate-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4'>
                {/* Header of the Order group */}
                <div className='flex items-center justify-between border-b border-slate-100/70 pb-3'>
                  <div>
                    <span className="inline-block font-extrabold text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase tracking-wider mb-1">
                      Order #{orderGroup.orderId?.slice(-8)}
                    </span>
                    <p className='text-xs text-gray-400 font-semibold'>{orderDate}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5'>Total Paid</p>
                    <p className='font-black text-sm lg:text-base text-secondary-200'>{DisplayPriceInRupees(orderGroup.totalAmt)}</p>
                  </div>
                </div>

                {/* List of items inside this single order transaction */}
                <div className='flex flex-col gap-3.5'>
                  {
                    orderGroup.items.map((item, itemIdx) => (
                      <div key={item._id + itemIdx} className='flex gap-4 items-center justify-between'>
                        <div className='flex gap-3 items-center'>
                          <div className='w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-1 overflow-hidden shadow-inner'>
                            <img
                              src={item.product_details.image[0]} 
                              className='max-h-full max-w-full object-contain'
                              alt={item.product_details.name}
                            />  
                          </div>
                          <p className='font-bold text-gray-800 text-sm leading-snug'>{item.product_details.name}</p>
                        </div>
                        {itemIdx === 0 && orderGroup.payment_status && (
                          <span className={`inline-block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs
                            ${orderGroup.payment_status === 'CASH ON DELIVERY' 
                              ? 'bg-amber-50 text-amber-600 border border-amber-200/50' 
                              : 'bg-emerald-50 text-secondary-200 border border-secondary-200/10'
                            }
                          `}>
                            {orderGroup.payment_status}
                          </span>
                        )}
                      </div>
                    ))
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default MyOrders
