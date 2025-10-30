"use client"

import { useState, useEffect, useRef } from "react"
import { X, Loader, CheckCircle } from "lucide-react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"

const API_URL = import.meta.env.VITE_SERVER_URL
const VITE_SOCKET_URL = import.meta.env.VITE_SOCKET_URL

export default function MpesaPayment({ onClose, total, setTransactionData, setPaymentStatus, handleOrderSubmit }) {
  const [phone, setPhone] = useState("")
  const [checkoutRequestId, setCheckoutRequestId] = useState("")
  const [stkLoading, setStkLoading] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [status, setStatus] = useState(false)
  const [error, setError] = useState("")
  const [showStkSuccess, setShowStkSuccess] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const wsRef = useRef(null)
  const resendTimerRef = useRef(null)

  const serverURL = `${API_URL}`
  const socketURL = `${VITE_SOCKET_URL}`

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      resendTimerRef.current = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
    }
    return () => {
      if (resendTimerRef.current) {
        clearTimeout(resendTimerRef.current)
      }
    }
  }, [resendCooldown])

  // Start cooldown when STK is sent
  useEffect(() => {
    if (showStkSuccess) {
      setResendCooldown(30) // 30 seconds cooldown
    }
  }, [showStkSuccess])

  // Clean up WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        console.log("Cleaning up WebSocket connection")
        wsRef.current.close()
      }
      if (resendTimerRef.current) {
        clearTimeout(resendTimerRef.current)
      }
    }
  }, [])

  const setupWebSocket = (checkoutId) => {
    try {
      console.log("Setting up WebSocket connection to:", socketURL)
      const websocket = new WebSocket(socketURL)
      wsRef.current = websocket

      websocket.onopen = () => {
        console.log("✅ WebSocket connected successfully")
        const registerMessage = JSON.stringify({
          action: "register",
          checkoutRequestId: checkoutId
        })
        console.log("Sending registration message:", registerMessage)
        websocket.send(registerMessage)
      }

      websocket.onmessage = (event) => {
        console.log("📨 WebSocket message received:", event.data)
        try {
          const result = JSON.parse(event.data)
          handleWebSocketResponse(result)
        } catch (parseError) {
          console.error("❌ Failed to parse WebSocket message:", parseError)
          setError("Invalid response from server")
        }
      }

      websocket.onerror = (error) => {
        console.error("❌ WebSocket error:", error)
        setError("Connection error. Please check payment status manually.")
      }

      websocket.onclose = (event) => {
        console.log("🔌 WebSocket connection closed:", event.code, event.reason)
      }

    } catch (wsError) {
      console.error("❌ WebSocket setup failed:", wsError)
      setError("Failed to establish connection")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStkLoading(true)
    setError("")

    try {
      console.log("📤 Sending STK request for phone:", phone, "amount:", total)
      const response = await fetch(`${serverURL}/mpesa/stk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount: total }),
      })

      const data = await response.json()
      console.log("📥 STK Response:", data)

      if (response.ok && data.CheckoutRequestID) {
        setShowStkSuccess(true)
        setCheckoutRequestId(data.CheckoutRequestID)
        console.log("✅ STK sent successfully, CheckoutRequestID:", data.CheckoutRequestID)

        // Setup WebSocket connection
        setupWebSocket(data.CheckoutRequestID)
        toast.success("STK sent to your phone. Enter your PIN to complete payment.")
      } else {
        throw new Error(data.error || data.message || "Failed to initiate payment")
      }
    } catch (err) {
      console.error("❌ STK Error:", err)
      setError(err.message)
      toast.error(err.message || "Payment initiation failed")
    } finally {
      setStkLoading(false)
    }
  }

  const handleWebSocketResponse = (result) => {
    console.log("🔄 Processing WebSocket response:", result)
    console.log("🔄 Result.data in M-pesa:", result.data) // Use console.log, not string interpolation
    console.log("🔄 Result.data type:", typeof result.data)
    console.log("🔄 Result.data keys:", result.data ? Object.keys(result.data) : 'null')

    if (result.status === "success") {
      console.log("✅ Payment successful via WebSocket")

      // Debug the transaction data structure
      const transactionData = result.data
      console.log("🔄 Transaction data to set:", transactionData)

      setStatus(true)
      setTransactionData(transactionData)

      // Verify the data was set correctly
      setTimeout(() => {
        console.log("🔄 Transaction data after setting state:", transactionData)
      }, 100)

      setPaymentStatus(true)

      toast.success("Payment successful! Placing your order...")

      // Close WebSocket
      if (wsRef.current) {
        wsRef.current.close()
      }

      // ✅ FIX: Pass transaction data directly to handleOrderSubmit
      console.log("🔄 Calling handleOrderSubmit with transactionData:", transactionData)
      handleOrderSubmit(transactionData) // Pass the data directly!
      onClose()
    } else if (result.status === "cancelled") {
      console.log("❌ Payment cancelled by user")
      setError(result.message || "Payment cancelled by user")
      toast.error("Payment cancelled")
    } else if (result.status === "insufficient") {
      console.log("❌ Insufficient funds")
      setError(result.message || "Insufficient funds")
      toast.error("Insufficient funds")
    } else if (result.status === "failed" || result.status === "timedout") {
      console.log("❌ Payment failed:", result.message)
      setError(result.message || "Payment failed")
      toast.error(result.message || "Payment failed")
    } else {
      console.log("❓ Unknown payment status:", result.status)
      setError(result.message || "Unknown payment status")
    }
  }

  const handleResendSTK = async () => {
    if (!phone || resendCooldown > 0) return

    setResendLoading(true)
    setError("")

    try {
      console.log("🔄 Resending STK for phone:", phone)
      const response = await fetch(`${serverURL}/mpesa/stk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount: total }),
      })

      const data = await response.json()
      console.log("📥 Resend STK Response:", data)

      if (response.ok && data.CheckoutRequestID) {
        setCheckoutRequestId(data.CheckoutRequestID)
        setResendCooldown(30) // Reset cooldown
        console.log("✅ STK resent successfully")

        // Re-setup WebSocket connection
        setupWebSocket(data.CheckoutRequestID)
        toast.success("STK resent to your phone")
      } else {
        throw new Error(data.error || data.message || "Failed to resend STK")
      }
    } catch (err) {
      console.error("❌ Resend STK Error:", err)
      setError(err.message)
      toast.error(err.message || "Failed to resend STK")
    } finally {
      setResendLoading(false)
    }
  }

  const handleCheckPaymentStatus = async () => {
    if (!checkoutRequestId) {
      setError("Missing CheckoutRequestID. Please initiate STK again.")
      return
    }
    setStatusLoading(true)

    try {
      console.log("🔍 Checking payment status for:", checkoutRequestId)
      const response = await fetch(`${serverURL}/mpesa/paymentStatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ CheckoutRequestId: checkoutRequestId }),
      })

      const data = await response.json()
      console.log("📥 Payment status response:", data)

      if (response.ok) {
        if (data.ResultCode === "0") {
          // Payment successful
          const transactionData = {
            phone: phone,
            amount: total,
            transactionId: data.MpesaReceiptNumber,
            CheckoutRequestID: checkoutRequestId,
            mpesaReceiptNumber: data.MpesaReceiptNumber,
            transactionDate: data.TransactionDate
          }
          setTransactionData(transactionData)
          setPaymentStatus(true)
          setStatus(true)

          console.log("✅ Payment verified via status check")
          toast.success("Payment verified successfully!")

          handleOrderSubmit(transactionData) // Pass the data directly!
          onClose()
        } else if (data.ResultCode === "2001") {
          setError("The initiator information was invalid. Please check your PIN and try again.")
          toast.error("Invalid PIN. Please try again.")
        } else if (data.ResultCode === "1037") {
          setError("DS Timeout. Please initiate again and respond quicker.")
          toast.error("Payment timeout. Please try again.")
        } else if (data.ResultCode === "1032") {
          setError("Payment cancelled by user.")
          toast.error("Payment cancelled.")
        } else if (data.ResultCode === "1") {
          setError("Insufficient funds. Please check your M-Pesa balance.")
          toast.error("Insufficient funds.")
        } else {
          setError(data.ResultDesc || "Failed to check payment status")
          toast.error(data.ResultDesc || "Payment check failed")
        }
      } else {
        throw new Error(data.error || "Failed to check payment status")
      }
    } catch (err) {
      console.error("❌ Payment status error:", err)
      setError(err.message)
      toast.error(err.message || "Failed to check payment status")
    } finally {
      setStatusLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          M-Pesa Payment
        </h2>

        {!status ? (
          <>
            {!showStkSuccess ? (
              // Initial payment form
              <div className="space-y-6">
                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      M
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
                  </div>
                  <p className="text-3xl font-bold text-amber-600">
                    KES {total.toLocaleString()}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      M-Pesa Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07XX XXX XXX"
                      pattern="^0[17][0-9]{8}$"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Enter your Safaricom M-Pesa number starting with 07 or 01
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={stkLoading}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {stkLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Pay with M-Pesa"
                    )}
                  </button>
                </form>
              </div>
            ) : (
              // STK Sent - Waiting for payment
              <div className="space-y-6 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                  <Loader className="w-10 h-10 text-green-600 animate-spin" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-800">
                    STK Sent Successfully!
                  </h3>
                  <p className="text-gray-600">
                    Check your phone for the M-Pesa prompt and enter your PIN to complete the payment.
                  </p>
                </div>

                {error && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={handleCheckPaymentStatus}
                    disabled={statusLoading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {statusLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Checking Status...
                      </>
                    ) : (
                      "Check Payment Status"
                    )}
                  </button>

                  <button
                    onClick={handleResendSTK}
                    disabled={resendLoading || resendCooldown > 0}
                    className="w-full border-2 border-green-600 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {resendLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Resending...
                      </>
                    ) : resendCooldown > 0 ? (
                      `Resend STK (${resendCooldown}s)`
                    ) : (
                      "Resend STK"
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          // Payment Successful
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-green-600">
                Payment Successful!
              </h3>
              <p className="text-gray-600">
                Your payment has been processed successfully.
              </p>
              <p className="text-sm text-gray-500">
                Placing your order now...
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                Amount: <strong>KES {total.toLocaleString()}</strong>
              </p>
              <p className="text-sm text-green-800">
                Phone: <strong>{phone}</strong>
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}