import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ArrowLeft, Calendar, FileText, TrendingUp, MapPin, Activity } from 'lucide-react';
import { BodyDiagram } from './BodyDiagram';
import { Patient, AlgometerReading } from '../types/algometer';
import React from 'react';

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
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Get the latest reading
  const latestReading = sortedReadings[sortedReadings.length - 1];

  // Format latest readings by muscleName
  const latestReadingsByLocation = latestReading?.readings.reduce((acc, r) => {
    acc[r.muscleName] = r;
    return acc;
  }, {} as Record<string, { threshold: number | null; tolerance: number | null }>) || {};

  // Get all unique muscleNames across all readings
  const allLocations = Array.from(
    new Set(readings.flatMap(r => r.readings.map(lr => lr.muscleName)))
  );

  // Prepare data for Pain Threshold Progression chart
  const progressionData = sortedReadings.map(reading => {
    const dataPoint: any = {
      date: new Date(reading.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short'
      }),
      fullDate: reading.createdAt
    };
    
    // Add PPT and PPTol for each muscleName
    reading.readings.forEach(lr => {
      if (lr.threshold !== null) {
        dataPoint[`${lr.muscleName}_PPT`] = lr.threshold;
      }
      if (lr.tolerance !== null) {
        dataPoint[`${lr.muscleName}_PPTol`] = lr.tolerance;
      }
    });
    
    return dataPoint;
  });

  //Debug Line
  console.log("Progression Data: ", progressionData);

  // Prepare data for Current Pain Map (Radar chart) - using latest reading
  const radarData = latestReading?.readings.map(r => ({
    muscleName: r.muscleName,
    PPT: r.threshold || 0,
    PPTol: r.tolerance || 0
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
      value: r.threshold || r.tolerance || 0,
      label: r.muscleName,
      note: `PPT: ${r.threshold !== null ? r.threshold + ' kPa' : 'N/A'} | PPTol: ${r.tolerance !== null ? r.tolerance + ' kPa' : 'N/A'}`
    };
  }) || [];

  // Colors for different muscleNames in the chart
  const muscleNameColors = [
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
              {patient.nextCheckupDate || 'Not scheduled'}
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
                <div key={reading._id} className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <p className="text-gray-700 text-sm mb-2">{reading.muscleName}</p>
                  <div className="space-y-1">
                    <p className="text-blue-900">
                      <span className="text-xs text-gray-600">PPT:</span> {reading.threshold !== null ? `${reading.threshold} kPa` : 'N/A'}
                    </p>
                    <p className="text-blue-900">
                      <span className="text-xs text-gray-600">PPTol:</span> {reading.tolerance !== null ? `${reading.tolerance} kPa` : 'N/A'}
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

            <div className="mb-4 space-y-2">

              {/* Row 1: Heading + PPT/PPTol */}
              <div className="flex items-center justify-between">

                <h3 className="text-gray-900 flex items-center gap-2 font-bold">
                  <TrendingUp className="w-5 h-5" />
                  Pain Threshold Progression (kPa)
                </h3>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-gray-800"></div>
                    <span className="font-semibold">PPT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 border-t-2 border-dashed border-gray-800"></div>
                    <span className="font-semibold">PPTol</span>
                  </div>
                </div>

              </div>

              {/* Row 2: Muscle legend (centered) */}
              <div className="flex flex-wrap justify-end gap-x-6 gap-3">
                {allLocations.map((muscleName) => {
                  const color = muscleNameColors[
                    allLocations.indexOf(muscleName) % muscleNameColors.length
                  ];

                  return (
                    <div key={muscleName} className="flex items-center gap-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm text-gray-700 text-transform: capitalize">{muscleName}</span>
                    </div>
                  );
                })}
              </div>

            </div>

            <div className="w-full overflow-x-auto">
              <div 
                className="min-w-[900px]"
                style={{ width: `${Math.max(progressionData.length * 80, 600)}px` }}
              >
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart 
                    data={progressionData}
                    margin={{ top:20, right: 20, left:10, bottom:40 }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" stroke="#e5e7eb"
                    />
                    <XAxis 
                      label={{ value: 'Time', position: 'insideBottom', offset: -25}}
                      dataKey="date" tick={{ fontSize: 12}}
                    />
                    <YAxis 
                      label={{ value: 'Pressure', angle: -90, position: 'insideLeft' }} 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      labelStyle={{ fontWeight: 'bold' }}
                      formatter={(value, name) => [`${value} kPa`, name]}
                      cursor={{ stroke: '#9ca3af', strokeWidth: 1}}
                    />
                    {/* <Legend 
                      wrapperStyle={{ fontSize: '12px'}}
                    /> */}

                    {allLocations.map((muscleName, idx) => {
                      // const color = muscleNameColors[idx % muscleNameColors.length];
                      const color = muscleNameColors[
                        allLocations.indexOf(muscleName) % muscleNameColors.length
                      ];

                      return (
                        <React.Fragment key={muscleName}>
                          <Line 
                            key={`${muscleName}_PPT`}
                            type="monotone" 
                            dataKey={`${muscleName}_PPT`} 
                            stroke={color} 
                            name={`${muscleName} (T)`}
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                            connectNulls
                          />
                          <Line 
                            key={`${muscleName}_PPTol`}
                            type="monotone" 
                            dataKey={`${muscleName}_PPTol`} 
                            stroke={color} 
                            strokeDasharray="6 2"
                            strokeWidth={3}
                            opacity={0.7}
                            name={`${muscleName} (Tol)`}
                            dot={{ r: 4, strokeWidth: 2 }}
                            connectNulls
                          />
                        </React.Fragment>
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
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
                    <PolarAngleAxis dataKey="muscleName" />
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
              <div key={reading._id} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-900">{formatDate(reading.createdAt)}</p>
                    <p className="text-gray-700 mt-1">
                      {reading.readings.length} muscleName{reading.readings.length !== 1 ? 's' : ''} measured
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
