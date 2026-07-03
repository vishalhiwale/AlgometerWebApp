import { Activity, Calendar, User, FileText, ClipboardPlusIcon, StethoscopeIcon } from 'lucide-react';
import { useEffect, useState } from "react"
import { AlgometerReading } from '../types/algometer';
import api from "../services/api";
interface SavedReadingsProps {
  refreshKey: number;
  onOpenReadingInterface: () => void;
  onEditReading: (reading: AlgometerReading) => void;
}
  
  export function SavedReadings({ 
    refreshKey,
    onOpenReadingInterface,
    onEditReading
  }: SavedReadingsProps) {

  const [savedReadings, setSavedReadings] = useState<AlgometerReading[]>([]);

  const fetchSavedReadings = async () => {

    try {

      const response = await api.get("/readings/saved");
      const data = Array.isArray(response.data) ? response.data : [];
      const formatted = data.map((r: any) => ({
        ...r,
        id: r._id
      }));

      // console.log("Saved Readings: ",formatted);
      setSavedReadings(formatted);

    } catch (error) {

      console.error("Failed to fetch saved readings: ",error);
      setSavedReadings([]);

    }

  };

  useEffect(() => {
      
    fetchSavedReadings();
    
  }, [refreshKey])


  const formatDate = (timestamp?: string) => {
    if (!timestamp) return "Unknown"

    const date = new Date(timestamp);
    
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          {/* <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Readings</h1> */}
          <h2 className="text-2xl font-bold text-gray-700 tracking-tight">Readings</h2>
          {/* <p className="text-gray-600 mt-1">Saved algometer readings (not yet committed to database)</p> */}
        </div>
        <button
          onClick={onOpenReadingInterface}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <ClipboardPlusIcon className="w-4 h-4" />
          Take New Reading
        </button>
      </div>

      {savedReadings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-600 text-xl font-semibold">No saved readings</p>
          <p className="text-gray-500 text-base mt-1">Take new readings to see them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedReadings.map((reading: AlgometerReading) => (
            <div
              key={reading.id}
              onClick={() => onEditReading(reading)}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 transition-all cursor-pointer hover:border-2 hover:border-blue-300 max-w-90"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-900 font-medium text-lg capitalize">{reading.patientName}</p>
                  <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                  </div>
                </div>
                <div className="bg-amber-100 text-yellow-700 font-semibold border border-amber-200 px-2 py-1 rounded text-xs">
                  Saved
                </div>
              </div>

              {/* Patient Info
              {reading.patientName && (
                <div className="mb-4 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <p className="text-gray-700 text-sm mb-1">Patient</p>
                  <p className="text-blue-900">{reading.patientName} ({reading.patientCode})</p>
                  <p className="text-blue-700 text-xs mt-1">{reading.patientId}</p>
                </div>
              )} */}

              {/* Readings Taken */}
              <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-60 shadow-sm">
                <p className="text-gray-700 text-base font-semibold mb-2">Readings</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {reading.readings.map((r, idx) => (
                    <div key={idx} className="text-xs text-gray-700 bg-white px-2 py-1 rounded-md border border-blue-100 shadow-sm">
                      <span className="font-medium text-sm">{r.muscleName} :</span> 
                      <span className="ml-2 font-medium">
                        PPT: {r.threshold !== null ? `${r.threshold} kPa` : 'N/A'}, 
                        PPTol: {r.tolerance !== null ? `${r.tolerance} kPa` : 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-blue-900 font-medium text-sm mt-2">{reading.readings.length} Muscle measured</p>
              </div>

              {/* Doctor Info */}
              <div className="mb-2 flex items-center gap-2 text-gray-600 text-base font-medium">
                <StethoscopeIcon className="w-4 h-4" />
                <span>Taken by: {reading.doctorName}</span>
              </div>

              {/* Doctor Notes Preview */}
              {reading.doctorNotes && (
                <div className="mb-2">
                  <div className="mb-1 flex items-center gap-2 text-gray-600 text-base font-medium">
                    <FileText className="w-4 h-4" />
                    <span> Notes</span>
                  </div>
                  <p className="text-gray-600 text-base line-clamp-2">{reading.doctorNotes}</p>
                </div>
              )}

              {/* Click to Edit Hint */}
              <div className="text-center text-sm text-gray-500 mt-4 pt-3 border-t border-gray-200 hover:underline hover:text-blue-500">
                Click to edit or commit to database
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
