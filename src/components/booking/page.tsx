"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "../ui/components"

interface SelectedBooth {
  id: number
  category: string
  price: number
}

const PROMO_CODES: Record<string, { discount: number; description: string }> = {
  EARLY10: { discount: 10, description: "10% Early Bird Discount" },
  SAVE20: { discount: 20, description: "20% Off Special" },
  VIP25: { discount: 25, description: "25% VIP Discount" },
  WELCOME15: { discount: 15, description: "15% Welcome Discount" },
}

export default function BookingPage() {
  const router = useRouter()
  const [boothData, setBoothData] = useState<SelectedBooth | null>(null)
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; description: string } | null>(null)
  const [promoError, setPromoError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    notes: "",
  })

  useEffect(() => {
    const storedBooth = sessionStorage.getItem("selectedBooth")
    if (storedBooth) {
      setBoothData(JSON.parse(storedBooth))
    } else {
      router.push("/")
    }
  }, [router])

  const handleApplyPromo = () => {
    const upperPromo = promoCode.trim().toUpperCase()
    if (PROMO_CODES[upperPromo]) {
      setAppliedPromo({
        code: upperPromo,
        discount: PROMO_CODES[upperPromo].discount,
        description: PROMO_CODES[upperPromo].description,
      })
      setPromoError("")
    } else {
      setPromoError("Invalid promo code")
      setAppliedPromo(null)
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoCode("")
    setPromoError("")
  }

  const originalPrice = boothData?.price || 0
  const discountAmount = appliedPromo ? (originalPrice * appliedPromo.discount) / 100 : 0
  const finalPrice = originalPrice - discountAmount

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Booking submitted:", { ...formData, booth: boothData, promoCode: appliedPromo })
    alert("Booking submitted successfully! We will contact you shortly.")
    sessionStorage.removeItem("selectedBooth")
    router.push("/")
  }

  if (!boothData) {
    return (
      <LoadingSpinner/>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/")} className="mb-4">
            ← Back to Selection
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Complete Your Booking</h1>
          <p className="text-gray-400">Fill in your details to reserve your booth</p>
        </div>

        {/* Booth Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Booth Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Booth Number</p>
              <p className="text-2xl font-bold text-gray-900">#{boothData.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{boothData.category} Booth</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Label htmlFor="promoCode" className="text-gray-900 mb-2 block">
              Have a Promo Code?
            </Label>
            <div className="flex gap-2">
              <Input
                id="promoCode"
                type="text"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value)
                  setPromoError("")
                }}
                placeholder="Enter promo code"
                disabled={!!appliedPromo}
                className="flex-1"
              />
              {appliedPromo ? (
                <Button type="button" onClick={handleRemovePromo} variant="outline">
                  Remove
                </Button>
              ) : (
                <Button type="button" onClick={handleApplyPromo} variant="default">
                  Apply
                </Button>
              )}
            </div>
            {promoError && <p className="text-sm text-red-600 mt-1">{promoError}</p>}
            {appliedPromo && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm font-semibold text-green-800">✓ {appliedPromo.description} applied!</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Original Price:</span>
                <span className={appliedPromo ? "line-through" : "font-semibold"}>${originalPrice}</span>
              </div>
              {appliedPromo && (
                <>
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromo.discount}%):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Final Price:</span>
                    <span className="text-green-600">${finalPrice.toFixed(2)}</span>
                  </div>
                </>
              )}
              {!appliedPromo && (
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total Price:</span>
                  <span className="text-green-600">${originalPrice}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Information</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                name="businessName"
                type="text"
                required
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="Your Business Name"
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any special requirements or questions..."
                rows={4}
              />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3">
              Submit Booking Request
            </Button>
            <p className="text-sm text-gray-600 text-center mt-3">
              By submitting, you agree to our terms and conditions
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
