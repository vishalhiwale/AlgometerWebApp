import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ArrowLeft, Calendar, FileText, TrendingUp, MapPin, Activity } from 'lucide-react';
import { BodyDiagram } from './BodyDiagram';

interface PatientDetailProps {
  patientId: string;
  patient: Patient;
  readings: AlgometerReading[]; // Committed readings for this patient
  onBack: () => void;
  hasReadings: boolean;
  onTakeReadings: () => void;
  onEditPatient?: () => void;
  onDeletePatient?: () => void;
}

export function PatientDetail({ 
  patient, 
  readings,
  onBack, 
  hasReadings, 
  onTakeReadings, 
  onEditPatient, 
  onDeletePatient 
}: PatientDetailProps) {
  // Sort readings by timestamp
  const sortedReadings = [...readings].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Get the latest reading
  const latestReading = sortedReadings[sortedReadings.length - 1];

  // Format latest readings by location
  const latestReadingsByLocation = latestReading?.readings.reduce((acc, r) => {
    acc[r.location] = r;
    return acc;
  }, {} as Record<string, { ppt: number | null; pptol: number | null }>) || {};

  // Get all unique locations across all readings
  const allLocations = Array.from(
    new Set(readings.flatMap(r => r.readings.map(lr => lr.location)))
  );

  // Prepare data for Pain Threshold Progression chart
  const progressionData = sortedReadings.map(reading => {
    const dataPoint: any = {
      date: new Date(reading.timestamp).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short'
      }),
      fullDate: reading.timestamp
    };
    
    // Add PPT and PPTol for each location
    reading.readings.forEach(lr => {
      if (lr.ppt !== null) {
        dataPoint[`${lr.location}_PPT`] = lr.ppt;
      }
      if (lr.pptol !== null) {
        dataPoint[`${lr.location}_PPTol`] = lr.pptol;
      }
    });
    
    return dataPoint;
  });

  // Prepare data for Current Pain Map (Radar chart) - using latest reading
  const radarData = latestReading?.readings.map(r => ({
    location: r.location,
    PPT: r.ppt || 0,
    PPTol: r.pptol || 0
  })) || [];

  // Prepare measurement points for body diagram
  const measurementPoints = latestReading?.readings.map((r, idx) => {
    // Distribute points across the face/head area
    const positions = [
      { x: 50, y: 15 },  // Center top
      { x: 35, y: 18 },  // Left upper
      { x: 65, y: 18 },  // Right upper
      { x: 38, y: 28 },  // Left mid
      { x: 62, y: 28 },  // Right mid
      { x: 35, y: 32 },  // Left lower mid
      { x: 65, y: 32 },  // Right lower mid
      { x: 50, y: 38 },  // Center bottom
    ];
    
    const pos = positions[idx % positions.length];
    
    return {
      id: `point-${idx}`,
      x: pos.x,
      y: pos.y,
      value: r.ppt || r.pptol || 0,
      label: r.location,
      note: `PPT: ${r.ppt !== null ? r.ppt + ' kPa' : 'N/A'} | PPTol: ${r.pptol !== null ? r.pptol + ' kPa' : 'N/A'}`
    };
  }) || [];

  // Colors for different locations in the chart
  const locationColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
    '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
  ];

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1">
          <h2 className="text-gray-900">Patient Details</h2>
          <p className="text-gray-600 mt-1">Complete medical record and algometer data</p>
        </div>
        {!hasReadings && (
          <button
            onClick={onTakeReadings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            Take Algometer Readings
          </button>
        )}
        {onEditPatient && (
          <button
            onClick={onEditPatient}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Edit Patient
          </button>
        )}
        {onDeletePatient && (
          <button
            onClick={onDeletePatient}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Delete Patient
          </button>
        )}
      </div>

      {/* Patient Info Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-600 text-sm mb-1">Patient Name</p>
            <p className="text-gray-900">{patient.name}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Patient ID</p>
            <p className="text-gray-900">{patient.id}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Age / Gender</p>
            <p className="text-gray-900">{patient.age} / {patient.gender}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Contact</p>
            <p className="text-gray-900">{patient.contact}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Diagnosis</p>
            <p className="text-gray-900">{patient.diagnosis}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Last Visit</p>
            <p className="text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              {patient.lastVisit}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Next Checkup</p>
            <p className="text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              {patient.nextCheckup || 'Not scheduled'}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Total Visits</p>
            <p className="text-gray-900">{patient.totalVisits}</p>
          </div>
        </div>
      </div>

      {/* Latest Readings */}
      {hasReadings && latestReading && (
        <>
          <div className="flex justify-end">
            <button
              onClick={onTakeReadings}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Take New Algometer Readings
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Latest Algometer Readings (kPa)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {latestReading.readings.map((reading, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <p className="text-gray-700 text-sm mb-2">{reading.location}</p>
                  <div className="space-y-1">
                    <p className="text-blue-900">
                      <span className="text-xs text-gray-600">PPT:</span> {reading.ppt !== null ? `${reading.ppt} kPa` : 'N/A'}
                    </p>
                    <p className="text-blue-900">
                      <span className="text-xs text-gray-600">PPTol:</span> {reading.pptol !== null ? `${reading.pptol} kPa` : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {latestReading.doctorNotes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-700 text-sm mb-1">Doctor's Notes:</p>
                <p className="text-gray-600">{latestReading.doctorNotes}</p>
              </div>
            )}
          </div>
        </>
      )}

      {hasReadings && readings.length > 0 ? (
        <>
          {/* Pain Threshold Progression - Full Width */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Pain Threshold Progression (kPa)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={progressionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis label={{ value: 'kPa', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                {allLocations.flatMap((location, idx) => {
                  const color = locationColors[idx % locationColors.length];
                  return [
                    <Line 
                      key={`${location}_PPT`}
                      type="monotone" 
                      dataKey={`${location}_PPT`} 
                      stroke={color} 
                      name={`${location} (PPT)`}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      connectNulls
                    />,
                    <Line 
                      key={`${location}_PPTol`}
                      type="monotone" 
                      dataKey={`${location}_PPTol`} 
                      stroke={color} 
                      strokeDasharray="5 5"
                      name={`${location} (PPTol)`}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      connectNulls
                    />
                  ];
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Current Pain Map */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <div>
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Current Pain Map (Latest Reading)
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="location" />
                    <PolarRadiusAxis angle={90} />
                    <Radar name="PPT (kPa)" dataKey="PPT" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                    <Radar name="PPTol (kPa)" dataKey="PPTol" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Body Diagram */}
              <div>
                <h3 className="text-gray-900 mb-4">Body Measurement Points</h3>
                <BodyDiagram 
                  gender={patient.gender as 'Male' | 'Female'} 
                  measurementPoints={measurementPoints}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No readings available for this patient</p>
          <p className="text-gray-500 text-sm mt-1">Take algometer readings to see data visualization</p>
        </div>
      )}

      {/* Visit History */}
      {hasReadings && readings.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-900 mb-4">Visit History</h3>
          <div className="space-y-3">
            {sortedReadings.reverse().map((reading, index) => (
              <div key={reading.id} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-900">{formatDate(reading.timestamp)}</p>
                    <p className="text-gray-700 mt-1">
                      {reading.readings.length} location{reading.readings.length !== 1 ? 's' : ''} measured
                    </p>
                    {reading.doctorNotes && (
                      <p className="text-gray-600 mt-1 text-sm italic">"{reading.doctorNotes}"</p>
                    )}
                  </div>
                  <span className="text-gray-600 text-sm">{reading.takenBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
