import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { PatientDatabase } from './components/PatientDatabase';
import { PatientDetail } from './components/PatientDetail';
import { UnitConverter } from './components/UnitConverter';
import { UnassignedReadings } from './components/UnassignedReadings';
import { AlgometerReadingInterface } from './components/AlgometerReadingInterface';
import { AddPatientModal } from './components/AddPatientModal';
import { EditPatientModal } from './components/EditPatientModal';
import { LayoutDashboard, LogOut, Activity, Users, Calculator, UserPlus } from 'lucide-react';
import { mockPatients, mockAlgometerReadings, Patient, AlgometerReading } from './components/mockData';
import { toast, Toaster } from 'sonner@2.0.3';

// function App() {
//   return (
//     <div>
//       <PatientDatabase />
//     </div>
//   );
// }

// export default App;

type Page = 'dashboard' | 'patients' | 'converter' | 'patient-detail' | 'readings';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState('');
  const [uid, setUid] = useState("");
  
  // State for patients and readings
  const [patients, setPatients] = useState<Patient[]>([]);
  useEffect(() => {
  fetch(`http://localhost:5000/api/patients?uid=${uid}`)
    .then(res => res.json())
    .then(data => {
      const formatted = data.map((p: any) => ({
  id: p._id,                 // internal MongoDB id (used for edit/delete)
  patientCode: p.patientCode, // <-- ADD THIS
  name: p.name,
  age: p.age,
  gender: p.gender,
  contact: p.contact,
  diagnosis: p.diagnosis,
  lastVisit: p.lastVisitDate,
  nextCheckup: p.nextCheckupDate,
  status: p.status || "active",
  totalVisits: 0,
  hasReadings: false
}));
      setPatients(formatted);
    })
    .catch(err => console.error("Failed to fetch patients", err));
}, [uid]);

  const [readings, setReadings] = useState<AlgometerReading[]>(mockAlgometerReadings);

//   const fetchPatients = async () => {
//   try {
//     const res = await fetch("http://localhost/api/getPatients.php");
//     const data = await res.json();

//     const mapped = data.map((p: any) => ({
//       id: p.patientId ?? p.patient_id,
//       name: p.patientName ?? p.patient_name,
//       diagnosis: p.diagnosis,
//       status: "active",
//       nextCheckup: null,
//       totalVisits: p.total_visits ?? 0,
//       hasReadings: false
//     }));

//     setPatients(mapped);
//   } catch (err) {
//     console.error("Failed to fetch patients", err);
//   }
// };

// useEffect(() => {
//   fetchPatients();
// }, []);

//   useEffect(() => {
//   fetch("http://localhost/api/getPatients.php")
//     .then(res => res.json())
//     .then(data => {
//       const mapped = data.map((p: any) => ({
//         id: p.patient_id,
//         name: p.patient_name,
//         diagnosis: p.diagnosis,
//         status: "active",
//         nextCheckup: null,
//         totalVisits: p.total_visits ?? 0,
//         hasReadings: false
//       }));
//       setPatients(mapped);
//     })
//     .catch(err => console.error(err));
// }, []);

  
  // Modal states
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [showReadingInterface, setShowReadingInterface] = useState(false);
  const [editingReading, setEditingReading] = useState<AlgometerReading | null>(null);
  const [preSelectedPatientId, setPreSelectedPatientId] = useState<string | null>(null);

  // const handleLogin = (name: string) => {
  //   setDoctorName(name);
  //   setIsLoggedIn(true);
  // };
  const handleLogin = (name: string, userUid: string) => {
  setDoctorName(name);
  setUid(userUid);
  setIsLoggedIn(true);
};

  const handleLogout = () => {
    setIsLoggedIn(false);
    setDoctorName('');
    setCurrentPage('dashboard');
  };

  const handleViewPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentPage('patient-detail');
  };

  const handleBackToPatients = () => {
    setCurrentPage('patients');
    setSelectedPatientId(null);
  };

  const handleAddPatient = (newPatient: Patient) => {
  setPatients(prev => [...prev, newPatient]);
};


//   const handleAddPatient = async (
//   newPatient: Omit<Patient, 'id' | 'totalVisits' | 'hasReadings'>
// ) => {
//   try {
//     const payload = {
//       patientName: newPatient.name,
//       age: newPatient.age,
//       gender: newPatient.gender,
//       contact: newPatient.contact,
//       diagnosis: newPatient.diagnosis
//     };

//     const res = await fetch("http://localhost/api/addPatients.php", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload)
//     });

//     const result = await res.json();

//     if (result.status === "success") {
//       toast.success("Patient saved to database");
//       fetchPatients(); // reload from MySQL
//       setShowAddPatientModal(false);
//     } else {
//       toast.error("Failed to save patient");
//     }
//   } catch (err) {
//     console.error(err);
//     toast.error("Server error while saving patient");
//   }
// };


  // const handleEditPatient = (updatedPatient: Patient) => {
  //   setPatients(patients.map(p => 
  //     p.id === updatedPatient.id ? updatedPatient : p
  //   ));
  //   setShowEditPatientModal(false);
  //   setEditingPatientId(null);
  //   toast.success('Patient updated successfully');
  // };

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
          lastVisitDate: updatedPatient.lastVisit,
          nextCheckupDate: updatedPatient.nextCheckup,
          status: updatedPatient.status
        })
      }
    );

    const data = await res.json();

    setPatients(prev =>
      prev.map(p => p.id === data._id ? {
        id: data._id,
        name: data.name,
        age: data.age,
        gender: data.gender,
        contact: data.contact,
        diagnosis: data.diagnosis,
        lastVisit: data.lastVisitDate,
        nextCheckup: data.nextCheckupDate,
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

  // const handleDeletePatient = (patientId: string) => {
  //   if (confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
  //     // Delete patient
  //     setPatients(patients.filter(p => p.id !== patientId));
      
  //     // Delete associated readings
  //     setReadings(readings.filter(r => r.patientId !== patientId));
      
  //     // Navigate back if we're viewing the deleted patient
  //     if (selectedPatientId === patientId) {
  //       setCurrentPage('patients');
  //       setSelectedPatientId(null);
  //     }
      
  //     toast.success('Patient deleted successfully');
  //   }
  // };
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

  const handleSaveReading = (reading: Omit<AlgometerReading, 'id' | 'timestamp'>) => {
    if (editingReading) {
      // Update existing reading
      setReadings(readings.map(r => 
        r.id === editingReading.id 
          ? { ...reading, id: editingReading.id, timestamp: editingReading.timestamp, status: 'saved' }
          : r
      ));
      toast.success('Reading updated and saved');
    } else {
      // Create new reading
      const newId = `R${String(readings.length + 1).padStart(3, '0')}`;
      const newReading: AlgometerReading = {
        ...reading,
        id: newId,
        timestamp: new Date().toISOString(),
        status: 'saved'
      };
      setReadings([...readings, newReading]);
      toast.success('Reading saved temporarily');
    }
    
    setShowReadingInterface(false);
    setEditingReading(null);
    setPreSelectedPatientId(null);
    setCurrentPage('readings');
  };

  const handleCommitReading = (reading: Omit<AlgometerReading, 'id' | 'timestamp'>) => {
    if (editingReading) {
      // Update and commit existing reading
      setReadings(readings.map(r => 
        r.id === editingReading.id 
          ? { ...reading, id: editingReading.id, timestamp: new Date().toISOString(), status: 'committed' }
          : r
      ));
      toast.success('Reading updated and committed to database');
    } else {
      // Create new committed reading
      const newId = `R${String(readings.length + 1).padStart(3, '0')}`;
      const newReading: AlgometerReading = {
        ...reading,
        id: newId,
        timestamp: new Date().toISOString(),
        status: 'committed'
      };
      setReadings([...readings, newReading]);
      toast.success('Reading committed to database');
    }
    
    // Update patient's hasReadings flag
    if (reading.patientId) {
      setPatients(patients.map(p => 
        p.id === reading.patientId ? { ...p, hasReadings: true } : p
      ));
    }
    
    setShowReadingInterface(false);
    setEditingReading(null);
    setPreSelectedPatientId(null);
  };

  const handleOpenReadingInterface = (patientId?: string) => {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-gray-900">YourHealth Management System</h1>
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

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white shadow-sm min-h-[calc(100vh-80px)] p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === 'dashboard'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('patients')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === 'patients' || currentPage === 'patient-detail'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="w-5 h-5" />
                Patient Database
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('converter')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === 'converter'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Calculator className="w-5 h-5" />
                Unit Converter
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('readings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === 'readings'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Activity className="w-5 h-5" />
                Readings
              </button>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {currentPage === 'dashboard' && (
            <Dashboard doctorName={doctorName} uid={uid} />
          )}
          {currentPage === 'patients' && (
            <PatientDatabase 
              onViewPatient={handleViewPatient}
              patients={patients}
              onEditPatient={(patientId) => {
                setEditingPatientId(patientId);
                setShowEditPatientModal(true);
              }}
              onDeletePatient={handleDeletePatient}
            />
          )}
          {currentPage === 'converter' && <UnitConverter />}
          {currentPage === 'readings' && (
            <UnassignedReadings
              readings={readings}
              onOpenReadingInterface={() => handleOpenReadingInterface()}
              onEditReading={handleEditReading}
            />
          )}
          {currentPage === 'patient-detail' && selectedPatientId && selectedPatient && (
            <PatientDetail 
              patientId={selectedPatientId} 
              patient={selectedPatient}
              readings={readings.filter(r => r.patientId === selectedPatientId && r.status === 'committed')}
              onBack={handleBackToPatients}
              hasReadings={selectedPatient.hasReadings || false}
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
          uid={uid}
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