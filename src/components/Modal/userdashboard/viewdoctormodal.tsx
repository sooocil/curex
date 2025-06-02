import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ViewDoctorModalProps {
  doctor: any;
  onClose: () => void;
}



function ViewDoctorModal({ doctor, onClose }: ViewDoctorModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-xl rounded-2xl bg-white shadow-xl border border-gray-100 p-6 sm:p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={doctor.image || '/doctorAssets/profileplaceholder.jpg'}
            className=" w-20 h-20 rounded-full  border border-gray-200 shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{doctor.name}</h2>
            <p className="text-sm text-gray-500">{doctor.specialty} at {doctor.hospital}</p>
            <p className="text-sm text-gray-500">{doctor.location}</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4 text-gray-700 text-sm">
          <div>
            <h3 className="font-semibold text-curex">About</h3>
            <p>{doctor.bio || "Dr. " + doctor.name + " is a highly experienced specialist committed to patient well-being."}</p>
          </div>

          <div>
            <h3 className="font-semibold text-curex">Education & Experience</h3>
            <ul className="list-disc ml-5 space-y-1">
              {doctor.education?.map((edu: string, i: number) => <li key={i}>{edu}</li>) || (
                <li>MBBS, MD from recognized institutions</li>
              )}
              <li>{doctor.experience || 'Over 10 years of clinical practice'}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-curex">Languages Spoken</h3>
            <p>{doctor.languages?.join(', ') || 'English, Hindi, Nepali'}</p>
          </div>

          <div>
            <h3 className="font-semibold text-curex">Consultation</h3>
            <p>
              <span className="font-medium">Availability:</span> {doctor.availability || 'Mon–Fri, 9 AM – 5 PM'}
            </p>
            <p>
              <span className="font-medium">Consultation Type:</span> {doctor.consultationType || 'Online & Offline'}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-curex">Ratings</h3>
            <p>
              ⭐ {doctor.rating || 4.8} / 5.0 <span className="text-gray-500">({doctor.reviews || 25} reviews)</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-curex text-white hover:bg-curex-dark transition"
            onClick={() => alert('Login flow for appointment booking to be added')}
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewDoctorModal;
