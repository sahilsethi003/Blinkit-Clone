import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const user = useSelector(state => state.user)

  console.log("user dashboard",user)
  return (
    <section className='bg-transparent py-4 lg:py-6'>
        <div className='container mx-auto px-4 grid lg:grid-cols-[250px,1fr] gap-6'>
                {/**left for menu */}
                <div className='py-6 px-4 sticky top-28 max-h-[calc(100vh-140px)] overflow-y-auto hidden lg:block bg-white rounded-2xl border border-slate-100 shadow-sm'>
                    <UserMenu/>
                </div>


                {/**right for content */}
                <div className='bg-white min-h-[75vh] rounded-2xl shadow-sm border border-slate-100 overflow-hidden'>
                    <Outlet/>
                </div>
        </div>
    </section>
  )
}

export default Dashboard
