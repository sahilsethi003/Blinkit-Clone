import { useState } from 'react'
import Search from './Search'
import { Link, useLocation,useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp  } from "react-icons/go";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';
import LocationSelectModal from './LocationSelectModal';

import { IoLocationSharp } from 'react-icons/io5';

const Header = () => {
    const [ isMobile ] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const isAuthPage = ["/login", "/register", "/forgot-password", "/verification-otp", "/reset-password"].includes(location.pathname)
    const navigate = useNavigate()
    const user = useSelector((state)=> state?.user)
    const addressList = useSelector(state => state.addresses.addressList) || []
    const [selectedAddressId, setSelectedAddressId] = useState(localStorage.getItem("activeAddressId") || "")
    const activeAddress = addressList.find(addr => addr._id === selectedAddressId && addr.status) || addressList.find(addr => addr.status)
    const [openLocationModal, setOpenLocationModal] = useState(false)
    const [openUserMenu,setOpenUserMenu] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    // const [totalPrice,setTotalPrice] = useState(0)
    // const [totalQty,setTotalQty] = useState(0)
    const { totalPrice, totalQty} = useGlobalContext()
    const [openCartSection,setOpenCartSection] = useState(false)
 
    const redirectToLoginPage = ()=>{
        navigate("/login")
    }

    const handleCloseUserMenu = ()=>{
        setOpenUserMenu(false)
    }

    const handleMobileUser = ()=>{
        if(!user._id){
            navigate("/login")
            return
        }

        navigate("/user")
    }

    const handleLocationClick = ()=>{
        if(!user?._id){
            navigate("/login")
            return
        }
        setOpenLocationModal(true)
    }

    //total item and total price
    // useEffect(()=>{
    //     const qty = cartItem.reduce((preve,curr)=>{
    //         return preve + curr.quantity
    //     },0)
    //     setTotalQty(qty)
        
    //     const tPrice = cartItem.reduce((preve,curr)=>{
    //         return preve + (curr.productId.price * curr.quantity)
    //     },0)
    //     setTotalPrice(tPrice)

    // },[cartItem])

  return (
    <header className='h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white'>
        {
            !(isSearchPage && isMobile) && (
                <div className='container mx-auto flex items-center px-2 justify-between'>
                                {/**logo & location */}
                                <div className='h-full flex items-center gap-4'>
                                    <Link to={"/"} className='h-full flex items-center select-none'>
                                        <span className='font-black text-3xl lg:text-4xl tracking-tight text-secondary-200'>
                                            Groc<span className='text-primary-200'>ify</span>
                                        </span>
                                    </Link>

                                    {
                                        !isAuthPage && (
                                            <div 
                                                onClick={handleLocationClick} 
                                                className='hidden md:flex items-center gap-1.5 cursor-pointer hover:opacity-85 transition-opacity pl-4 border-l border-slate-200 max-w-[200px] lg:max-w-[260px]'
                                            >
                                                <div className='text-secondary-200'>
                                                    <IoLocationSharp size={22} />
                                                </div>
                                                <div className='flex flex-col text-left'>
                                                    <span className='font-extrabold text-[10px] text-slate-800 tracking-tight leading-tight uppercase'>
                                                        {activeAddress ? "Delivery in 10 min" : "Delivering To"}
                                                    </span>
                                                    <span className='text-xs text-gray-500 font-semibold truncate leading-tight flex items-center gap-0.5'>
                                                        {activeAddress 
                                                            ? `${activeAddress.address_line}, ${activeAddress.city}` 
                                                            : "Select Address"
                                                        }
                                                        <GoTriangleDown className='text-gray-400 mt-0.5' size={12} />
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>

                                {/**Search */}
                                <div className='hidden lg:block flex-1 max-w-lg xl:max-w-2xl mx-8'>
                                    {
                                        !isAuthPage && (
                                            <Search/>
                                        )
                                    }
                                </div>


                                {/**login and my cart */}
                                <div className=''>
                                    {/**user icons display in only mobile version**/}
                                    {
                                        !isAuthPage && (
                                            <button className='text-neutral-600 lg:hidden' onClick={handleMobileUser}>
                                                <FaRegCircleUser size={26}/>
                                            </button>
                                        )
                                    }

                                      {/**Desktop**/}
                                    <div className='hidden lg:flex items-center gap-4 xl:gap-6'>
                                        {
                                            user?._id ? (
                                                <>
                                                    {/** Account Dropdown */}
                                                    <div className='relative'>
                                                        <div 
                                                            onClick={() => setOpenUserMenu(preve => !preve)} 
                                                            className='flex select-none items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/80 transition-all cursor-pointer font-extrabold text-sm text-slate-800'
                                                        >
                                                            <FaRegCircleUser size={18} className='text-secondary-200' />
                                                            <span>Account</span>
                                                            {
                                                                openUserMenu ? (
                                                                    <GoTriangleUp size={16} className='text-slate-500' /> 
                                                                ) : (
                                                                    <GoTriangleDown size={16} className='text-slate-500' />
                                                                )
                                                            }
                                                        </div>
                                                        {
                                                            openUserMenu && (
                                                                <div className='absolute right-0 top-12 z-50'>
                                                                    <div className='bg-white rounded-2xl p-4 min-w-56 shadow-xl border border-slate-100'>
                                                                        <UserMenu close={handleCloseUserMenu}/>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </div>

                                                    {/** My Cart Button - Only displayed when logged in */}
                                                    <button 
                                                        onClick={() => setOpenCartSection(true)} 
                                                        className='flex items-center gap-3 bg-secondary-200 hover:bg-secondary-200/95 px-4 py-2.5 rounded-xl text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 group'
                                                    >
                                                        <div className='group-hover:animate-bounce transition-all'>
                                                            <BsCart4 size={22}/>
                                                        </div>
                                                        <div className='font-extrabold text-xs text-left tracking-wide'>
                                                            {
                                                                cartItem[0] ? (
                                                                    <div>
                                                                        <p>{totalQty} {totalQty === 1 ? 'Item' : 'Items'}</p>
                                                                        <p className='text-white/90 font-bold'>{DisplayPriceInRupees(totalPrice)}</p>
                                                                    </div>
                                                                ) : (
                                                                    <p className='text-sm py-0.5 font-extrabold'>My Cart</p>
                                                                )
                                                            }
                                                        </div>    
                                                    </button>
                                                </>
                                            ) : (
                                                !isAuthPage && (
                                                    <button 
                                                        onClick={redirectToLoginPage} 
                                                        className='flex items-center gap-2.5 px-5 py-2 rounded-full font-black text-sm text-slate-800 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-secondary-200 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 group cursor-pointer'
                                                    >
                                                        <FaRegCircleUser size={20} className='text-secondary-200 group-hover:scale-110 transition-transform' />
                                                        <span className='tracking-tight'>Login</span>
                                                    </button>
                                                )
                                            )
                                        }
                                    </div>
                                </div>
                </div>
            )
        }
        
        {
            !isAuthPage && (
                <div className='container mx-auto px-2 lg:hidden'>
                    <Search/>
                </div>
            )
        }

        {
            openCartSection && (
                <DisplayCartItem close={()=>setOpenCartSection(false)}/>
            )
        }
        {
            openLocationModal && (
                <LocationSelectModal 
                    close={() => setOpenLocationModal(false)}
                    currentActiveId={activeAddress?._id}
                    onSelectAddress={(addr) => setSelectedAddressId(addr._id)}
                />
            )
        }
    </header>
  )
}

export default Header
