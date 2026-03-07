import { useState } from 'react';
import { X, Plus, Save, Check, XCircle, User, Divide } from 'lucide-react';
// import { Patient, AlgometerReading, LocationReading } from './mockData';
import ReadingTable from './ReadingTable';
import { Patient, AlgometerReading } from '../types/algometer';
interface AlgometerReadingInterfaceProps {
  onClose: () => void;
  onSave: (reading: Omit<AlgometerReading, 'id' | 'timestamp'>) => void;
  onCommit: (reading: Omit<AlgometerReading, 'id' | 'timestamp'>) => void;
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
  doctorName,
  existingReading,
  availablePatients,
  allPatients,
  preSelectedPatientId
}: AlgometerReadingInterfaceProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    existingReading?.patientId || preSelectedPatientId || ''
  );

  const [doctorNotes, setDoctorNotes] = useState(existingReading?.doctorNotes || '');

  type FirebaseReading = {
  muscle: string;
  pointPressureThreshold: number;
  pointPressureTolerance: number;
  };

  const [sessionReadings, setSessionReadings] = useState<FirebaseReading[]>([]);

  const selectedPatient = allPatients.find(p => p.id === selectedPatientId);

  const handleDiscard = () => {
    if (confirm('Are you sure you want to discard all readings? This action cannot be undone.')) {
      onClose();
    }
  };

  const handleSave = () => {
    if (!selectedPatientId) {
      alert('Please select a patient');
      return;
    }

    if (sessionReadings.length === 0) {
      alert('No readings received from device yet');
      return;
    }

    onSave({
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

      status: "saved"
    });
  };

  
  const handleCommitToDB = () => {
    console.log("selectedPatientId:", selectedPatientId);
    console.log("allPatients:", allPatients);
    console.log("selectedPatient:", selectedPatient);

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

    onCommit({  
      patientId: selectedPatient.id,
      patientCode: selectedPatient.patientCode,
      patientName: selectedPatient.name,
      
      doctorName: doctorName,
      doctorNotes: doctorNotes,

      readings: sessionReadings.map(r => ({
        muscleName: r.muscle,
        threshold: r.pointPressureThreshold,
        tolerance: r.pointPressureTolerance
       })),

      status: "committed"
      // sessionTime: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full my-8 flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-gray-900">Algometer Reading Interface</h2>
            <p className="text-gray-600 text-sm mt-1">Record pain pressure threshold measurements</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Patient Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Select Patient <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!!existingReading?.patientId}
            >
              <option value="">-- Select a Patient --</option>
              
              {(existingReading?.patientId ? allPatients : availablePatients).map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} ({patient.patientCode})
                </option>
              ))}
            </select>

            {/* New Select option */}
                      {/* <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
          >
            <option value="">-- Select a Patient --</option>

            {(existingReading?.patientId ? allPatients : availablePatients).map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name} ({patient.patientCode})
              </option>
            ))}
          </select> */}
          </div>

          {/* Patient Details */}
          {selectedPatient && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-6">
                {/* Patient Photo */}
                <div className="flex-shrink-0">
                  {selectedPatient.photo ? (
                    <img 
                      src={selectedPatient.photo} 
                      alt={selectedPatient.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-200 border-4 border-white shadow-lg flex items-center justify-center">
                      <User className="w-12 h-12 text-blue-600" />
                    </div>
                  )}
                </div>

                {/* Patient Info */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Patient Name</p>
                    <p className="text-gray-900">{selectedPatient.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Patient ID</p>
                    <p className="text-gray-900">{selectedPatient.patientCode}</p> {/*old : patientId*/}
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Age / Gender</p>
                    <p className="text-gray-900">{selectedPatient.age} / {selectedPatient.gender}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Contact</p>
                    <p className="text-gray-900">{selectedPatient.contact}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-600 text-sm">Diagnosis</p>
                    <p className="text-gray-900">{selectedPatient.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Last Visit</p>
                    <p className="text-gray-900">{selectedPatient.lastVisit}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className="text-gray-900">{selectedPatient.status || 'Active'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Doctor's Notes */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Doctor's Notes</label>
            <textarea
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="Enter observations, treatment notes, or any relevant information..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
            />
          </div>
          
          {/* Readings Table */}
          <div className="flex items-start py-1 justify-center w-full">
            <ReadingTable onRowsChange={setSessionReadings}/>
          </div>
          
          {/* Reference Guide */}
          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-gray-900 mb-2">Reference Guide - Normal Ranges</h4>
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

        {/* Footer Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleDiscard}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Discard
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save (Temporary)
          </button>
          <button
            onClick={handleCommitToDB}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Commit to Database
          </button>
        </div>
      </div>
    </div>
  );
}