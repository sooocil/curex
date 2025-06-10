"use client"

import React, { useState, useCallback, useMemo } from "react"
import { Map, Marker, Overlay } from "pigeon-maps"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Users, X } from "lucide-react"

interface Hospital {
  id: string
  name: string
  position: [number, number] // [lat, lng]
  address: string
  phone?: string
  availableDoctors?: number
}

interface Props {
  hospitals: Hospital[]
}

const HospitalMap: React.FC<Props> = React.memo(({ hospitals }) => {
  const [popupInfo, setPopupInfo] = useState<Hospital | null>(null)
  const [center, setCenter] = useState<[number, number]>([40.7128, -74.006])
  const [zoom, setZoom] = useState(12)

  // Memoize hospital markers to prevent re-rendering
  const hospitalMarkers = useMemo(() => {
    return hospitals.map((hospital) => (
      <Marker
        key={hospital.id}
        anchor={hospital.position}
        onClick={() => setPopupInfo(hospital)}
        width={32}
        height={32}
      >
        <div className="relative">
          <div className="w-8 h-8 bg-[#00AD9B] rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          {hospital.availableDoctors && hospital.availableDoctors > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">{hospital.availableDoctors}</span>
            </div>
          )}
        </div>
      </Marker>
    ))
  }, [hospitals])

  // Optimize popup close handler
  const handleClosePopup = useCallback(() => {
    setPopupInfo(null)
  }, [])

  // Optimize bounds change handler
  const handleBoundsChanged = useCallback(({ center, zoom }: { center: [number, number]; zoom: number }) => {
    setCenter(center)
    setZoom(zoom)
  }, [])

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <Map
        height={500}
        center={center}
        zoom={zoom}
        onBoundsChanged={handleBoundsChanged}
        attribution={false}
        metaWheelZoom={true}
        mouseEvents={true}
        touchEvents={true}
      >
        {hospitalMarkers}

        {/* Hospital count overlay */}
        <Overlay anchor={[center[0] + 0.01, center[1] - 0.02]} offset={[0, 0]}>
          <Card className="shadow-lg border-none bg-white/95 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#00AD9B]" />
                <div>
                  <p className="font-semibold text-sm text-gray-800">Nearby Hospitals</p>
                  <p className="text-xs text-gray-600">{hospitals.length} facilities found</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Overlay>

        {/* Hospital popup */}
        {popupInfo && (
          <Overlay anchor={popupInfo.position} offset={[0, -40]}>
            <Card className="shadow-xl border-none bg-white max-w-xs">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-[#00AD9B] text-sm">{popupInfo.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClosePopup}
                    className="h-6 w-6 p-0 hover:bg-gray-100"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{popupInfo.address}</span>
                  </div>

                  {popupInfo.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3 h-3 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600">{popupInfo.phone}</span>
                    </div>
                  )}

                  {popupInfo.availableDoctors && (
                    <div className="flex items-center space-x-2">
                      <Users className="w-3 h-3 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600">{popupInfo.availableDoctors} doctors available</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 mt-3">
                  <Button size="sm" className="bg-[#00AD9B] hover:bg-[#009688] text-white text-xs px-3 py-1">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs px-3 py-1">
                    Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Overlay>
        )}
      </Map>
    </div>
  )
})

HospitalMap.displayName = "HospitalMap"

export default HospitalMap
