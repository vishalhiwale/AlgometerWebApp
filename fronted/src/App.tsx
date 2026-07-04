import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Dashboard } from './components/Dashboard';
import { PatientDatabase } from './components/PatientDatabase';
import { PatientDetail } from './components/PatientDetail';
import { UnitConverter } from './components/UnitConverter';
import { SavedReadings } from './components/SavedReadings';
import { AlgometerReadingInterface } from './components/AlgometerReadingInterface';
import { AddPatientModal } from './components/AddPatientModal';
import { EditPatientModal } from './components/EditPatientModal';
import { LayoutDashboard, LogOut, Activity, Users, Calculator, UserPlus, BoldIcon, Icon, MenuSquare } from 'lucide-react';
import { toast, Toaster } from 'sonner';

import { ref, remove } from "firebase/database";
import { db } from "./firebase";
import ReadingTable from './components/ReadingTable';
import { read } from 'fs';
import { throwDeprecation } from 'process';
import api from "../src/services/api";
import { useAuth } from './context/AuthContext';
import { AlgometerReading } from '../src/types/algometer';


type Page = 'dashboard' | 'patients' | 'converter' | 'patient-detail' | 'readings';

export default function App() {
  
  const { user, logout } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  // const [doctorName, setDoctorName] = useState('');
  
  // State for patients and readings
  const [patients, setPatients] = useState<Patient[]>([]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch Patients 
  const fetchPatients = async () => {
    try {

      setIsRefreshing(true);

      const response = await api.get("/patients");
      const data = Array.isArray(response.data) ? response.data : [];

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
    if(user){
      fetchPatients();
    }
  }, [user]);

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

  // Fucntion to fetch reading
  const fetchReadings = async (patientId: string) => {
    try {

      const response = await api.get(`/readings/${patientId}`);
      const data = Array.isArray(response.data) ? response.data : [];

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
  const [savedReadingsRefreshKey, setSavedReadingsRefreshKey] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // const handleLogin = (name: string) => {
  //   setDoctorName(name);
  // };

  const handleLogout = () => {
    // setDoctorName('');
    if (confirm("Do you really want to Logout?")){
      logout();
      setCurrentPage('dashboard');
      setSelectedPatientId(null);
    };
    return ;
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
      // console.log(newPatient);
      const response = await api.post("/patients", newPatient);
      // console.log("response: ",response);
      // const saved = Array.isArray(response.data) ? response.data : [];
      const saved = response.data;
      console.log("Saved Data: ",saved);

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
    } finally {
      fetchPatients();
    }
  };

  const handleEditPatient = async (updatedPatient: Patient) => {
    try {

      const response = await api.put(`/patients/${updatedPatient.id}`,
        {
          name: updatedPatient.name,
          age: updatedPatient.age,
          gender: updatedPatient.gender,
          contact: updatedPatient.contact,
          diagnosis: updatedPatient.diagnosis,
          lastVisitDate: updatedPatient.lastVisitDate,
          nextCheckupDate: updatedPatient.nextCheckupDate,
          status: updatedPatient.status
        }
      );

      const data = response.data;

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

      await api.delete(`/patients/${patientId}`);

      setPatients(prev => prev.filter(p => p.id !== patientId));

      toast.success("Patient deleted successfully");

    } catch (error) {
      console.error(error);
      toast.error("Failed to delete patient");
    }
  };

  const handleDeleteReading = async (reading: AlgometerReading) => {

    try {
      const status = reading.status;
      // console.log("reading Id", reading._id);

      if(status == "saved"){
        if(confirm("Do you want to delete Saved Reading?")){
          await api.delete(`/readings/${reading._id}`);
        }
      }

      if(status == "committed"){
        if(confirm("Do you really want to permanantly delete committed readings and Note? This action cannot be undone."))
        await api.delete(`/readings/${reading._id}`);
      }

      await fetchReadings(reading.patientId)
      // setPatients(prev => prev.filter(p => p.id !== patientId));

    } catch (error) {
      console.error(error);
      toast.error("Failed to delete reading");
    } finally {
      // await fetchReadings(reading.patientId)
      toast.success("Reading deleted successfully");
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
  const handleSaveReading = async(readingInfo : ReadingInfo, id?: string)=> {
    try {

      if(id){
        // UPDATE existing reading
        await api.put(`/readings/${id}`, readingInfo);
      } else {
        // CREATE new reading
        await api.post("/readings", readingInfo);
      }
      
      toast.success("Reading saved successfully");

    } catch (error) {

      console.error(error);
      toast.error("Failed to save reading");

    }
  };

  // New Commit Logic
  const handleCommitReading = async(readingInfo : ReadingInfo, id?: string)=> {
    try {
    
      if(id) {
        // UPDATE existing reading
        await api.put(`/readings/${id}`, readingInfo);

      } else {
        //CREATE new reading
        await api.post("/readings", readingInfo);
      }

      const today = new Date().toISOString();

      // Update Last Date in Databse
      await api.put(`/patients/${readingInfo.patientId}`, {
        lastVisitDate: today,
      });

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

  if (!user) {
    return showSignup ? (
      <Signup switchToLogin={() => setShowSignup(false)} />
    ) : (
      <Login switchToSignup={() => setShowSignup(true)} />
    );
    // if(showSignup) {
    //   return (
    //     <Signup
    //       switchToLogin= {() => setShowSignup(false)}
    //     />
    //   );
    // }
    // return (
    //   <Login 
    //     switchToSignup={() => setShowSignup(true)}
    //   />
    // );
  }

  const selectedPatient = selectedPatientId ? patients.find(p => p.id === selectedPatientId) : null;

  // console.log("handleDeleteReading:", handleDeleteReading);
  // console.log("typeof handleDeleteReading:", typeof handleDeleteReading);
  
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-gray-50">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="bg-gray-10 h-[80px] flex-shrink-0 shadow-sm">
        {/* <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-4"> */}
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Health Management System</h1>
              <p className="text-gray-700 text-sm font-medium mt-1 capitalize">Welcome, Dr. {user?.name ?? ""}</p>
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
                className="flex items-center gap-2 px-3 py-2 text-gray-700 font-medium hover:bg-red-400 rounded-lg hover:text-white"
              >
                <LogOut className="w-5 h-5 stroke-[1.7]" />
                    Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* <div className="flex max-w-7xl mx-auto"> */}

      <div className="flex w-full h-[calc(100vh-80px)] overflow-hidden">

        {/* Sidebar Navigation */}
        <nav className={`flex-shrink-0 bg-gray-100 shadow-sm h-full p-4 transition-all duration-300 
                        relative ${isCollapsed ? 'w-20 min-w-[5rem] p-2' : 'w-64 min-w-[16rem] p-4'} overflow-y-auto`}>
          
          <div className={`w-full flex items-center mb-4 ${isCollapsed? 'justify-center' : 'justify-end'}`}>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-3 flex items-center rounded-lg hover:bg-gray-200 text-gray-700 text-center transition-colors ${
                  isCollapsed? 'justify-center gap-0 px-1 py-3' : 'gap-3 px-4 py-3'
                }`}
              aria-label={isCollapsed? "Expand sidebar" : "Collapse sidebar"}
            >

            <span className={`transition-opacity duration-600 whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>
              Menu
            </span>
              {isCollapsed? <MenuSquare className='w-5 h-5 transition-all duration-600'/> : <MenuSquare className='w-5 h-5 rotate-90 transition-all duration-600'/>}
            </button>
          </div>
          
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`w-full flex items-center rounded-lg transition-colors ${
                  isCollapsed? 'justify-center gap-0 px-1 py-3' : 'gap-3 px-4 py-3'
                } ${
                  currentPage === 'dashboard'
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-black-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <LayoutDashboard className={`w-5 h-5 ${ currentPage==='dashboard' ? 'stroke-[2.2]' : 'stroke-[1.7]'}`} />
                {/* {isCollapsed? '' : 'Dashboard'} */}
                <span className={`transition-opacity duration-600 whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>
                  Dashboard
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('patients')}
                className={`w-full flex items-center rounded-lg transition-colors ${
                  isCollapsed? 'justify-center gap-0 px-1 py-3' : 'gap-3 px-4 py-3'
                } ${
                  currentPage === 'patients' || currentPage === 'patient-detail'
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-black-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Users className={`w-5 h-5 ${ currentPage === 'patients' || currentPage === 'patient-detail' ? 'stroke-[2.2]' : 'stroke-[1.7]'}`} />
                {/* {isCollapsed? '' : 'Patient Database'} */}
                <span className={`transition-opacity duration-600 whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>
                  Patient Database
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('converter')}
                className={`w-full flex items-center rounded-lg transition-colors ${
                  isCollapsed? 'justify-center gap-0 px-1 py-3' : 'gap-3 px-4 py-3'
                } ${
                  currentPage === 'converter'
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-black-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Calculator className={`w-5 h-5 ${ currentPage==='converter' ? 'stroke-[2.2]' : 'stroke-[1.7]'}`} />
                {/* {isCollapsed? '' : 'Unit Converter'} */}
                <span className={`transition-opacity duration-600 whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>
                  Unit Converter
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('readings')}
                className={`w-full flex items-center rounded-lg transition-colors ${
                  isCollapsed? 'justify-center gap-0 px-1 py-3' : 'gap-3 px-4 py-3'
                } ${
                  currentPage === 'readings'
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-black-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Activity className={`w-5 h-5 ${ currentPage==='readings' ? 'stroke-[2.2]' : 'stroke-[1.7]'}`} />
                {/* {isCollapsed? '' : 'Readings'} */}
                <span className={`transition-opacity duration-600 whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>
                  Readings
                </span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 h-full bg-gray-100 overflow-y-auto p-6 ml-3 mr-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
              refreshKey={savedReadingsRefreshKey}
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
              onDeleteReading={handleDeleteReading}
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
          onRefreshSavedReadings={()=>
            setSavedReadingsRefreshKey(prev => prev+1)
          }
          onFetchReading={fetchReadings}
          doctorName={user?.name ?? ""}
          existingReading={editingReading}
          availablePatients={patientsWithoutReadings}
          allPatients={patients}
          preSelectedPatientId={preSelectedPatientId}
        />
      )}
    </div>
  );
}