import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import Loading from '../components/Loading'
import { FaTicketSimple, FaPlus, FaTrash, FaCheck, FaXmark, FaCopy, FaToggleOn, FaToggleOff } from 'react-icons/fa6'

const PromoCodeAdmin = () => {
    const [promoCodes, setPromoCodes] = useState([])
    const [loading, setLoading] = useState(false)
    const [openAddModal, setOpenAddModal] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        code: '',
        type: 'percentage',
        value: '',
        minOrder: 0,
        maxDiscount: 0,
        description: ''
    })

    // Fetch all promo codes (admin view)
    const fetchAdminPromoCodes = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getAdminPromoCodes
            })
            if (response.data.success) {
                setPromoCodes(response.data.data || [])
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAdminPromoCodes()
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'code' ? value.toUpperCase() : value
        }))
    }

    const handleCreatePromoCode = async (e) => {
        e.preventDefault()
        if (!formData.code || !formData.value || !formData.description) {
            toast.error("Please fill in code, value, and description")
            return
        }

        try {
            setSubmitting(true)
            const response = await Axios({
                ...SummaryApi.createPromoCode,
                data: {
                    code: formData.code.trim(),
                    type: formData.type,
                    value: Number(formData.value),
                    minOrder: Number(formData.minOrder) || 0,
                    maxDiscount: Number(formData.maxDiscount) || 0,
                    description: formData.description.trim()
                }
            })

            if (response.data.success) {
                toast.success(response.data.message || "Promo code created successfully!")
                setOpenAddModal(false)
                setFormData({
                    code: '',
                    type: 'percentage',
                    value: '',
                    minOrder: 0,
                    maxDiscount: 0,
                    description: ''
                })
                fetchAdminPromoCodes()
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const response = await Axios({
                ...SummaryApi.updatePromoCode,
                data: {
                    _id: id,
                    status: !currentStatus
                }
            })
            if (response.data.success) {
                toast.success(`Promo code ${!currentStatus ? "activated" : "deactivated"}`)
                fetchAdminPromoCodes()
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleDeletePromoCode = async (id, codeName) => {
        if (!window.confirm(`Are you sure you want to delete promo code "${codeName}"?`)) {
            return
        }
        try {
            const response = await Axios({
                ...SummaryApi.deletePromoCode,
                data: { _id: id }
            })
            if (response.data.success) {
                toast.success(`Promo code "${codeName}" deleted`)
                fetchAdminPromoCodes()
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code)
        toast.success(`Copied "${code}" to clipboard!`)
    }

    return (
        <div className='p-5 bg-white min-h-[75vh] flex flex-col gap-5'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4'>
                <div>
                    <h1 className='text-xl font-black text-gray-800 flex items-center gap-2.5'>
                        <span className="w-2 h-6 bg-secondary-200 rounded-full"></span>
                        Promo Code Manager 🎟️
                    </h1>
                    <p className='text-xs text-gray-500 mt-1 font-semibold'>
                        Create, manage, and toggle discount coupons for customer checkouts.
                    </p>
                </div>
                <button
                    onClick={() => setOpenAddModal(true)}
                    className='py-2.5 px-4 bg-secondary-200 hover:bg-secondary-200/95 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95 self-start sm:self-auto'
                >
                    <FaPlus size={12} /> Create New Promo Code
                </button>
            </div>

            {/* List of Promo Codes */}
            {loading ? (
                <div className='py-20 flex justify-center items-center'>
                    <Loading />
                </div>
            ) : promoCodes.length === 0 ? (
                <div className='border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center gap-3 bg-slate-50/50'>
                    <div className='w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl shadow-inner'>
                        <FaTicketSimple />
                    </div>
                    <h3 className='font-bold text-gray-800 text-base'>No Promo Codes Created Yet</h3>
                    <p className='text-xs text-gray-500 max-w-sm'>
                        Click the button above to add your first discount coupon for your customers!
                    </p>
                    <button
                        onClick={() => setOpenAddModal(true)}
                        className='mt-2 py-2 px-4 bg-secondary-200 text-white font-bold text-xs rounded-xl hover:bg-secondary-200/90 transition-all cursor-pointer'
                    >
                        + Add Promo Code
                    </button>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {promoCodes.map((promo) => (
                        <div
                            key={promo._id}
                            className={`border rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-200 shadow-sm hover:shadow-md relative overflow-hidden ${
                                promo.status
                                    ? "bg-white border-slate-200"
                                    : "bg-slate-50/70 border-slate-200 opacity-70"
                            }`}
                        >
                            {/* Decorative Accent Ribbon */}
                            <div className={`absolute top-0 right-0 left-0 h-1.5 ${promo.status ? "bg-secondary-200" : "bg-slate-300"}`}></div>

                            {/* Top Info */}
                            <div className='flex items-start justify-between gap-3 pt-1'>
                                <div className='flex items-center gap-2.5'>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                                        promo.status ? "bg-emerald-50 text-secondary-200 border border-emerald-100" : "bg-slate-200 text-slate-500"
                                    }`}>
                                        <FaTicketSimple />
                                    </div>
                                    <div>
                                        <div className='flex items-center gap-2'>
                                            <span className='font-black text-base text-gray-800 tracking-wide uppercase'>{promo.code}</span>
                                            <button
                                                onClick={() => copyToClipboard(promo.code)}
                                                className='text-slate-400 hover:text-secondary-200 p-1 rounded transition-colors'
                                                title="Copy Code"
                                            >
                                                <FaCopy size={12} />
                                            </button>
                                        </div>
                                        <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider mt-0.5 ${
                                            promo.status
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-slate-200 text-slate-600"
                                        }`}>
                                            {promo.status ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleToggleStatus(promo._id, promo.status)}
                                    className={`text-2xl transition-all cursor-pointer ${promo.status ? "text-secondary-200" : "text-slate-300"}`}
                                    title={promo.status ? "Click to Deactivate" : "Click to Activate"}
                                >
                                    {promo.status ? <FaToggleOn /> : <FaToggleOff />}
                                </button>
                            </div>

                            {/* Details */}
                            <div className='bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-xs flex flex-col gap-1.5'>
                                <p className='text-gray-700 font-semibold line-clamp-2'>{promo.description}</p>
                                <div className='flex flex-wrap items-center justify-between pt-2 border-t border-slate-200/50 text-[11px] font-bold text-gray-600'>
                                    <span>
                                        Discount: <strong className='text-secondary-200'>{promo.type === 'percentage' ? `${promo.value}% OFF` : `₹${promo.value} OFF`}</strong>
                                    </span>
                                    <span>Min Order: <strong className='text-gray-800'>₹{promo.minOrder}</strong></span>
                                </div>
                                {promo.type === 'percentage' && Boolean(promo.maxDiscount) && (
                                    <p className='text-[10px] text-gray-400 font-semibold'>Max Discount Cap: ₹{promo.maxDiscount}</p>
                                )}
                            </div>

                            {/* Footer / Actions */}
                            <div className='flex items-center justify-between border-t border-slate-100 pt-3 text-xs'>
                                <span className='text-[10px] font-bold text-slate-400'>
                                    Created: {new Date(promo.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </span>
                                <button
                                    onClick={() => handleDeletePromoCode(promo._id, promo.code)}
                                    className='text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-all cursor-pointer flex items-center gap-1 font-bold text-[11px]'
                                    title="Delete Promo Code"
                                >
                                    <FaTrash size={12} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Dialog for Adding Promo Code */}
            {openAddModal && (
                <div className='fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn'>
                    <div className='bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col gap-5 relative'>
                        {/* Header */}
                        <div className='flex items-center justify-between border-b border-slate-100 pb-3'>
                            <h2 className='text-lg font-bold text-gray-800 flex items-center gap-2'>
                                <span className="w-1.5 h-5 bg-secondary-200 rounded-full"></span>
                                Create Promo Code 🎟️
                            </h2>
                            <button
                                onClick={() => setOpenAddModal(false)}
                                className='w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-gray-500 flex items-center justify-center transition-all'
                            >
                                <FaXmark size={14} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleCreatePromoCode} className='grid gap-4 text-xs font-semibold text-gray-700'>
                            <div>
                                <label className='block mb-1 font-bold text-gray-800'>Promo Code Name *</label>
                                <input
                                    type='text'
                                    name='code'
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    placeholder='e.g. SUPER50 or SAVE20'
                                    required
                                    className='w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none uppercase font-extrabold tracking-wider text-slate-800 focus:border-secondary-200 focus:bg-white transition-all'
                                />
                            </div>

                            <div className='grid grid-cols-2 gap-3'>
                                <div>
                                    <label className='block mb-1 font-bold text-gray-800'>Discount Type *</label>
                                    <select
                                        name='type'
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className='w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:border-secondary-200 focus:bg-white transition-all'
                                    >
                                        <option value='percentage'>Percentage (% OFF)</option>
                                        <option value='flat'>Flat Amount (₹ OFF)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='block mb-1 font-bold text-gray-800'>Discount Value *</label>
                                    <input
                                        type='number'
                                        name='value'
                                        value={formData.value}
                                        onChange={handleInputChange}
                                        placeholder={formData.type === 'percentage' ? 'e.g. 20 (for 20%)' : 'e.g. 50 (for ₹50)'}
                                        required
                                        min='1'
                                        className='w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:border-secondary-200 focus:bg-white transition-all'
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-3'>
                                <div>
                                    <label className='block mb-1 font-bold text-gray-800'>Min Order Amount (₹)</label>
                                    <input
                                        type='number'
                                        name='minOrder'
                                        value={formData.minOrder}
                                        onChange={handleInputChange}
                                        placeholder='e.g. 199 (0 for no min)'
                                        min='0'
                                        className='w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:border-secondary-200 focus:bg-white transition-all'
                                    />
                                </div>
                                <div>
                                    <label className='block mb-1 font-bold text-gray-800'>Max Discount Cap (₹)</label>
                                    <input
                                        type='number'
                                        name='maxDiscount'
                                        value={formData.maxDiscount}
                                        onChange={handleInputChange}
                                        placeholder='e.g. 150 (0 for no cap)'
                                        min='0'
                                        className='w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:border-secondary-200 focus:bg-white transition-all'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block mb-1 font-bold text-gray-800'>Offer Description *</label>
                                <textarea
                                    name='description'
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder='e.g. Flat ₹50 OFF on all orders above ₹199'
                                    rows='2'
                                    required
                                    className='w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 focus:border-secondary-200 focus:bg-white transition-all'
                                ></textarea>
                            </div>

                            {/* Buttons */}
                            <div className='flex items-center justify-end gap-3 pt-2 border-t border-slate-100'>
                                <button
                                    type='button'
                                    onClick={() => setOpenAddModal(false)}
                                    className='py-2.5 px-4 rounded-xl border border-slate-200 text-gray-600 font-bold hover:bg-slate-50 transition-all cursor-pointer'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    disabled={submitting}
                                    className='py-2.5 px-5 rounded-xl bg-secondary-200 hover:bg-secondary-200/95 text-white font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95'
                                >
                                    {submitting ? "Creating..." : "Save Promo Code"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PromoCodeAdmin
