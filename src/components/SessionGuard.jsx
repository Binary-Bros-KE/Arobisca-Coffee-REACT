"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { logout, checkSessionExpiry } from "../redux/slices/authSlice"
import { sessionManager } from "../utils/sessionManager"
import toast from "react-hot-toast"

export default function SessionGuard({ children }) {
  const dispatch = useDispatch()
  const location = useLocation()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(checkSessionExpiry())

      if (sessionManager.isSessionExpired()) {
        dispatch(logout())
        toast.error("Your session has expired. Please login again.")
      }
    }
  }, [location, isAuthenticated, dispatch])

  return children
}
