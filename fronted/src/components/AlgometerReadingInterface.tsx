import { useEffect, useState } from 'react';
import { X, Plus, Save, Check, XCircle, User, Divide, XIcon, LucideTrash2, SaveIcon, Database, UserCircle2Icon } from 'lucide-react';
import ReadingTable from './ReadingTable';
import { Patient, AlgometerReading } from '../types/algometer';
import { remove, ref } from 'firebase/database';
import { db } from '../firebase'
import api from '../services/api';
import { SavedReadings } from '../components/SavedReadings';
import { toast } from 'sonner';
interface AlgometerReadingInterfaceProps {
  onClose: () => Promise<void>;
  onSave: ( reading: Omit<AlgometerReading, 'id' | 'timestamp'>, id?: string ) => void;
  onCommit: ( reading: Omit<AlgometerReading, 'id' | 'timestamp'>, id?: string ) => void;
  onRefreshSavedReadings: () => void;
  onFetchReading: (patientId: string) => void;
  onDeleteReading: (reading: AlgometerReading) => void;
  doctorName: string;
  existingReading?: AlgometerReading | null;
  availablePatients: Patient[];
  allPatients: Patient[];
  preSelectedPatientId?: string | null; // New prop for pre-selecting a patient
}

// Body parts with their normal ranges
const BODY_PARTS = [
  { name: 'Neck (Upper Trapezius)', pptRange: '220-300 kPa', pptolRange: '450-600 kPa' },
  { name: 'Jaw (Masseter)', pptRange: '140-220 kPa', pptolRange: '350-450 kPa' },
  { name: 'Forearm (Extensor Carpi Radialis)', pptRange: '350-480 kPa', pptolRange: '650-800 kPa' },
  { name: 'Lower Back (Erector Spinae)', pptRange: '360-390 kPa', pptolRange: '600-750 kPa' },
  { name: 'Thigh (Quadriceps/Vastus Medialis)', pptRange: '310-410 kPa', pptolRange: '700-900 kPa' },
  { name: 'Lower Leg (Tibialis Anterior)', pptRange: '365-500 kPa', pptolRange: '850-1,100 kPa' },
  { name: 'Ankle (Tibialis Posterior/Anterior)', pptRange: '460-480 kPa', pptolRange: '800-950 kPa' },
];

export function AlgometerReadingInterface({ 
  onClose, 
  onSave,
  onCommit,
  onRefreshSavedReadings,
  onFetchReading,
  onDeleteReading,
  doctorName,
  existingReading,
  availablePatients,
  allPatients,
  preSelectedPatientId
}: AlgometerReadingInterfaceProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    existingReading?.patientId || preSelectedPatientId || ''
  );

    // To turn on and off listener we use session active state
  const [sessionActive, setSessionActive] = useState(false);

  const [doctorNotes, setDoctorNotes] = useState(existingReading?.doctorNotes || '');

  type FirebaseReading = {
  muscle: string;
  pointPressureThreshold: number;
  pointPressureTolerance: number;
  };

  const [sessionReadings, setSessionReadings] = useState<FirebaseReading[]>([]);
  // useEffect(() => {
  //   if (existingReading){
  //     setSessionReadings(
  //       existingReading.readings.map((r) => ({
  //         muscle: r.muscleName,
  //         pointPressureThreshold: r.threshold,
  //         pointPressureTolerance: r.tolerance
  //       }))
  //     )
  //   }
  // }, [existingReading]);

    //
  const resetReadingSession = async () => {
    setSessionReadings([]);
    setSessionActive(false);
    setDoctorNotes("");

    await remove(
      ref(db, "AlgometerReadings/Demo_Algometer_001/Readings")
    );
  };

  useEffect(() => {

    // Existing readings are available then convert them and set session active
    if (existingReading){
      const convertedReadings = existingReading.readings.map((r) => ({
        muscle: r.muscleName,
        pointPressureThreshold: r.threshold,
        pointPressureTolerance: r.tolerance
      }));
      
      setSessionReadings(convertedReadings);
      setSessionActive(true);
    }

    // If Patient is already selected then set session Active
    if(preSelectedPatientId){
      setSessionActive(true)
    }
  

  }, [existingReading]);

  const selectedPatient = allPatients.find(p => p.id === selectedPatientId);
  
  const formatDate = (date: string | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-GB");
  };
  
  // const handleDeletePatient = async (patientId: string) => {
  //   if (!confirm('Are you sure you want to delete this patient? This action cannot be undone.')) return;

  //   try {

  //     await api.delete(`/patients/${patientId}`);

  //     setPatients(prev => prev.filter(p => p.id !== patientId));

  //     toast.success("Patient deleted successfully");

  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to delete patient");
  //   }
  // };

  const handleDiscard = async () => {
    try {
      // console.log("handle Discard in AlgometerReadingInterface");  
      if (existingReading) {
      // console.log(existingReading.id);
        if (confirm('Are you sure you want to discard it?')) {

            // await api.delete(`/readings/${existingReading.id}`)
            // toast.success("Reading deleted successfully");
            // await resetReadingSession();
            // console.log("Called App.tsx onDeleteReading");
            onDeleteReading(existingReading);

        }
        // Fetch Saved Reading after deleting of Saved Reading
        // onRefreshSavedReadings();
        // return;
      }
      if( existingReading?.readings.length ){
        console.log(existingReading.readings);
        if(confirm('Are you want to discard all readings?')){
          await resetReadingSession();
        }
      }

    } catch (error) {

      console.error(error);
      toast.error("Failed to delete reading");

    } finally {
      await resetReadingSession();
      onRefreshSavedReadings();
      onClose();
    }
  };

  const handleSave = async () => {
    if (!selectedPatientId) {
      alert('Please select a patient');
      return;
    }

    // if (sessionReadings.length === 0) {
    //   alert('No readings received from device yet');
    // }

    // onSave({
    //   patientId: selectedPatient!.id,
    //   patientCode: selectedPatient!.patientCode,
    //   patientName: selectedPatient!.name,

    //   doctorName: doctorName,
    //   doctorNotes: doctorNotes,

    //   readings: sessionReadings.map(r => ({
    //     muscleName: r.muscle,
    //     threshold: r.pointPressureThreshold,
    //     tolerance: r.pointPressureTolerance
    //   })),

    //   status: "saved"
    // });

    const payload: Omit<AlgometerReading, "id" | "timestamp"> = {
      patientId: selectedPatient!.id,
      patientCode: selectedPatient!.patientCode,
      patientName: selectedPatient!.name,
      
      doctorName: doctorName,
      doctorNotes: doctorNotes ? doctorNotes : "",

      readings: sessionReadings?.map(r => ({
        muscleName: r.muscle,
        threshold: r.pointPressureThreshold,
        tolerance: r.pointPressureTolerance
      })),

      status: "saved"
    };

    if (existingReading) {
      onSave(payload, existingReading?.id);
    } else {
      onSave(payload);
    }

    await resetReadingSession();
    onRefreshSavedReadings();
    onClose();
  };

  
  const handleCommitToDB = async () => {

    if (!selectedPatientId) {
      alert('Please select a patient');
      return;
    }

    if(!selectedPatient) {
      alert("Patient not found");
      return;
    }

    if (sessionReadings.length === 0) {
      alert('No readings received from device yet');
      return;
    }

    // onCommit({  
    //   patientId: selectedPatient.id,
    //   patientCode: selectedPatient.patientCode,
    //   patientName: selectedPatient.name,
      
    //   doctorName: doctorName,
    //   doctorNotes: doctorNotes,

    //   readings: sessionReadings.map(r => ({
    //     muscleName: r.muscle,
    //     threshold: r.pointPressureThreshold,
    //     tolerance: r.pointPressureTolerance
    //    })),

    //   status: "committed"
    //   // sessionTime: new Date().toISOString()
    // });

    const payload: Omit<AlgometerReading, "id" | "timestamp"> = {
      patientId: selectedPatient!.id,
      patientCode: selectedPatient!.patientCode,
      patientName: selectedPatient!.name,

      doctorName: doctorName,
      doctorNotes: doctorNotes,

      readings: sessionReadings.map(r => ({
        muscleName: r.muscle,
        threshold: r.pointPressureThreshold,
        tolerance: r.pointPressureTolerance
      })),

      status: "committed"
    };

    if (existingReading) {
      onCommit(payload, existingReading?.id );
    } else {
      onCommit(payload);
    }

    await resetReadingSession();
    onRefreshSavedReadings();
    onClose();
    onFetchReading(selectedPatient.id);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 ">

      <div className="bg-gray-100 rounded-xl shadow-xl max-w-3xl w-full my-8 flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-700 tracking-tight">Algometer Reading Interface</h2>
            {/* <p className="text-gray-600 text-sm mt-1">Record pain pressure threshold measurements</p> */}
          </div>
          <button
            onClick={() => {onClose(); resetReadingSession();}}
            className="p-3 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          
          {/* Patient Selection & Photo*/}
          <div className="mb-4 flex items-start justify-between gap-6">

            {/* Patient Selection */}
            <div className="flex-1 mr-6">
              <label className="block text-base font-semibold text-gray-900 mb-2 ">
                Select Patient <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => {
                    setSelectedPatientId(e.target.value)

                    if (e.target.value) {
                      setSessionActive(true)
                    }
                  }
                }
                className="w-full px-4 py-2 text-md font-normal 
                          border border-gray-300 rounded-lg 
                          shadow-sm p-3 bg-gray-50 
                          focus:outline-none focus:ring-1 focus:ring-blue-400
                          capitalize
                          "
                disabled={!!existingReading?.patientId}
              >
                <option value="">Select Patient</option>
                
                {(existingReading?.patientId ? allPatients : availablePatients).map(patient => (
                  <option key={patient.id} value={patient.id} className='focus: font-semibold'>
                    {patient.name} 
                    {/* ({patient.patientCode}) To show Patient code along name */}
                  </option>
                ))}
              </select>
            </div>

            {/* Patient Photo */}
            {selectedPatient && (
              <div className="flex-shrink-0 mr-10">
                {selectedPatient.photo ? (
                  <img 
                    src={selectedPatient.photo} 
                    alt={selectedPatient.name}
                    className="w-24 h-24 rounded-full object-cover 
                              border-2 border-white shadow-md rounded-lg p-3 bg-gray-50"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-200 border-2 border-white shadow-lg flex items-center justify-center">
                    <UserCircle2Icon strokeWidth={0.8} color='rgba(0, 81, 255, 0.83)' className="w-24 h-24 text-blue-600" />
                  </div>
                )}
              </div>            
            )}

          </div>

          {/* Patient Details */}
          {selectedPatient && (
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2 ">
                Patient Details
              </label>

              <div className="mb-6 border border-gray-300 rounded-lg p-6 bg-gray-50 shadow-sm">    
                <div className="flex items-start gap-6">
                  {/* Patient Info */}
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1 shadow-sm rounded-lg p-3 bg-gray-50">
                      <p className="text-gray-900 font-medium">Patient ID</p>
                      <p className="text-gray-900 text-md">{selectedPatient.patientCode}</p> {/*old : patientId*/}
                    </div>
                    <div className="md:col-span-1 shadow-sm rounded-lg p-3 bg-gray-50">
                      <p className="text-gray-900 font-medium">Patient Name</p>
                      <p className="text-gray-900 text-md">{selectedPatient.name}</p>
                    </div>
                    <div className="md:col-span-1 shadow-sm rounded-lg p-3 bg-gray-50">
                      <p className="text-gray-900 font-medium">Age / Gender</p>
                      <p className="text-gray-900 text-md">{selectedPatient.age} / {selectedPatient.gender}</p>
                    </div>
                    <div className="md:col-span-1 shadow-sm rounded-lg p-3 bg-gray-50">
                      <p className="text-gray-900 font-medium">Contact</p>
                      <p className="text-gray-900 text-md">{selectedPatient.contact}</p>
                    </div>
                    <div className="md:col-span-1 shadow-sm rounded-lg p-3 bg-gray-50">
                      <p className="text-gray-900 font-medium">Last Visit</p>
                      <p className="text-gray-900 text-md">{formatDate(selectedPatient.lastVisitDate)}</p>
                    </div>
                    <div className="md:col-span-1 shadow-sm rounded-lg p-3 bg-gray-50">
                      <p className="text-gray-900 font-medium">Next Visit</p>
                      <p className="text-gray-900 text-md">{formatDate(selectedPatient.nextCheckupDate)?? 'Not scheduled'}</p>
                    </div>
                    <div className="md:col-span-1 shadow-sm rounded-lg p-3 bg-gray-50">
                      <p className="text-gray-900 font-medium">Status</p>
                      <p className="text-gray-900 text-md">{selectedPatient.status || 'Active'}</p>
                    </div>
                    <div className="md:col-span-4 shadow-sm rounded-lg p-3 bg-gray-50">
                      <p className="text-gray-900 font-medium">Diagnosis</p>
                      <p className="text-gray-900 text-md">{selectedPatient.diagnosis}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Doctor's Notes */}
          <div className="mb-4">
            <label className="block text-base font-semibold text-gray-900 mb-2">Doctor's Notes</label>
            <textarea
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="Enter observations, treatment notes, or any relevant information..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                        shadow-sm rounded-lg p-3 bg-gray-50
                        focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px] resize-y"
            />
          </div>
          
          {/* Readings Table */}
          <div className="py-1 w-full mb-6">
            <label className="block text-base font-semibold text-gray-900 mb-2">Algometer Readings</label>
            <ReadingTable rows={sessionReadings} 
              onRowsChange={setSessionReadings}
              sessionActive={sessionActive} />
          </div>
          
          {/* Reference Guide */}
          <div>
            <label className="block text-md font-medium text-gray-900 mb-2">Reference Guide - Normal Ranges</label>
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                {BODY_PARTS.map((part) => (
                  <div key={part.name} className="text-gray-700">
                    <span className="font-medium">{part.name}:</span>
                    <br />
                    <span className="text-xs">PPT: {part.pptRange} | PPTol: {part.pptolRange}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleDiscard}
            className="group flex-1 px-6 py-3 border border-red-500 
                      bg-red-400 text-white rounded-lg transition-all duration-200 hover:bg-red-500 hover:font-semibold
                      transition-colors flex items-center justify-center gap-2"
          >
            <LucideTrash2 className="w-4 h-4 stroke-2 transition-all duration-200 group-hover:stroke-[2.5]" />
            Discard
          </button>
          <button
            onClick={handleSave}
            className="group flex-1 px-6 py-3 border border-amber-500 border-2x bg-amber-400 text-white 
                      rounded-lg tansition-all duration-200 hover:bg-amber-500 hover:font-semibold
                      transition-colors flex items-center justify-center gap-2"
          >
            <SaveIcon className="w-4 h-4 stroke-2 transition-all duration-200 group-hover:stroke-[2.5]" />
            Save (Temporary)
          </button>
          <button
            onClick={handleCommitToDB}
            className="group flex-1 px-6 py-3 border border-green-500 bg-green-400 text-white rounded-lg 
                      transition-all duration-200 hover:bg-green-500 hover:font-semibold 
                      transition-colors flex items-center justify-center gap-2"
          >
            <Database className="w-4 h-4 transition-all duration-200 stroke-2 group-hover:stroke-[2.5]" />
            Commit to Database
          </button>
        </div>
      </div>
    </div>
  );
}