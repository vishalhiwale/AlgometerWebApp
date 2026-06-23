import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { PatientDatabase } from './components/PatientDatabase';
import { PatientDetail } from './components/PatientDetail';
import { UnitConverter } from './components/UnitConverter';
import { SavedReadings } from './components/SavedReadings';
import { AlgometerReadingInterface } from './components/AlgometerReadingInterface';
import { AddPatientModal } from './components/AddPatientModal';
import { EditPatientModal } from './components/EditPatientModal';
import { LayoutDashboard, LogOut, Activity, Users, Calculator, UserPlus, BoldIcon, Icon } from 'lucide-react';
import { toast, Toaster } from 'sonner';

import { ref, remove } from "firebase/database";
import { db } from "./firebase";
import ReadingTable from './components/ReadingTable';
import { read } from 'fs';
import { throwDeprecation } from 'process';

type Page = 'dashboard' | 'patients' | 'converter' | 'patient-detail' | 'readings';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState('');
  
  // State for patients and readings
  const [patients, setPatients] = useState<Patient[]>([]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPatients = async () => {
  try {

    setIsRefreshing(true);

    const res = await fetch("http://localhost:5000/api/patients");
    const data = await res.json();

    const formatted = data.map((p: any) => ({
      id: p._id || p.id,
      patientCode: p.patientCode,
      name: p.name,
      age: p.age,
      gender: p.gender,
      contact: p.contact,
      diagnosis: p.diagnosis,
      lastVisitDate: p.lastVisitDate,
      nextCheckupDate: p.nextCheckupDate,
      status: p.status || "active",
      totalVisits: 0,
      hasReadings: false
    }));

    setPatients(formatted);
  } catch (error) {
    console.error("Failed to fetch patients", error);
  }finally{
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  }
};

  useEffect(() => {
      fetchPatients();
    }, []);

const [readings, setReadings] = useState<any[]>([]);

// Re-Formatting the Readings
const formattingReadings = (data: any[]) => {
  return data.map(reading => ({
    ...reading,
    readings: reading.readings.map((r: any) => ({
      location: r.muscleName,
      ppt: r.threshold,
      pptol: r.tolerance
    }))
  }));
};

// Fucntion to fetch reading Data
const fetchReadings = async (patientId: string) => {
  try {
    const res = await fetch(`http://localhost:5000/api/readings/${patientId}`);
    const data = await res.json();

    // console.log("Fetched Readings", data);
    // console.log("LAST READING OBJECT:", data[0]);
    // console.log("INNER READINGS:", data[0]?.readings);
    
    // setReadings(formattingReadings(data));
    setReadings(data);
  } catch (error) {
    console.error("Failed to fetch readings", error);
  }
};
  
  // Modal states
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [showReadingInterface, setShowReadingInterface] = useState(false);
  const [editingReading, setEditingReading] = useState<AlgometerReading | null>(null);
  const [preSelectedPatientId, setPreSelectedPatientId] = useState<string | null>(null);

  const handleLogin = (name: string) => {
    setDoctorName(name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setDoctorName('');
    setCurrentPage('dashboard');
  };

  const handleViewPatient = async (patientId: string) => {
    setSelectedPatientId(patientId);
    // setCurrentPage('patient-detail');
    await fetchReadings(patientId);
    setCurrentPage('patient-detail');
  };

  const handleBackToPatients = () => {
    setCurrentPage('patients');
    setSelectedPatientId(null);
  };

  const handleAddPatient = async (newPatient: any) => {
  try {
    const res = await fetch("http://localhost:5000/api/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPatient)
    });

    if (!res.ok) {
      throw new Error("Failed to save patient");
    }

    const saved = await res.json();

    const formatted = {
      id: saved._id,
      patientCode: saved.patientCode,
      name: saved.name,
      age: saved.age,
      gender: saved.gender,
      contact: saved.contact,
      diagnosis: saved.diagnosis,
      lastVisitDate: saved.lastVisitDate,
      nextCheckupDate: saved.nextCheckupDate,
      status: saved.status,
      totalVisits: 0,
      hasReadings: false
    };

    setPatients(prev => [...prev, formatted]);

    toast.success("Patient saved to database");

  } catch (error) {
    console.error(error);
    toast.error("Failed to save patient");
  }
};

const handleEditPatient = async (updatedPatient: Patient) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/patients/${updatedPatient.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: updatedPatient.name,
          age: updatedPatient.age,
          gender: updatedPatient.gender,
          contact: updatedPatient.contact,
          diagnosis: updatedPatient.diagnosis,
          lastVisitDate: updatedPatient.lastVisitDate,
          nextCheckupDate: updatedPatient.nextCheckupDate,
          status: updatedPatient.status
        })
      }
    );

    if (!res.ok){
      throw new Error("Update faild");
    }

    const data = await res.json();

    setPatients(prev =>
      prev.map(p => p.id === data._id ? {
        id: data._id,
        patientCode: data.patientCode,
        name: data.name,
        age: data.age,
        gender: data.gender,
        contact: data.contact,
        diagnosis: data.diagnosis,
        lastVisitDate: data.lastVisitDate,
        nextCheckupDate: data.nextCheckupDate,
        status: data.status,
        totalVisits: 0,
        hasReadings: p.hasReadings
      } : p)
    );

    setShowEditPatientModal(false);
    setEditingPatientId(null);
    toast.success("Patient updated successfully");

  } catch (error) {
    console.error(error);
    toast.error("Failed to update patient");
  }
};

  const handleDeletePatient = async (patientId: string) => {
  if (!confirm('Are you sure you want to delete this patient? This action cannot be undone.')) return;

  try {
    await fetch(`http://localhost:5000/api/patients/${patientId}`, {
      method: "DELETE"
    });

    setPatients(prev => prev.filter(p => p.id !== patientId));

    toast.success("Patient deleted successfully");

  } catch (error) {
    console.error(error);
    toast.error("Failed to delete patient");
  }
};

  type FirebaseReading = {
  muscle: string;
  pointPressureThreshold: number;
  pointPressureTolerance: number;
  };

  // To store Readings in App.tsx
  // const [sessionReading, setSessionReading] = useState<FirebaseReading[]>([]);
  // Render data from Reading Page
  // <ReadingTable onRowsChange={setSessionReading}/>

  type ReadingInfo = {
  patientId: string;
  patientName?: string;
  readings: {
    location: string;
    ppt: number | null;
    pptol: number | null;
  }[];
  doctorNotes?: string;
  takenBy: string;
  status: "saved" | "committed";
};

  // New Save Logic
  const handleSaveReading = async(readingInfo : ReadingInfo)=> {
  try {
    await fetch("http://localhost:5000/api/readings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(readingInfo)
    });

    toast.success("Reading saved successfully");

  } catch (error) {
    console.error(error);
    toast.error("Failed to save reading");
  }
};

  // New Commit Logic
  const handleCommitReading = async(readingInfo : ReadingInfo, id?: string)=> {
  try {
    
    let response;

    if(id) {
       // UPDATE existing reading
      response = await fetch(`http://localhost:5000/api/readings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(readingInfo)
      });
    }else{
      //CREATE new reading
      response = await fetch("http://localhost:5000/api/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(readingInfo),
      });
    }
    
    if(!response.ok) throw new Error("Commit failed");

    const today = new Date().toISOString();

    // Update Last Date in Databse
    response = await fetch(`http://localhost:5000/api/patients/${readingInfo.patientId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lastVisitDate: today
      })
    });

    if(!response.ok) throw new Error("Failed to save Last Visit Date");

    // Update Fronted Instantly
    setPatients(prev =>
      prev.map(p =>
        p.id === readingInfo.patientId
          ? { ...p, lastVisitDate: today }
          : p
      )
    );

    toast.success("Reading commited successfully");

  } catch (error) {
    console.error(error);
    toast.error("Failed to commit reading");
  }
};


  const handleOpenReadingInterface = async (patientId?: string) => {
    try {
      await remove(ref(db, "liveReadings/algometer")); // clear old device data
    } catch (err) {
      console.error("Failed to clear Firebase readings", err);
  }

  setPreSelectedPatientId(patientId || null);
  setEditingReading(null);
  setShowReadingInterface(true);
};

  const handleEditReading = (reading: AlgometerReading) => {
    setEditingReading(reading);
    setShowReadingInterface(true);
  };

  // Get patients without readings for assignment
  const patientsWithoutReadings = patients.filter(p => !p.hasReadings);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const selectedPatient = selectedPatientId ? patients.find(p => p.id === selectedPatientId) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        {/* <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-4"> */}
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Health Management System</h1>
              <p className="text-gray-600 text-sm mt-1">Welcome, Dr. {doctorName}</p>
            </div>
            <div className="flex items-center gap-3">
              {(currentPage === 'patients' || currentPage === 'patient-detail') && (
                <button
                  onClick={() => setShowAddPatientModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Add New Patient
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* <div className="flex max-w-7xl mx-auto"> */}
      <div className="flex w-full">
        {/* Sidebar Navigation */}
        <nav className="w-64 min-w-[16rem] flex-shrink-0 bg-white shadow-sm min-h-[calc(100vh-80px)] p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === 'dashboard'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard className={`w-5 h-5 ${ currentPage==='dashboard' ? 'stroke-[2.2]' : 'stroke-[1.7]'}`} />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('patients')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === 'patients' || currentPage === 'patient-detail'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className={`w-5 h-5 ${ currentPage === 'patients' || currentPage === 'patient-detail' ? 'stroke-[2.2]' : 'stroke-[1.7]'}`} />
                Patient Database
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('converter')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === 'converter'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Calculator className={`w-5 h-5 ${ currentPage==='converter' ? 'stroke-[2.2]' : 'stroke-[1.7]'}`} />
                Unit Converter
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('readings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === 'readings'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Activity className={`w-5 h-5 ${ currentPage==='readings' ? 'stroke-[2.2]' : 'stroke-[1.7]'}`} />
                Readings
              </button>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {currentPage === 'dashboard' && (
            <Dashboard />
          )}
          {currentPage === 'patients' && (
            // <PatientDatabase 
            //   onViewPatient={handleViewPatient}
            //   patients={patients}
            //   onEditPatient={(patientId) => {
            //     setEditingPatientId(patientId);
            //     setShowEditPatientModal(true);
            //   }}
            //   onDeletePatient={handleDeletePatient}
            // />
                <PatientDatabase 
                  onViewPatient={handleViewPatient}
                  patients={patients}
                  onEditPatient={(patientId) => {
                    setEditingPatientId(patientId);
                    setShowEditPatientModal(true);
                  }}
                  onDeletePatient={handleDeletePatient}
                  onRefresh={fetchPatients}
                  isRefreshing={isRefreshing}
                />
          )}
          {currentPage === 'converter' && <UnitConverter />}
          {currentPage === 'readings' && (
            <SavedReadings
              readings={readings}
              onOpenReadingInterface={() => handleOpenReadingInterface()}
              onEditReading={handleEditReading}
            />
          )}
          
          {currentPage === 'patient-detail' && selectedPatientId && selectedPatient && (
            <PatientDetail 
              patientId={selectedPatientId} 
              patient={selectedPatient}
              readings={readings.filter(
                r => r.patientId === selectedPatientId && r.status === 'committed')}
              onBack={handleBackToPatients}
              hasReadings={readings.length > 0}
              onTakeReadings={() => handleOpenReadingInterface(selectedPatientId)}
              onEditPatient={() => {
                setEditingPatientId(selectedPatientId);
                setShowEditPatientModal(true);
              }}
              onDeletePatient={() => handleDeletePatient(selectedPatientId)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {showAddPatientModal && (
        <AddPatientModal
          onClose={() => setShowAddPatientModal(false)}
          onAddPatient={handleAddPatient}
        />
      )}

      {showEditPatientModal && editingPatientId && (
        <EditPatientModal
          onClose={() => {
            setShowEditPatientModal(false);
            setEditingPatientId(null);
          }}
          onEditPatient={handleEditPatient}
          patient={patients.find(p => p.id === editingPatientId)!}
        />
      )}

      {showReadingInterface && (
        <AlgometerReadingInterface
          onClose={() => {
            setShowReadingInterface(false);
            setEditingReading(null);
            setPreSelectedPatientId(null);
          }}
          onSave={handleSaveReading}
          onCommit={handleCommitReading}
          doctorName={doctorName}
          existingReading={editingReading}
          availablePatients={patientsWithoutReadings}
          allPatients={patients}
          preSelectedPatientId={preSelectedPatientId}
        />
      )}
    </div>
  );
}