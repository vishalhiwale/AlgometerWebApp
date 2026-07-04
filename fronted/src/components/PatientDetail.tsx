import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ArrowLeft, Calendar, FileText, TrendingUp, MapPin, Activity, PenBoxIcon, DeleteIcon, DrumstickIcon, TrashIcon, Edit, ClipboardPlusIcon, FileTextIcon, FileLineChartIcon, LucideTrash2 } from 'lucide-react';
import { BodyDiagram } from './BodyDiagram';
import { Patient, AlgometerReading } from '../types/algometer';
import React from 'react';
import api from '../services/api';
import { toast } from 'sonner';

interface PatientDetailProps {
  patientId: string;
  patient: Patient;
  readings: AlgometerReading[]; // Committed readings for this patient
  onBack: () => void;
  hasReadings: boolean;
  onTakeReadings: () => void;
  onEditPatient?: () => void;
  onDeletePatient?: () => void;
  onDeleteReading?: (reading: AlgometerReading) => void;
}

export function PatientDetail({ 
  patient, 
  readings,
  onBack, 
  hasReadings, 
  onTakeReadings, 
  onEditPatient, 
  onDeletePatient,
  onDeleteReading,
}: PatientDetailProps) {
  // console.log("patient: ", patient);
  const [visibleMuscles, setVisibleMuscles] = React.useState<string[]>([]);
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

  React.useEffect(() => {
    if (visibleMuscles.length === 0 && allLocations.length > 0){
      setVisibleMuscles(allLocations);
    }
  }, [allLocations]);

  const toggleMuscle = (muscle: string) => {
    setVisibleMuscles(prev =>{
      if(prev.includes(muscle)){
        if (prev.length === 1) return prev;
        return prev.filter(m => m !== muscle)
      }
      return [...prev, muscle];
    });
  };

  const showAllMuscles = () => {
    setVisibleMuscles(allLocations);
  }

  const hideAllMuscles = () => {
    if (allLocations.length > 0) {
      setVisibleMuscles([allLocations[0]]);
    }
  }

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

  // Prepare data for Current Pain Map (Radar chart) - using latest reading
  const radarData = latestReading?.readings.slice(0, 6).map(r => ({
    muscleName: r.muscleName,
    PPT: r.threshold ?? undefined,
    PPTol: r.tolerance ?? undefined
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

  const formatDate = (timestamp: string | undefined) => {
    if (!timestamp) return null;

    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // const handleDeleteReading = async (reading: any) => {
  //   try {
  //     console.log(reading);
  //       if (confirm('Do you really want to permanantly delete committed readings and Note? This action cannot be undone.')) {

  //           await api.delete(`/readings/${reading._id}`)
  //           toast.success("Reading deleted successfully");
  //           // await resetReadingSession();

  //       }
  //   } catch (error) {

  //     console.error(error);
  //     toast.error("Failed to delete reading");

  //   }
  // };

  // console.log("Readings: ",readings);

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
          <h2 className="text-2xl font-bold text-gray-700 tracking-tight">Patient Details</h2>
          {/* <p className="text-gray-600 mt-1">Complete medical record and algometer data</p> */}
        </div>
        {!hasReadings && (
          <button
            onClick={onTakeReadings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <ClipboardPlusIcon className="w-4 h-4" />
            Take Algometer Readings
          </button>
        )}
        {onEditPatient && (
          <button
            onClick={onEditPatient}
            className="px-4 py-2 bg-amber-400 text-white font-semibold rounded-lg hover:bg-amber-500 transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Patient
          </button>
        )}
        {onDeletePatient && (
          <button
            onClick={onDeletePatient}
            className="px-4 py-2 bg-red-400 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors flex items-center gap-2"
          >
            <TrashIcon className="w-4 h-4" />
            Delete Patient
          </button>
        )}
      </div>

      {/* Patient Info Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-900 font-medium">Patient ID</p>
            <p className="text-gray-900 text-md">{patient.id}</p>
          </div>
          <div>
            <p className="text-gray-900 font-medium">Patient Name</p>
            <p className="text-gray-900 text-md">{patient.name}</p>
          </div>
          <div>
            <p className="text-gray-900 font-medium">Age / Gender</p>
            <p className="text-gray-900 text-md">{patient.age} / {patient.gender}</p>
          </div>
          <div>
            <p className="text-gray-900 font-medium">Contact</p>
            <p className="text-gray-900 text-md">{patient.contact}</p>
          </div>
          <div>
            <p className="text-gray-900 font-medium">Diagnosis</p>
            <p className="text-gray-900 text-md">{patient.diagnosis}</p>
          </div>
          <div>
            <p className="text-gray-900 font-medium">Last Visit</p>
            <p className="text-gray-900 text-md flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              {latestReading ? formatDate(latestReading.createdAt) : (patient.lastVisitDate? formatDate(patient.lastVisitDate) : "Not Visit yet")}
            </p>
          </div>
          <div>
            <p className="text-gray-900 font-medium">Next Checkup</p>
            <p className="text-gray-900 text-md flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              {formatDate(patient.nextCheckupDate) || 'Not Scheduled'}
            </p>
          </div>
          <div>
            <p className="text-gray-900 font-medium">Total Visits</p>
            <p className="text-gray-900 text-md">{readings.length}</p>
          </div>
        </div>
      </div>

      {/* Latest Readings */}
      {hasReadings && latestReading && (
        <>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-900 flex items-center gap-2 font-bold">
                <FileLineChartIcon className="w-5 h-5" />
                Latest Algometer Readings (kPa)
              </h3>

              <div className="flex justify-end">
                <button
                  onClick={onTakeReadings}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <ClipboardPlusIcon className="w-4 h-4" />
                  Take New Readings
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {latestReading.readings.map((reading, idx) => (
                <div key={reading._id} className="shadow-sm rounded-lg p-4 bg-gray-50 border-gray-300">
                  <p className="text-gray-900 text-md font-medium mb-2">{reading.muscleName}</p>
                  <div className="space-y-1">
                    <p className="text-grey-900">
                      <span className="text-md text-gray-600">Threshold:</span> {reading.threshold !== null ? `${reading.threshold} kPa` : 'N/A'}
                    </p>
                    <p className="text-grey-900">
                      <span className="text-md text-gray-600">Tolerance:</span> {reading.tolerance !== null ? `${reading.tolerance} kPa` : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {latestReading.doctorNotes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-900 text-md font-medium mb-2">Doctor's Notes:</p>
                <p className="text-gray-600">{latestReading.doctorNotes}</p>
              </div>
            )}
          </div>

          {/* Total Readings List */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className='text-gray-900 text-md flex items-center gap-2 font-bold mb-4'>
              <FileTextIcon className='w-5 h-5'/>
              Reading List
            </h3>
            <div className='w-full h-80 overflow-y-auto shadow-sm border-2 border-gray-100 rounded-lg'>
              {sortedReadings.map((reading)=>(

                <div
                  key={reading._id} 
                  className='rounded-lg mb-2 p-4 bg-gray-100 border-gray-200'>

                  <div className="mb-2 flex justify-between items-center">
                    <p className="font-medium ml-3">

                      {formatDate(reading.createdAt)}

                    </p>

                    <div className='flex items-center gap-4 mr-3'>

                      <p className="text-sm text-gray-500">
                          {reading.readings.length} muscles
                      </p>

                      { onDeleteReading && (
                        <button
                          // className="px-3 py-1 border-2 border-red-500 bg-red-400 text-white text-xs font-semibold flex items-center gap-1 rounded-lg hover:bg-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            // handleDeleteReading(reading);
                            onDeleteReading(reading);
                          }}
                        >
                          <LucideTrash2 color='rgba(227, 53, 53, 0.97)' className='w-5 h-5'/>
                        </button>
                      )}

                    </div>
                  </div>

                  <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                    {reading.readings.map((r, idx) => (
                      <div key={r._id} className="rounded-lg p-2 h-25 bg-white border-gray-300">
                        <p className="text-gray-900 text-md font-medium mb-1 ml-2">{r.muscleName}</p>
                        
                        <div className="space-y-0 ml-2 text-sm">
                          <p className="text-grey-900">
                            <span className="text-gray-600">Threshold:</span> {r.threshold !== null ? `${r.threshold} kPa` : 'N/A'}
                          </p>
                          <p className="text-grey-900">
                            <span className="text-gray-600">Tolerance:</span> {r.tolerance !== null ? `${r.tolerance} kPa` : 'N/A'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {reading.doctorNotes && (
                    <div className='mt-3 rounded-lg bg-white p-3'>
                      <p className='text-gray-900 text-base font-semibold mb-1 ml-2'>Doctor Notes</p>
                      <p className='ml-2'>{reading.doctorNotes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      { hasReadings && readings.length > 0 ? (
        <>
          {/* Pain Threshold Progression - Full Width */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

            <div className="mb-4 space-y-2">

              {/* Row 1: Heading + PPT/PPTol */}
              <div className="flex items-center justify-between">

                <h3 className="text-gray-900 text-md flex items-center gap-2 font-bold">
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

              <div className='flex items-center justify-between'>
                <div className="flex items-center justify-start gap-2 ">
                  <button
                    onClick={showAllMuscles}
                    className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition"
                  >
                    Show All
                  </button>
                  <button
                    onClick={hideAllMuscles}
                    className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition"
                  >
                    Hide All
                  </button>
                </div>

                {/* Row 2: Muscle legend (right-side) */} 
                <div className="flex flex-wrap justify-end gap-x-6 gap-3 cursor-pointer">
                  {allLocations.map((muscleName) => {
                    const color = muscleNameColors[
                      allLocations.indexOf(muscleName) % muscleNameColors.length
                    ];

                    const isActive = visibleMuscles.includes(muscleName);

                    return (
                      <button
                        key={muscleName}
                        onClick={() => toggleMuscle(muscleName)}
                        className={`flex items-center gap-1 px-2 py-1 rounded transition
                          ${isActive ? "opacity-100" : "opacity-40"}
                        `}
                      >
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {muscleName}
                        </span>
                      </button>
                    );
                  })}
                </div>
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
                    margin={{ top:20, right: 20, left:30, bottom:40 }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" stroke="#e5e7eb"
                    />
                    <XAxis 
                      label={{ value: 'Time', position: 'insideBottom', offset: -25, fontSize: 16}}
                      dataKey="date" 
                      tick={{ fontSize: 12}}
                      padding={{ left: 30, right: 0}} 
                    />
                    <YAxis 
                      label={{ value: 'Pressure', angle: -90, position: 'insideLeft', fontSize: 16, offset: -5 }} 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      // contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      contentStyle={{ 
                        fontSize: '14px',
                        textAlign: 'left',
                        textSizeAdjust : '10px sans-serif',
                        backgroundColor: '#fff', 
                        borderRadius: '8px', 
                        border: '1px solid #ccc',
                        fontFamily: 'sans-serif' 
                      }}                      
                      itemStyle={{ fontWeight: 400 }}
                      labelStyle={{ fontWeight: 600 }}
                      formatter={(value, name) => [`${value} kPa`, name]}
                      cursor={{ stroke: '#9ca3af', strokeWidth: 1 }}
                    />
                    {/* <Legend 
                      wrapperStyle={{ fontSize: '12px'}}
                    /> */}

                    {/* {allLocations.map((muscleName, idx) => { */}
                    {allLocations
                      .filter(muscleName => visibleMuscles.includes(muscleName))
                      .map((muscleName, idx) => {
                      // const color = muscleNameColors[idx % muscleNameColors.length];
                      const color = muscleNameColors[
                        allLocations.indexOf(muscleName) % muscleNameColors.length
                      ];

                      return (
                        <React.Fragment key={muscleName}>
                          <Line 
                            key={`${muscleName}_PPTol`}
                            type="monotone" 
                            dataKey={`${muscleName}_PPTol`} 
                            stroke={color} 
                            strokeDasharray="6 2"
                            strokeWidth={2}
                            opacity={0.7}
                            name={`${muscleName} (Tol)`}
                            dot={{ r: 3, strokeWidth: 2, fill: '#fff' }}
                            activeDot={{ r : 5, stroke: color, strokeDasharray:"6 3", strokeWidth: 2, fill: '#fff'}}
                            connectNulls
                          />                          
                          <Line 
                            key={`${muscleName}_PPT`}
                            type="monotone" 
                            dataKey={`${muscleName}_PPT`} 
                            stroke={color} 
                            name={`${muscleName} (T)`}
                            strokeWidth={2}
                            dot={{ r: 3, stroke: color, strokeWidth: 1, fill: true ? color:'#fff' }}
                            activeDot={{ r: 4, stroke: color, strokeWidth: 2 }}
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
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}     
            <h3 className="text-gray-900 text-md font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Current Pain Map (Latest Reading)
            </h3>

              {/* Radar Chart */}
              <div className="w-full overflow-x-auto mt-5 flex justify-start">
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart 
                    data={radarData}
                    outerRadius={"90%"}
                  >
                    <PolarGrid 
                      stroke='#d1d3d8'
                    />
                    <PolarAngleAxis 
                      dataKey="muscleName"
                      tick={{ fontSize: 16, fill: "#4b5563" }}
                    />
                    <PolarRadiusAxis 
                      angle={90}
                      domain={[0, 'auto']} 
                      axisLine={{ stroke: '#9ca3af'}}
                      tick={{ fontSize: 12, fill: "#4b5563", dy: 10, dx: 10}}
                    />
                    <Radar 
                      name="Threshold (kPa)" dataKey="PPT"
                      stroke="#2563eb" fill="#2563eb"
                      fillOpacity={0.4}
                    />
                    <Radar 
                      name="Tolerance (kPa)" dataKey="PPTol"
                      stroke="#059669" fill="#059669"
                      fillOpacity={0.25} 
                    />
                    <Tooltip 
                      formatter={(value, name) => [`${value} kPa`, name]}
                      contentStyle={{ 
                        fontSize: '14px',
                        textAlign: 'left',
                        textSizeAdjust : '10px sans-serif',
                        backgroundColor: '#fff', 
                        borderRadius: '8px', 
                        border: '1px solid #ccc',
                        fontFamily: 'sans-serif' 
                      }}  
                      itemStyle={{ fontWeight: 400 }}
                      labelStyle={{ fontWeight: 600 }}   
                      cursor={{ stroke: '#9ca3af', strokeWidth: 1 }}                                         
                    />
                    {/* <Legend /> */}
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Body Diagram */}
              {/* <div>
                <h3 className="text-gray-900 mb-4">Body Measurement Points</h3>
                <BodyDiagram 
                  gender={patient.gender as 'Male' | 'Female'} 
                  measurementPoints={measurementPoints}
                />
              </div> */}
            
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
          <h3 className="text-gray-900 text-md font-bold mb-4">Visit History</h3>
          <div className="space-y-3">
            {sortedReadings.reverse().map((reading, index) => (
              <div key={reading._id} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-md shadow-sm bg-grey">
                <div className="flex justify-between items-start">
                  <div className="flex-1">

                    {/* Print Date */}
                    <p className="flex text-gray-900 font-medium text-sm">{formatDate(reading.createdAt)}</p>

                    {/* Print Muslce or Muscles */}
                    <div className='flex justify-start gap-2'>
                      {reading.readings.length} muscle{reading.readings.length !== 1 ? 's' : ''} measured

                      {/* print muscle names in bracket */}
                      <div className="flex justify-between">
                        ( {reading.readings.map((reading, idx) => (
                        <p className='flex' key={idx} >
                          {reading.muscleName}
                          {idx < readings.length - 1 && ", "}
                        </p>
                        ))} )
                      </div>
                    </div>

                    {/* print doctor's note */}
                    {reading.doctorNotes && (
                      <p className="text-gray-600 mt-1 ">{reading.doctorNotes?? "{No Doctor Note}"}</p>
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
