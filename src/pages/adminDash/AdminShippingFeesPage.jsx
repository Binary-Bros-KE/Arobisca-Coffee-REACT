"use client"

import { useEffect, useState } from "react"
import { FiEdit2, FiTrash2, FiPlus, FiMapPin, FiDollarSign } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import AdminSidebar from "./components/AdminSidebar"
import toast from "react-hot-toast"
import { Loader } from "lucide-react"

const API_URL = `${import.meta.env.VITE_SERVER_URL}/shipping-fees`

export default function AdminShippingFeesPage() {
    const [shippingFees, setShippingFees] = useState([])
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [editingFee, setEditingFee] = useState(null)

    // Fetch all fees
    const fetchFees = async () => {
        setLoading(true)
        try {
            const res = await fetch(API_URL)
            const data = await res.json()
            if (data.success) setShippingFees(data.data)
            else toast.error(data.message || "Failed to fetch shipping fees")
        } catch (err) {
            console.error(err)
            toast.error("Failed to load shipping fees")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFees()
    }, [])

    // Delete a fee
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this shipping fee?")) return
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" })
            const data = await res.json()
            if (res.ok) {
                toast.success("Deleted successfully")
                fetchFees()
            } else toast.error(data.message)
        } catch (err) {
            console.error(err)
            toast.error("Error deleting")
        }
    }

    // Toggle COD availability
    const toggleCodAvailable = async (fee) => {
        try {
            const res = await fetch(`${API_URL}/${fee._id}/toggle-cod`, {
                method: "PATCH"
            })
            const data = await res.json()
            if (data.success) {
                toast.success(data.message)
                fetchFees() // Refresh the list
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            console.error(err)
            toast.error("Failed to update COD status")
        }
    }

    // Open modal for add/edit
    const openModal = (fee = null) => {
        setEditingFee(fee)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingFee(null)
    }

    const handleSave = async (formData) => {
        const method = editingFee ? "PUT" : "POST"
        const url = editingFee ? `${API_URL}/${editingFee._id}` : API_URL
        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if (data.success) {
                toast.success(`Shipping fee ${editingFee ? "updated" : "added"} successfully`)
                closeModal()
                fetchFees()
            } else toast.error(data.message)
        } catch (err) {
            console.error(err)
            toast.error("Failed to save shipping fee")
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />
            <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <FiMapPin /> Shipping Fees Management
                    </h1>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-coffee text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition cursor-pointer"
                    >
                        <FiPlus size={20} /> Add Fee
                    </button>
                </div>

                {/* Fee Cards */}
                {loading ? (
                    <div className="text-center text-gray-500 py-10 bg-white">
                        <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                        Loading...
                    </div>
                ) : shippingFees.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">No shipping fees added yet.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shippingFees.map((fee) => (
                            <div
                                key={fee._id}
                                className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition"
                            >
                                <div className="flex flex-col justify-between items-start mb-3">
                                    <h3 className="text-xl font-semibold text-gray-800">{fee.destination}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${fee.codAvailable
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {fee.codAvailable ? 'COD Available' : 'COD Not Available'}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-600 mt-1">
                                    <span className="font-bold">Distributor Station: &nbsp;</span>
                                    {fee.pickupStation}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-bold">Distance: &nbsp;</span>
                                    {fee.distance} km
                                </p>
                                <p className="text-lg font-bold text-amber-600 mt-2">
                                    KES {fee.amount.toLocaleString()}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-bold">Delivery Time: &nbsp;</span>
                                    {fee.deliveryTime}
                                </p>

                                <div className="flex flex-col gap-3 mt-4">
                                    <button
                                        onClick={() => toggleCodAvailable(fee)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded transition cursor-pointer ${fee.codAvailable
                                            ? 'bg-orange-200 text-white hover:bg-orange-700'
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                            }`}
                                    >
                                        <FiDollarSign size={16} />
                                        {fee.codAvailable ? 'Disable COD' : 'Enable COD'}
                                    </button>
                                    <button
                                        onClick={() => openModal(fee)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer"
                                    >
                                        <FiEdit2 size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(fee._id)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition cursor-pointer"
                                    >
                                        <FiTrash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showModal && (
                    <ShippingFeeFormModal
                        fee={editingFee}
                        onClose={closeModal}
                        onSave={handleSave}
                    />
                )}
            </main>
        </div>
    )
}

/* --------------------- Modal Component --------------------- */
function ShippingFeeFormModal({ fee, onClose, onSave }) {
    const [form, setForm] = useState({
        destination: fee?.destination || "",
        pickupStation: fee?.pickupStation || "",
        distance: fee?.distance || "",
        amount: fee?.amount || "",
        deliveryTime: fee?.deliveryTime || "",
        codAvailable: fee?.codAvailable || false,
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setForm({ ...form, [e.target.name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(form)
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                <h2 className="text-2xl font-bold mb-4">
                    {fee ? "Edit Shipping Fee" : "Add Shipping Fee"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Destination Name
                        </label>
                        <input
                            type="text"
                            name="destination"
                            value={form.destination}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 placeholder:text-gray-300"
                            placeholder="Nairobi CBD"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Distributor Station
                        </label>
                        <input
                            type="text"
                            name="pickupStation"
                            value={form.pickupStation}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 placeholder:text-gray-300"
                            placeholder="Arobisca HQ"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Distance (km)
                            </label>
                            <input
                                type="number"
                                name="distance"
                                value={form.distance}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 placeholder:text-gray-300"
                                placeholder="10"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Amount (KES)
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 placeholder:text-gray-300"
                                placeholder="200"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Delivery Time
                        </label>
                        <input
                            type="text"
                            name="deliveryTime"
                            value={form.deliveryTime}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 3 hrs, Same Day Delivery, or 7 working days"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 placeholder:text-gray-300"
                        />
                    </div>

                    {/* COD Availability Toggle */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <input
                            type="checkbox"
                            id="codAvailable"
                            name="codAvailable"
                            checked={form.codAvailable}
                            onChange={handleChange}
                            className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                        />
                        <label htmlFor="codAvailable" className="text-sm font-medium text-gray-700">
                            Cash on Delivery Available
                        </label>
                        <span className="ml-auto text-xs text-gray-500 bg-white px-2 py-1 rounded">
                            {form.codAvailable ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition cursor-pointer"
                        >
                            {fee ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}