import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  MessageCircleMore,
  Bell,
  User,
  Newspaper,
  Bookmark,
  Search,
  Calendar,
  Clock,
  X,
  Filter,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  XCircleIcon,
  ArrowUpRight,
  Coffee,
  CheckSquare,
  Star,
  MapPin,
  Users,
  FileText,
  PowerOff,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import ProviderTrackingMap from "./ProviderTrackingMap"
import NotificationPopup, { type NotificationItem } from "../Customer_Tabs/Notification"

// Extend the NotificationItem type to include the read property
declare module "../Customer_Tabs/Notification" {
  interface NotificationItem {
    read?: boolean
  }
}

const WaitingForProviderState: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isWaiting, setIsWaiting] = useState(true)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isWaiting) {
      timer = setTimeout(() => {
        setIsWaiting(false)
      }, 10000)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [isWaiting])

  return (
    <>
      {isWaiting ? (
        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
          <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
          Waiting for provider...
        </div>
      ) : (
        <button
          onClick={onComplete}
          className="px-4 py-2 w-82 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
        >
          <MapPin className="w-4 h-4 inline mr-1" />
          Track Service
        </button>
      )}
    </>
  )
}

interface DockItemProps {
  icon: React.ReactNode
  to: string
  isActive: boolean
  onClick?: () => void
  badge?: number
}

const DockItem: React.FC<DockItemProps> = ({ icon, to, isActive, onClick, badge }) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (to === "/logout") {
      window.location.href = "/login"
    } else if (to === "/profile") {
      window.location.href = "/customer/profile"
    } else if (to === "/") {
      window.location.href = "/"
    } else {
      console.log(`Navigate to: ${to}`)
    }
  }

  return (
    <div
      className="relative flex items-center justify-center w-10 h-10 cursor-pointer transition-all duration-200 ease-in-out hover:scale-110"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex items-center justify-center transition-all duration-200 ${
          isActive ? "text-primary" : isHovered ? "text-primary/80" : "text-gray-400"
        }`}
      >
        {to === "/notification" ? (
          <motion.div
            animate={badge !== undefined && badge > 0 ? { rotate: [0, -5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
            className="relative"
          >
            {icon}
            {badge !== undefined && badge > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full ring-1 ring-white"
                style={{ transform: "translate(30%, -30%)" }}
              />
            )}
          </motion.div>
        ) : (
          icon
        )}
      </div>

      {/* Label with animation */}
      <div
        className={`absolute -top-8 bg-sky-400 text-white text-xs px-2 py-1 rounded-md opacity-0 transition-all duration-200 ${
          isHovered ? "opacity-100 transform translate-y-0" : "transform translate-y-2"
        }`}
      >
        {to === "/"
          ? "Home"
          : to === "#" && onClick
            ? "Bookings"
            : to === "/notification"
              ? "Notifications"
              : to === "/profile"
                ? "Profile"
                : to === "/news"
                  ? "News"
                  : to === "/chat"
                    ? "Chats"
                    : to === "/logout"
                      ? "Logout"
                      : to}
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  count: number
  icon: React.ReactNode
  trend?: string
  trendValue?: number
}

const StatCard: React.FC<StatCardProps> = ({ title, count, icon, trend, trendValue }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
    <div className="flex items-start justify-between">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
      {trend && trendValue && (
        <div
          className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${
            trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {trend === "up" ? "+" : "-"}
          {trendValue}%
          {trend === "up" ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
        </div>
      )}
    </div>
    <h3 className="text-2xl font-bold mt-4">{count}</h3>
    <p className="text-sm text-gray-500 mt-1">{title}</p>
  </div>
)

interface Booking {
  _id: string
  id?: number
  userId: string
  firstname: string
  productName: string
  providerName: string
  providerId: number
  workerCount: number
  bookingDate: string
  bookingTime: string
  location: {
    name: string
    lat: number
    lng: number
    distance: number
  }
  estimatedTime?: string
  pricing: {
    baseRate: number
    distanceCharge: number
    totalRate: number
  }
  status: string
  createdAt: string
  // Legacy fields for compatibility
  companyName?: string
  service?: string
  date?: string
  price?: number
  image?: string
  paymentComplete?: boolean
  providerArrived?: boolean
  serviceType?: string
  ratePerKm?: number
  additionalFees?: number
  baseRate?: number
}

const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState<number>(30)
  const [status, setStatus] = useState(booking.status)
  const [paymentComplete] = useState(booking.paymentComplete || false)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [, setIsLoadingMap] = useState(false)
  const [providerArrived, setProviderArrived] = useState(booking.providerArrived || false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [reviewRating, setReviewRating] = useState<number | null>(null)
  const [reviewText, setReviewText] = useState("")
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const customerLocation = { lat: 14.5995, lng: 120.9842 }

  // Convert database booking to display format
  const displayBooking = {
    id: booking.id || Number.parseInt(booking._id.slice(-6), 16), // Use last 6 chars of _id as number
    companyName: booking.companyName || booking.providerName,
    service: booking.service || booking.productName,
    serviceType: booking.serviceType || "",
    status: booking.status,
    date: booking.date || new Date(booking.bookingDate).toLocaleDateString(),
    price: booking.price || booking.pricing.totalRate,
    image: booking.image || "https://cdn.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg",
    workerCount: booking.workerCount,
    estimatedTime: booking.estimatedTime || "2-4 hours",
    location: booking.location.name,
    distance: booking.location.distance,
    baseRate: booking.baseRate || booking.pricing.baseRate,
    ratePerKm: booking.ratePerKm || booking.pricing.distanceCharge / booking.location.distance || 20,
    additionalFees: booking.additionalFees || 0,
    paymentComplete: booking.paymentComplete || false,
    providerArrived: booking.providerArrived || false,
  }

  useEffect(() => {
    let timer: NodeJS.Timeout

    // Only start the timer if status is ongoing AND we're not in "Track Service" mode
    if (status === "ongoing" && !paymentComplete) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            setStatus("cancelled")
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [status, paymentComplete])

  // Check for provider arrival
  useEffect(() => {
    const checkProviderArrival = () => {
      const providerArrivedData = localStorage.getItem("providerArrived")
      if (providerArrivedData) {
        try {
          const data = JSON.parse(providerArrivedData)
          if (data.bookingId === displayBooking.id) {
            setProviderArrived(true)
          }
        } catch (e) {
          console.error("Error parsing provider arrival data", e)
        }
      }
    }

    // Check immediately
    checkProviderArrival()

    // Set up interval to check periodically
    const intervalId = setInterval(checkProviderArrival, 2000)

    return () => clearInterval(intervalId)
  }, [displayBooking.id])

  const handleCompletePayment = () => {
    // Store the current booking data in localStorage
    localStorage.setItem("currentBookingDetails", JSON.stringify(displayBooking))

    // Create seller information from the booking data
    const sellerInfo = {
      id: displayBooking.id,
      name: displayBooking.companyName,
      rating: 4.5,
      reviews: 24,
      location: displayBooking.location || "Local Service Provider",
      price: displayBooking.price,
      startingRate:
        displayBooking.baseRate ||
        displayBooking.price - (displayBooking.distance || 0) * (displayBooking.ratePerKm || 0),
      ratePerKm: displayBooking.ratePerKm || 20,
      description: `${displayBooking.service} - ${displayBooking.serviceType || ""}`.trim(),
      workerCount: displayBooking.workerCount || 1,
    }

    // Navigate to transaction page with seller info and booking details
    navigate("/transaction", {
      state: {
        seller: sellerInfo,
        booking: {
          id: displayBooking.id,
          service: displayBooking.service,
          serviceType: displayBooking.serviceType,
          date: displayBooking.date,
          location: displayBooking.location,
          distance: displayBooking.distance,
          baseRate:
            displayBooking.baseRate ||
            displayBooking.price - (displayBooking.distance || 0) * (displayBooking.ratePerKm || 0),
          distanceCharge: (displayBooking.distance || 0) * (displayBooking.ratePerKm || 0),
          additionalFees: displayBooking.additionalFees || 0,
          price: displayBooking.price,
          workerCount: displayBooking.workerCount,
          estimatedTime: displayBooking.estimatedTime,
        },
      },
    })
  }

  const handleTrackProvider = () => {
    // Show loading state
    setIsLoadingMap(true)

    // Show tracking modal with waiting state
    setShowTrackingModal(true)

    // The loading state will be managed inside the tracking modal
    setIsLoadingMap(false)
  }

  const handleCompleteService = () => {
    // Show review modal instead of immediately completing
    setShowReviewModal(true)
  }

  const handleReviewSubmit = () => {
    // Hide review modal and show success modal
    setShowReviewModal(false)
    setShowSuccessModal(true)

    // Store review data if needed
    localStorage.setItem(
      "serviceReview",
      JSON.stringify({
        id: displayBooking.id,
        timestamp: new Date().getTime(),
        rating: reviewRating,
        text: reviewText,
      }),
    )
  }

  const handleSuccessConfirm = () => {
    // Hide success modal
    setShowSuccessModal(false)

    // Update booking status to completed
    setStatus("completed")

    // Store completion in localStorage
    localStorage.setItem(
      "serviceCompleted",
      JSON.stringify({
        id: displayBooking.id,
        timestamp: new Date().getTime(),
      }),
    )

    // Clear provider arrived flag
    localStorage.removeItem("providerArrived")

    // Close the tracking modal if it's open
    setShowTrackingModal(false)
  }

  const handleViewDetails = () => {
    // Store the current booking data in localStorage for the Transaction component to access
    localStorage.setItem("currentBookingDetails", JSON.stringify(displayBooking))
    setShowDetailsModal(true)
  }

  const getStatusBadge = () => {
    switch (status) {
      case "pending":
        return (
          <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            Pending
          </div>
        )
      case "ongoing":
        return (
          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Ongoing
          </div>
        )
      case "cancelled":
        return (
          <div className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-1 rounded-full text-xs font-medium">
            <XCircleIcon className="w-3 h-3" />
            Cancelled
          </div>
        )
      case "completed":
        return (
          <div className="flex items-center gap-1 text-sky-600 bg-sky-50 px-2 py-1 rounded-full text-xs font-medium">
            <CheckSquare className="w-3 h-3" />
            Completed
          </div>
        )
      default:
        return null
    }
  }

  const getActionButtons = () => {
    switch (status) {
      case "pending":
        return (
          <div className="flex gap-2 mt-4">
            <button className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
              <RotateCcw className="w-4 h-4" />
              Book Again
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
              onClick={() => setStatus("cancelled")}
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )
      case "ongoing":
        return (
          <div className="mt-4 space-y-2">
            {/* Only show timer when not in Track Service mode */}
            {!paymentComplete && !providerArrived && (
              <div
                className={`flex items-center justify-between ${
                  timeLeft > 20
                    ? "bg-emerald-50 text-emerald-700"
                    : timeLeft > 10
                      ? "bg-amber-50 text-amber-700"
                      : "bg-rose-50 text-rose-700"
                } rounded-lg px-3 py-1.5`}
              >
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{timeLeft}s</span>
              </div>
            )}

            {providerArrived ? (
              <button
                className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors"
                onClick={handleCompleteService}
              >
                <CheckSquare className="w-4 h-4" />
                Complete Service
              </button>
            ) : paymentComplete ? (
              <div className="w-full">
                <WaitingForProviderState onComplete={handleTrackProvider} />
              </div>
            ) : (
              <button
                className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                onClick={handleCompletePayment}
              >
                <ArrowUpRight className="w-4 h-4" />
                Manage Payment
              </button>
            )}
          </div>
        )
      case "cancelled":
        return (
          <button className="flex items-center gap-1 px-4 py-2 mt-4 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors w-full justify-center">
            <RotateCcw className="w-4 h-4" />
            Book Again
          </button>
        )
      case "completed":
        return (
          <button className="flex items-center gap-1 px-4 py-2 mt-4 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors w-full justify-center">
            <RotateCcw className="w-4 h-4" />
            Book Again
          </button>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <div className="flex bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="w-1/3 relative h-[150px]">
        <img
          src={displayBooking.image || "/placeholder.svg"}
          alt={displayBooking.service}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-2/3 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-base">{displayBooking.companyName}</h3>
            <p className="text-gray-600 text-sm mt-1">{displayBooking.service}</p>

            {/* Worker count information */}
            {displayBooking.workerCount && (
              <div className="flex items-center text-gray-500 text-xs mt-1">
                <Users className="w-3 h-3 mr-1 text-sky-500" />
                <span>
                  {displayBooking.workerCount} worker{displayBooking.workerCount > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
          {getStatusBadge()}
        </div>

        <div className="flex items-center justify-between mt-3 text-sm">
          <div className="flex items-center text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            {displayBooking.date}
          </div>
          <p className="font-medium">₱{displayBooking.price.toLocaleString()}</p>
        </div>

        {/* View Details Button */}
        <div className="mt-2 mb-1">
          <button
            onClick={handleViewDetails}
            className="w-full flex items-center justify-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs"
          >
            <FileText className="w-3 h-3" />
            View Details
          </button>
        </div>

        {getActionButtons()}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailsModal(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-xl z-50 w-[90%] max-w-4xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700">Booking Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Service Provider Information */}
              <div className="mb-6 p-5 bg-gray-200/70 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-lg">{displayBooking.companyName}</p>
                    <div className="flex items-center mt-1">
                      <div className="text-yellow-500 mr-2">{"★".repeat(4)}</div>
                      <span className="text-sm text-gray-600">24 reviews</span>
                    </div>
                  </div>
                  {getStatusBadge()}
                </div>
              </div>

              {/* Two-column layout for service info and payment summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Service Information */}
                <div className="p-5 bg-gray-200/70 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 text-gray-700">Service Information</h4>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-300">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium">{displayBooking.service}</span>
                    </div>

                    {displayBooking.serviceType && (
                      <div className="flex justify-between items-center pb-2 border-b border-gray-300">
                        <span className="text-gray-600">Service Type:</span>
                        <span className="font-medium">{displayBooking.serviceType}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pb-2 border-b border-gray-300">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{formatDate(displayBooking.date)}</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-gray-300">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{displayBooking.location || "Not specified"}</span>
                    </div>

                    {displayBooking.workerCount && (
                      <div className="flex justify-between items-center pb-2 border-b border-gray-300">
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-1 text-sky-500" />
                          <span>Workers:</span>
                        </div>
                        <span className="font-medium">
                          {displayBooking.workerCount} worker{displayBooking.workerCount > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}

                    {displayBooking.estimatedTime && (
                      <div className="flex justify-between items-center pb-2 border-b border-gray-300">
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-1 text-sky-500" />
                          <span>Estimated Time:</span>
                        </div>
                        <span className="font-medium">{displayBooking.estimatedTime}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Payment Summary */}
                <div className="p-5 bg-gray-200/70 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 text-gray-700">Payment Summary</h4>

                  {/* Base Rate */}
                  <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-2">
                    <p className="text-gray-600">Base Service Rate</p>
                    <p className="text-gray-800 font-medium">₱{displayBooking.baseRate?.toLocaleString() || "0"}</p>
                  </div>

                  {/* Distance Charge */}
                  {displayBooking.distance && displayBooking.ratePerKm && (
                    <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-2">
                      <p className="text-gray-600">
                        Distance Charge ({displayBooking.distance.toFixed(1)} km × ₱{displayBooking.ratePerKm})
                      </p>
                      <p className="text-gray-800 font-medium">
                        ₱
                        {(displayBooking.distance * displayBooking.ratePerKm).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex justify-between items-center pt-2 mt-2">
                    <p className="text-gray-700 font-bold">Total Amount</p>
                    <p className="text-xl text-gray-800 font-bold">₱{displayBooking.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                {status === "pending" && (
                  <button
                    onClick={() => {
                      setStatus("cancelled")
                      setShowDetailsModal(false)
                    }}
                    className="px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}

                {status === "ongoing" && !paymentComplete && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false)
                      handleCompletePayment()
                    }}
                    className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                  >
                    Manage Payment
                  </button>
                )}

                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Tracking Modal */}
      <AnimatePresence>
        {showTrackingModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTrackingModal(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-5 shadow-xl z-50 w-[90%] max-w-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Service Provider Tracking</h3>
                <button
                  onClick={() => setShowTrackingModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <ProviderTrackingMap
                providerName={displayBooking.companyName}
                bookingId={displayBooking.id}
                customerLocation={customerLocation} // Manila coordinates as example
                providerLocation={{ lat: 14.5547, lng: 121.0244 }} // Makati coordinates as example
                onProviderArrived={() => {
                  // Only update the state, don't close the modal
                  setProviderArrived(true)
                }}
              />

              <div className="mt-4 flex justify-end">
                {providerArrived ? (
                  <button
                    onClick={handleCompleteService}
                    className="px-6 py-2.5 bg-sky-500 text-white rounded-full font-medium shadow-sm hover:bg-sky-600 active:scale-95 transition-all duration-200"
                  >
                    Complete
                  </button>
                ) : paymentComplete ? (
                  <div>
                    <WaitingForProviderState
                      onComplete={() => {
                        // Create a custom event that the ProviderTrackingMap component can listen for
                        const arrivalEvent = new CustomEvent("providerForceArrival", {
                          detail: { bookingId: displayBooking.id },
                        })
                        window.dispatchEvent(arrivalEvent)

                        // Also update our local state
                        setProviderArrived(true)

                        // Store in localStorage to persist the state
                        localStorage.setItem(
                          "providerArrived",
                          JSON.stringify({
                            bookingId: displayBooking.id,
                            providerName: displayBooking.companyName,
                            timestamp: new Date().getTime(),
                          }),
                        )
                      }}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      // Create a custom event that the ProviderTrackingMap component can listen for
                      const arrivalEvent = new CustomEvent("providerForceArrival", {
                        detail: { bookingId: displayBooking.id },
                      })
                      window.dispatchEvent(arrivalEvent)

                      // Also update our local state
                      setProviderArrived(true)

                      // Store in localStorage to persist the state
                      localStorage.setItem(
                        "providerArrived",
                        JSON.stringify({
                          bookingId: displayBooking.id,
                          providerName: displayBooking.companyName,
                          timestamp: new Date().getTime(),
                        }),
                      )
                    }}
                    className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                  >
                    Complete Simulation
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-md z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewModal(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl z-50 w-[90%] max-w-md border border-white/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-semibold text-gray-800">Rate Your Service</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100/80 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <motion.button
                      key={`review-rating-${rating}`}
                      onClick={() => setReviewRating(rating)}
                      className="focus:outline-none"
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Star
                        className={`h-9 w-9 ${
                          reviewRating !== null && rating <= reviewRating
                            ? "text-amber-500 fill-amber-500"
                            : "text-gray-300"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                  Share your experience (optional)
                </label>
                <textarea
                  id="review"
                  className="w-full p-4 border border-gray-200 rounded-2xl text-sm bg-gray-50/80 focus:ring-sky-500 focus:border-transparent focus:outline-none transition-all"
                  rows={3}
                  placeholder="How was your experience with this service?"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <motion.button
                  className="px-6 py-2.5 bg-gray-200/80 text-gray-700 rounded-full font-medium"
                  onClick={() => setShowReviewModal(false)}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Skip
                </motion.button>
                <motion.button
                  className={`px-6 py-2.5 bg-sky-500 text-white rounded-full font-medium shadow-sm ${
                    reviewRating === null ? "opacity-50 cursor-not-allowed" : "hover:bg-sky-600"
                  }`}
                  onClick={handleReviewSubmit}
                  disabled={reviewRating === null}
                  whileTap={reviewRating !== null ? { scale: 0.95 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  Submit Review
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-md z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl z-50 w-[90%] max-w-md border border-white/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Service Completed Successfully!</h3>
                <p className="text-gray-600 mb-6">
                  Thank you for using our service. We hope you had a great experience!
                </p>
                <motion.button
                  onClick={handleSuccessConfirm}
                  className="px-8 py-3 bg-sky-500 text-white rounded-full font-medium shadow-sm hover:bg-sky-600 transition-all duration-200"
                  whileTap={{ scale: 0.95 }}
                >
                  Confirm
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

const FloatingDock: React.FC = () => {
  const [showDrawer, setShowDrawer] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAllServices, setShowAllServices] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState("all")
  const [showDock, setShowDock] = useState(true)
  const [showNotificationPopup, setShowNotificationPopup] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [unreadNotifications, setUnreadNotifications] = useState(2) // Start with 2 unread notifications

  // Function to fetch user bookings from the backend
  const fetchUserBookings = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      setError("")

      // Get user data from localStorage
      const userData = localStorage.getItem("user")
      if (!userData) {
        setError("User not logged in")
        if (!silent) setLoading(false)
        return
      }

      // Parse the user data
      const parsedData = JSON.parse(userData)

      // Extract user ID - handle different possible formats
      let userId

      // Format 1: { user: { _id: "..." }, token: "..." }
      if (parsedData.user && parsedData.user._id) {
        userId = parsedData.user._id
        if (!silent) console.log("Found user ID in format 1:", userId)
      }
      // Format 2: { _id: "...", token: "..." }
      else if (parsedData._id) {
        userId = parsedData._id
        if (!silent) console.log("Found user ID in format 2:", userId)
      }
      // Format 3: { id: "...", token: "..." }
      else if (parsedData.id) {
        userId = parsedData.id
        if (!silent) console.log("Found user ID in format 3:", userId)
      }
      // No valid user ID found
      else {
        console.error("User data structure:", parsedData)
        setError("Could not find user ID in stored data")
        if (!silent) setLoading(false)
        return
      }

      if (!silent) console.log("Fetching bookings for user:", userId)

      // Use the correct API URL
      const apiUrl = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/bookings/user/${userId}`
      if (!silent) console.log("API URL:", apiUrl)

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.statusText}`)
      }

      const userBookings = await response.json()
      if (!silent) console.log("Fetched bookings:", userBookings)

      // If no bookings found, use sample data for demonstration
      if (userBookings.length === 0) {
        if (!silent) console.log("No bookings found, using sample data")

        // Sample data for all booking statuses
        const sampleBookings = [
          // PENDING BOOKINGS
          {
            _id: "sample1",
            userId: userId,
            firstname: "John",
            productName: "Plumbing Services",
            providerName: "PipeFix Pros",
            providerId: 1,
            workerCount: 1,
            bookingDate: new Date().toISOString(),
            bookingTime: "10:00 AM",
            location: {
              name: "123 Main St, Cebu City",
              lat: 10.3157,
              lng: 123.8854,
              distance: 3.5,
            },
            estimatedTime: "1-2 hours",
            pricing: {
              baseRate: 1200,
              distanceCharge: 87.5,
              totalRate: 1287.5,
            },
            status: "pending",
            createdAt: new Date().toISOString(),
          },
          {
            _id: "sample2",
            userId: userId,
            firstname: "Maria",
            productName: "Electrical Repair",
            providerName: "PowerFix Solutions",
            providerId: 2,
            workerCount: 2,
            bookingDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            bookingTime: "2:00 PM",
            location: {
              name: "456 Park Avenue, Makati City",
              lat: 14.5547,
              lng: 121.0244,
              distance: 2.8,
            },
            estimatedTime: "3-4 hours",
            pricing: {
              baseRate: 1500,
              distanceCharge: 70,
              totalRate: 1570,
            },
            status: "pending",
            createdAt: new Date().toISOString(),
          },

          // ONGOING BOOKINGS
          {
            _id: "sample3",
            userId: userId,
            firstname: "Carlos",
            productName: "House Cleaning",
            providerName: "CleanPro Services",
            providerId: 3,
            workerCount: 3,
            bookingDate: new Date().toISOString(),
            bookingTime: "9:30 AM",
            location: {
              name: "789 Seaside Blvd, Manila",
              lat: 14.5995,
              lng: 120.9842,
              distance: 5.2,
            },
            estimatedTime: "4-5 hours",
            pricing: {
              baseRate: 2200,
              distanceCharge: 130,
              totalRate: 2330,
            },
            status: "ongoing",
            paymentComplete: true,
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          },
          {
            _id: "sample4",
            userId: userId,
            firstname: "Elena",
            productName: "Aircon Maintenance",
            providerName: "CoolAir Technicians",
            providerId: 4,
            workerCount: 2,
            bookingDate: new Date().toISOString(),
            bookingTime: "11:00 AM",
            location: {
              name: "101 Green Hills, Pasig City",
              lat: 14.5764,
              lng: 121.0851,
              distance: 4.1,
            },
            estimatedTime: "1-2 hours",
            pricing: {
              baseRate: 1800,
              distanceCharge: 102.5,
              totalRate: 1902.5,
            },
            status: "ongoing",
            paymentComplete: false,
            createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          },

          // CANCELLED BOOKINGS
          {
            _id: "sample5",
            userId: userId,
            firstname: "Miguel",
            productName: "Furniture Assembly",
            providerName: "BuildIt Experts",
            providerId: 5,
            workerCount: 2,
            bookingDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            bookingTime: "3:00 PM",
            location: {
              name: "222 Orchard Road, Quezon City",
              lat: 14.676,
              lng: 121.0437,
              distance: 3.7,
            },
            estimatedTime: "2-3 hours",
            pricing: {
              baseRate: 1350,
              distanceCharge: 92.5,
              totalRate: 1442.5,
            },
            status: "cancelled",
            createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          },
          {
            _id: "sample6",
            userId: userId,
            firstname: "Isabella",
            productName: "Pest Control",
            providerName: "BugBusters",
            providerId: 6,
            workerCount: 1,
            bookingDate: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            bookingTime: "10:00 AM",
            location: {
              name: "333 Coconut Avenue, Taguig",
              lat: 14.5176,
              lng: 121.0509,
              distance: 6.3,
            },
            estimatedTime: "2-3 hours",
            pricing: {
              baseRate: 1700,
              distanceCharge: 157.5,
              totalRate: 1857.5,
            },
            status: "cancelled",
            createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
          },

          // COMPLETED BOOKINGS
          {
            _id: "sample7",
            userId: userId,
            firstname: "Rafael",
            productName: "Lawn Mowing",
            providerName: "GreenThumb Landscaping",
            providerId: 7,
            workerCount: 2,
            bookingDate: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
            bookingTime: "8:00 AM",
            location: {
              name: "444 Hillside Drive, Antipolo",
              lat: 14.5885,
              lng: 121.1754,
              distance: 8.2,
            },
            estimatedTime: "3-4 hours",
            pricing: {
              baseRate: 1600,
              distanceCharge: 205,
              totalRate: 1805,
            },
            status: "completed",
            createdAt: new Date(Date.now() - 691200000).toISOString(), // 8 days ago
          },
          {
            _id: "sample8",
            userId: userId,
            firstname: "Sofia",
            productName: "Carpet Cleaning",
            providerName: "FreshStart Cleaners",
            providerId: 8,
            workerCount: 2,
            bookingDate: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
            bookingTime: "1:00 PM",
            location: {
              name: "555 Beachfront Road, Parañaque",
              lat: 14.4793,
              lng: 120.9977,
              distance: 4.8,
            },
            estimatedTime: "2-3 hours",
            pricing: {
              baseRate: 1900,
              distanceCharge: 120,
              totalRate: 2020,
            },
            status: "completed",
            createdAt: new Date(Date.now() - 1296000000).toISOString(), // 15 days ago
          },
          {
            _id: "sample9",
            userId: userId,
            firstname: "Diego",
            productName: "Roof Repair",
            providerName: "TopNotch Roofing",
            providerId: 9,
            workerCount: 3,
            bookingDate: new Date(Date.now() - 1814400000).toISOString(), // 3 weeks ago
            bookingTime: "9:00 AM",
            location: {
              name: "666 Mountain View, Tagaytay",
              lat: 14.1153,
              lng: 120.9621,
              distance: 12.5,
            },
            estimatedTime: "5-6 hours",
            pricing: {
              baseRate: 3500,
              distanceCharge: 312.5,
              totalRate: 3812.5,
            },
            status: "completed",
            createdAt: new Date(Date.now() - 1900800000).toISOString(), // 22 days ago
          },
        ]

        setBookings(sampleBookings)
      } else {
        setBookings(userBookings)
      }
    } catch (err) {
      console.error("Error fetching bookings:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch bookings")

      // Use sample data if fetch fails
      console.log("Using sample data due to fetch error")

      // Sample data for all booking statuses
      const sampleBookings = [
        // PENDING BOOKINGS
        {
          _id: "sample1",
          userId: "sample_user_id",
          firstname: "John",
          productName: "Plumbing Services",
          providerName: "PipeFix Pros",
          providerId: 1,
          workerCount: 1,
          bookingDate: new Date().toISOString(),
          bookingTime: "10:00 AM",
          location: {
            name: "123 Main St, Cebu City",
            lat: 10.3157,
            lng: 123.8854,
            distance: 3.5,
          },
          estimatedTime: "1-2 hours",
          pricing: {
            baseRate: 1200,
            distanceCharge: 87.5,
            totalRate: 1287.5,
          },
          status: "pending",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "sample2",
          userId: "sample_user_id",
          firstname: "Maria",
          productName: "Electrical Repair",
          providerName: "PowerFix Solutions",
          providerId: 2,
          workerCount: 2,
          bookingDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          bookingTime: "2:00 PM",
          location: {
            name: "456 Park Avenue, Makati City",
            lat: 14.5547,
            lng: 121.0244,
            distance: 2.8,
          },
          estimatedTime: "3-4 hours",
          pricing: {
            baseRate: 1500,
            distanceCharge: 70,
            totalRate: 1570,
          },
          status: "pending",
          createdAt: new Date().toISOString(),
        },

        // ONGOING BOOKINGS
        {
          _id: "sample3",
          userId: "sample_user_id",
          firstname: "Carlos",
          productName: "House Cleaning",
          providerName: "CleanPro Services",
          providerId: 3,
          workerCount: 3,
          bookingDate: new Date().toISOString(),
          bookingTime: "9:30 AM",
          location: {
            name: "789 Seaside Blvd, Manila",
            lat: 14.5995,
            lng: 120.9842,
            distance: 5.2,
          },
          estimatedTime: "4-5 hours",
          pricing: {
            baseRate: 2200,
            distanceCharge: 130,
            totalRate: 2330,
          },
          status: "ongoing",
          paymentComplete: true,
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
        {
          _id: "sample4",
          userId: "sample_user_id",
          firstname: "Elena",
          productName: "Aircon Maintenance",
          providerName: "CoolAir Technicians",
          providerId: 4,
          workerCount: 2,
          bookingDate: new Date().toISOString(),
          bookingTime: "11:00 AM",
          location: {
            name: "101 Green Hills, Pasig City",
            lat: 14.5764,
            lng: 121.0851,
            distance: 4.1,
          },
          estimatedTime: "1-2 hours",
          pricing: {
            baseRate: 1800,
            distanceCharge: 102.5,
            totalRate: 1902.5,
          },
          status: "ongoing",
          paymentComplete: false,
          createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        },

        // CANCELLED BOOKINGS
        {
          _id: "sample5",
          userId: "sample_user_id",
          firstname: "Miguel",
          productName: "Furniture Assembly",
          providerName: "BuildIt Experts",
          providerId: 5,
          workerCount: 2,
          bookingDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          bookingTime: "3:00 PM",
          location: {
            name: "222 Orchard Road, Quezon City",
            lat: 14.676,
            lng: 121.0437,
            distance: 3.7,
          },
          estimatedTime: "2-3 hours",
          pricing: {
            baseRate: 1350,
            distanceCharge: 92.5,
            totalRate: 1442.5,
          },
          status: "cancelled",
          createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        },
        {
          _id: "sample6",
          userId: "sample_user_id",
          firstname: "Isabella",
          productName: "Pest Control",
          providerName: "BugBusters",
          providerId: 6,
          workerCount: 1,
          bookingDate: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
          bookingTime: "10:00 AM",
          location: {
            name: "333 Coconut Avenue, Taguig",
            lat: 14.5176,
            lng: 121.0509,
            distance: 6.3,
          },
          estimatedTime: "2-3 hours",
          pricing: {
            baseRate: 1700,
            distanceCharge: 157.5,
            totalRate: 1857.5,
          },
          status: "cancelled",
          createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        },

        // COMPLETED BOOKINGS
        {
          _id: "sample7",
          userId: "sample_user_id",
          firstname: "Rafael",
          productName: "Lawn Mowing",
          providerName: "GreenThumb Landscaping",
          providerId: 7,
          workerCount: 2,
          bookingDate: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
          bookingTime: "8:00 AM",
          location: {
            name: "444 Hillside Drive, Antipolo",
            lat: 14.5885,
            lng: 121.1754,
            distance: 8.2,
          },
          estimatedTime: "3-4 hours",
          pricing: {
            baseRate: 1600,
            distanceCharge: 205,
            totalRate: 1805,
          },
          status: "completed",
          createdAt: new Date(Date.now() - 691200000).toISOString(), // 8 days ago
        },
        {
          _id: "sample8",
          userId: "sample_user_id",
          firstname: "Sofia",
          productName: "Carpet Cleaning",
          providerName: "FreshStart Cleaners",
          providerId: 8,
          workerCount: 2,
          bookingDate: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
          bookingTime: "1:00 PM",
          location: {
            name: "555 Beachfront Road, Parañaque",
            lat: 14.4793,
            lng: 120.9977,
            distance: 4.8,
          },
          estimatedTime: "2-3 hours",
          pricing: {
            baseRate: 1900,
            distanceCharge: 120,
            totalRate: 2020,
          },
          status: "completed",
          createdAt: new Date(Date.now() - 1296000000).toISOString(), // 15 days ago
        },
        {
          _id: "sample9",
          userId: "sample_user_id",
          firstname: "Diego",
          productName: "Roof Repair",
          providerName: "TopNotch Roofing",
          providerId: 9,
          workerCount: 3,
          bookingDate: new Date(Date.now() - 1814400000).toISOString(), // 3 weeks ago
          bookingTime: "9:00 AM",
          location: {
            name: "666 Mountain View, Tagaytay",
            lat: 14.1153,
            lng: 120.9621,
            distance: 12.5,
          },
          estimatedTime: "5-6 hours",
          pricing: {
            baseRate: 3500,
            distanceCharge: 312.5,
            totalRate: 3812.5,
          },
          status: "completed",
          createdAt: new Date(Date.now() - 1900800000).toISOString(), // 22 days ago
        },
      ]

      setBookings(sampleBookings)
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch bookings when component mounts
  useEffect(() => {
    fetchUserBookings()
  }, [])

  // Set up polling to refresh bookings every 5 seconds
  useEffect(() => {
    const pollingInterval = setInterval(() => {
      fetchUserBookings(true)
    }, 5000)

    // Clean up interval on component unmount
    return () => clearInterval(pollingInterval)
  }, [])

  // Check localStorage for booking updates and drawer open state
  useEffect(() => {
    // Check if we should open the bookings drawer
    const shouldOpenBookings = localStorage.getItem("openBookingsDrawer")
    if (shouldOpenBookings === "true") {
      setShowDrawer(true)
      localStorage.removeItem("openBookingsDrawer") // Clear the flag
    }

    // Check if we need to update a booking status
    const updateStatusData = localStorage.getItem("updateBookingStatus")
    if (updateStatusData) {
      try {
        const { id, status } = JSON.parse(updateStatusData)

        // Update the booking with the given ID to the new status
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === id || booking._id === id || Number.parseInt(booking._id.slice(-6), 16) === id
              ? { ...booking, status }
              : booking,
          ),
        )

        localStorage.removeItem("updateBookingStatus") // Clear the flag
      } catch (e) {
        console.error("Error parsing booking status update", e)
      }
    }

    // Check for recent payment completion
    const recentPayment = localStorage.getItem("recentBookingPayment")
    if (recentPayment) {
      try {
        const paymentData = JSON.parse(recentPayment)

        // Update the booking with payment completion and status
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === paymentData.id ||
            booking._id === paymentData.id ||
            Number.parseInt(booking._id.slice(-6), 16) === paymentData.id
              ? {
                  ...booking,
                  status: paymentData.status || booking.status,
                  paymentComplete: true,
                }
              : booking,
          ),
        )

        // If tracking is requested, open the drawer
        if (paymentData.trackProvider) {
          setShowDrawer(true)
          setActiveTab("ongoing")
        }

        localStorage.removeItem("recentBookingPayment") // Clear the data
      } catch (e) {
        console.error("Error parsing recent payment data", e)
      }
    }

    // Check for provider arrival
    const providerArrivedData = localStorage.getItem("providerArrived")
    if (providerArrivedData) {
      try {
        const data = JSON.parse(providerArrivedData)

        // Update the booking with provider arrival
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === data.bookingId ||
            booking._id === data.bookingId ||
            Number.parseInt(booking._id.slice(-6), 16) === data.bookingId
              ? {
                  ...booking,
                  providerArrived: true,
                }
              : booking,
          ),
        )

        // Open the drawer to show the Complete Service button
        setShowDrawer(true)
        setActiveTab("ongoing")
      } catch (e) {
        console.error("Error parsing provider arrival data", e)
      }
    }

    // Check for service completion
    const serviceCompletedData = localStorage.getItem("serviceCompleted")
    if (serviceCompletedData) {
      try {
        const data = JSON.parse(serviceCompletedData)

        // Update the booking status to completed
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === data.id || booking._id === data.id || Number.parseInt(booking._id.slice(-6), 16) === data.id
              ? {
                  ...booking,
                  status: "completed",
                  providerArrived: false,
                }
              : booking,
          ),
        )

        localStorage.removeItem("serviceCompleted") // Clear the data
      } catch (e) {
        console.error("Error parsing service completion data", e)
      }
    }

    // Check URL parameters for booking updates
    const urlParams = new URLSearchParams(window.location.search)
    const bookingIdParam = urlParams.get("bookingId")
    const statusParam = urlParams.get("status")
    const paymentCompleteParam = urlParams.get("paymentComplete")
    const openBookingsParam = urlParams.get("openBookings")

    if (bookingIdParam && statusParam) {
      const bookingId = bookingIdParam

      // Update the booking with the given ID to the new status
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          String(booking.id) === bookingId ||
          booking._id === bookingId ||
          String(Number.parseInt(booking._id.slice(-6), 16)) === bookingId
            ? {
                ...booking,
                status: statusParam,
                paymentComplete: paymentCompleteParam === "true",
              }
            : booking,
        ),
      )
    }

    // Open bookings drawer if requested in URL
    if (openBookingsParam === "true") {
      setShowDrawer(true)
    }
  }, [])

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
  })

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  })

  const totalBookings = bookings.length
  const pendingBookings = bookings.filter((b) => b.status === "pending").length
  const ongoingBookings = bookings.filter((b) => b.status === "ongoing").length

  const filteredBookings = bookings.filter((booking) => {
    const companyName = booking.companyName || booking.providerName || ""
    const service = booking.service || booking.productName || ""
    const serviceType = booking.serviceType || ""

    const matchesSearch =
      companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      serviceType.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && booking.status === activeTab
  })

  const displayedBookings = showAllServices ? filteredBookings : filteredBookings.slice(0, 4)

  // Handler for notification bell click
  const handleNotificationClick = () => {
    setShowNotificationPopup(!showNotificationPopup)
  }

  // Function to check if all notifications are read and update badge count
  const updateNotificationBadge = (notifications: NotificationItem[]) => {
    const unreadCount = notifications.filter((n) => !n.read).length
    setUnreadNotifications(unreadCount)
  }

  return (
    <AnimatePresence>
      {/* Toggle Button - Only visible when dock is hidden */}
      {!showDock && (
        <motion.button
          onClick={() => setShowDock(true)}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border text-gray-500 rounded-full p-3 shadow-md hover:bg-gray-100 cursor-pointer transition-all duration-200 z-50"
          aria-label="Show dock"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 3,
              }}
            >
              <Coffee className="w-5 h-5" />
            </motion.div>

            {/* Notification badge on hidden dock button */}
            {unreadNotifications > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full ring-1 ring-white"
                style={{ transform: "translate(30%, -30%)" }}
              />
            )}
          </div>
        </motion.button>
      )}

      {/* New Dock Design - Horizontal at the bottom with admin styling */}
      {showDock && (
        <motion.div
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-200/40 backdrop-blur-lg rounded-full shadow-lg px-2 py-1 flex items-center transition-all duration-200 hover:shadow-xl z-50"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <DockItem icon={<Home size={20} strokeWidth={1.5} />} to="/" isActive={false} />
          <DockItem
            icon={<Bookmark size={20} strokeWidth={1.5} />}
            to="#"
            isActive={showDrawer}
            onClick={() => setShowDrawer(true)}
          />
          <div className="relative">
            <DockItem
              icon={<Bell size={20} strokeWidth={1.5} className="bell-icon" />}
              to="/notification"
              isActive={showNotificationPopup}
              onClick={handleNotificationClick}
              badge={unreadNotifications}
            />

            {/* Notification Popup */}
            <AnimatePresence>
              {showNotificationPopup && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 25,
                    mass: 0.5,
                  }}
                  className="absolute bottom-16 right-[-10.5rem] w-80 md:w-96 shadow-xl z-50"
                  style={{
                    transformOrigin: "bottom right",
                    filter: "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <NotificationPopup
                    onClose={() => setShowNotificationPopup(false)}
                    updateBadge={updateNotificationBadge}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <DockItem icon={<User size={20} strokeWidth={1.5} />} to="/profile" isActive={false} />
          <DockItem icon={<Newspaper size={20} strokeWidth={1.5} />} to="/news" isActive={false} />
          <DockItem icon={<MessageCircleMore size={20} strokeWidth={1.5} />} to="/chat" isActive={false} />
          <DockItem icon={<PowerOff size={20} strokeWidth={1.5} />} to="/logout" isActive={false} />

          {/* Hide Dock Button */}
          <div
            className="relative flex items-center justify-center w-10 h-10 cursor-pointer transition-all duration-200 ease-in-out hover:scale-110"
            onClick={() => setShowDock(false)}
            onMouseEnter={(e) => e.currentTarget.classList.add("scale-110")}
            onMouseLeave={(e) => e.currentTarget.classList.remove("scale-110")}
          >
            <div className="flex items-center justify-center transition-all duration-200 text-gray-400 hover:text-primary">
              <ChevronUp size={20} strokeWidth={1.5} />
            </div>
            <div className="absolute -top-8 bg-sky-400 text-white text-xs px-2 py-1 rounded-md opacity-0 transition-all duration-200 hover:opacity-100 hover:transform hover:translate-y-0 transform translate-y-2">
              Hide
            </div>
          </div>
        </motion.div>
      )}

      {/* Side Drawer (keeping it on the right side) */}
      <AnimatePresence>
        {showDrawer && (
          <motion.div
            className="fixed inset-y-0 right-0 w-full md:w-2/3 lg:w-1/2 xl:w-2/5 bg-gray-50 shadow-2xl z-40"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <LayoutDashboard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Booking Dashboard</h2>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{formattedTime}</span>
                      <span className="mx-2">•</span>
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={() => setShowDrawer(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Search and Filters */}
              <div className="p-4 bg-white border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search Services or Companies"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                      activeTab === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    All Bookings
                  </button>
                  <button
                    onClick={() => setActiveTab("pending")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                      activeTab === "pending"
                        ? "bg-amber-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setActiveTab("ongoing")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                      activeTab === "ongoing"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Ongoing
                  </button>
                  <button
                    onClick={() => setActiveTab("cancelled")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                      activeTab === "cancelled"
                        ? "bg-rose-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Cancelled
                  </button>
                  <button
                    onClick={() => setActiveTab("completed")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                      activeTab === "completed"
                        ? "bg-sky-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 p-4">
                <StatCard
                  title="Total"
                  count={totalBookings}
                  icon={<Bookmark className="w-5 h-5" />}
                  trend="up"
                  trendValue={12}
                />
                <StatCard
                  title="Pending"
                  count={pendingBookings}
                  icon={<AlertCircle className="w-5 h-5" />}
                  trend="down"
                  trendValue={5}
                />
                <StatCard
                  title="Ongoing"
                  count={ongoingBookings}
                  icon={<CheckCircle2 className="w-5 h-5" />}
                  trend="up"
                  trendValue={8}
                />
              </div>

              {/* Bookings List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin mb-2"></div>
                    <p>Loading bookings...</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                    <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
                    <p>Error loading bookings</p>
                    <p className="text-sm">{error}</p>
                    <button
                      onClick={() => fetchUserBookings()}
                      className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : displayedBookings.length > 0 ? (
                  displayedBookings.map((booking) => (
                    <BookingCard key={`booking-${booking._id || booking.id}`} booking={booking} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                    <Filter className="w-10 h-10 mb-2 opacity-50" />
                    <p>No bookings found</p>
                    <p className="text-sm">Try adjusting your filters</p>
                  </div>
                )}

                {filteredBookings.length > 4 && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setShowAllServices(!showAllServices)}
                      className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm"
                    >
                      {showAllServices ? (
                        <>
                          Show Less
                          <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          View More
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for drawer */}
      <AnimatePresence>
        {showDrawer && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={() => setShowDrawer(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  )
}

export default FloatingDock