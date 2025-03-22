"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { motion } from "framer-motion"
import { ExternalLink, Users, MapPin, Phone } from "lucide-react"
import "leaflet/dist/leaflet.css"



// Fix Leaflet icon issues
const fixLeafletIcon = () => {
  // Only run on the client side
  if (typeof window !== "undefined" && window.L) {
    delete (window.L.Icon.Default.prototype as any)._getIconUrl

    window.L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
  }
}

interface Doctor {
  name: string
  specialty: string
}

interface Hospital {
  id: string
  name: string
  position: [number, number]
  address: string
  phone: string
  availableDoctors: number
  doctors: Doctor[]
}

interface MapComponentProps {
  hospitals: Hospital[]
  activeHospital: string | null
  setActiveHospital: (id: string | null) => void
  handleHospitalClick: (id: string) => void
}

export default function MapComponent({
  hospitals,
  activeHospital,
  setActiveHospital,
  handleHospitalClick,
}: MapComponentProps) {
  useEffect(() => {
    // Import Leaflet dynamically on the client
    import("leaflet").then((L) => {
      // Make L available globally for Leaflet
      if (!window.L) {
        window.L = L
      }
      fixLeafletIcon()
    })
  }, [])

  return (
    <>
      <MapContainer center={[27.670684, 84.438595]} zoom={14} style={{ height: "100%", width: "100%" }}>
      <TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
/>



        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            position={hospital.position}
            eventHandlers={{
              mouseover: () => setActiveHospital(hospital.id),
              mouseout: () => setActiveHospital(null),
              click: () => setActiveHospital(hospital.id),
            }}
          >
            <Popup>
              <div
                className={`w-10 h-5 transition-all duration-300 ease-in-out overflow-hidden ${
                  activeHospital === hospital.id ? "w-64 h-auto" : ""
                }`}
              >
                <div className="p-2 cursor-pointer" onClick={() => handleHospitalClick(hospital.id)}>
                  <h3 className="font-bold text-[#00AD9B] hover:underline flex items-center">
                    {hospital.name}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </h3>

                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Users className="w-3 h-3 mr-1" />
                    <span>{hospital.availableDoctors} doctors available</span>
                  </div>

                  {activeHospital === hospital.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2"
                    >
                      <div className="flex items-center text-xs text-gray-600 mb-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{hospital.address}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600 mb-2">
                        <Phone className="w-3 h-3 mr-1" />
                        <span>{hospital.phone}</span>
                      </div>

                      <div className="text-xs font-medium mb-1">Available Doctors:</div>
                      <div className="max-h-24 overflow-y-auto pr-1">
                        {hospital.doctors.map((doctor, index) => (
                          <div key={index} className="mb-1 pb-1 border-b border-gray-100 last:border-0">
                            <div className="font-medium">{doctor.name}</div>
                            <div className="text-gray-500">{doctor.specialty}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  )
}

// Add global type for Leaflet
declare global {
  interface Window {
    L: any
  }
}

