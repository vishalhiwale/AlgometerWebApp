import { Activity, Calendar, User, FileText } from 'lucide-react';
import { useEffect, useState } from "react"
import { AlgometerReading } from '../types/algometer';

interface SavedReadingsProps {
  onOpenReadingInterface: () => void;
  onEditReading: (reading: AlgometerReading) => void;
}
  
  export function SavedReadings({ 
    onOpenReadingInterface,
    onEditReading
  }: SavedReadingsProps) {

  const [savedReadings, setSavedReadings] = useState<AlgometerReading[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/readings/saved")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((r: any) => ({
          ...r,
          id: r._id
        }))

        console.log("Saved readings:", formatted)

        setSavedReadings(formatted)
      })
      .catch(err => console.error(err))
  }, [])


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
          <Activity className="w-4 h-4" />
          Take New Reading
        </button>
      </div>

      {savedReadings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No saved readings</p>
          <p className="text-gray-500 text-sm mt-1">Take new readings to see them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedReadings.map((reading: AlgometerReading) => (
            <div
              key={reading.id}
              onClick={() => onEditReading(reading)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-900">Reading #{reading.id}</p>
                  <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(reading.timestamp)}
                  </div>
                </div>
                <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                  Saved
                </div>
              </div>

              {/* Patient Info */}
              {reading.patientName && (
                <div className="mb-4 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <p className="text-gray-700 text-sm mb-1">Patient</p>
                  <p className="text-blue-900">{reading.patientName} ({reading.patientCode})</p>
                  <p className="text-blue-700 text-xs mt-1">{reading.patientId}</p>
                </div>
              )}

              {/* Readings Taken */}
              <div className="mb-4 bg-blue-50 p-3 rounded-lg">
                <p className="text-gray-700 text-sm mb-2">Readings Taken</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {reading.readings.map((r, idx) => (
                    <div key={idx} className="text-xs text-gray-700 bg-white px-2 py-1 rounded border border-blue-100">
                      <span className="font-medium">{r.muscleName}:</span> 
                      <span className="ml-1">
                        PPT: {r.threshold !== null ? `${r.threshold} kPa` : 'N/A'}, 
                        PPTol: {r.tolerance !== null ? `${r.tolerance} kPa` : 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-blue-900 text-sm mt-2">{reading.readings.length} locations measured</p>
              </div>

              {/* Doctor Info */}
              <div className="mb-4 flex items-center gap-2 text-gray-600 text-sm">
                <User className="w-4 h-4" />
                <span>Taken by: {reading.doctorName}</span>
              </div>

              {/* Doctor Notes Preview */}
              {reading.doctorNotes && (
                <div className="mb-4">
                  <div className="flex items-center gap-1 text-gray-700 text-sm mb-1">
                    <FileText className="w-3 h-3" />
                    Notes
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{reading.doctorNotes}</p>
                </div>
              )}

              {/* Click to Edit Hint */}
              <div className="text-center text-xs text-gray-500 mt-4 pt-3 border-t border-gray-200">
                Click to edit or commit to database
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
