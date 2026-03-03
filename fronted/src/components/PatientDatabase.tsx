import { useEffect, useState } from "react";
import { Search, Eye, Calendar, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { RefreshCw } from "lucide-react";
// import { Patient } from './mockData';

interface Patient {
  id: string;
  patientCode: string;
  name: string;
  age: number;
  gender: string;
  contact?: string;
  diagnosis?: string;
  lastVisit?: string | null;
  nextCheckup?: string | null;
  status?: "active" | "discharged";
  totalVisits?: number;
}

// Old Before Refresh button
// interface PatientDatabaseProps {
//   onViewPatient: (patientId: string) => void;
//   patients: Patient[];
//   onEditPatient?: (patientId: string) => void;
//   onDeletePatient?: (patientId: string) => void;
// }

//After refresh button
interface PatientDatabaseProps {
  onViewPatient: (patientId: string) => void;
  patients: Patient[];
  onEditPatient?: (patientId: string) => void;
  onDeletePatient?: (patientId: string) => void;
  onRefresh?: () => void;
  isRefreshing?:boolean;
}

//Before Refresh button
// export function PatientDatabase({ onViewPatient, patients, onEditPatient, onDeletePatient }: PatientDatabaseProps) 

//After Refresh Button
export function PatientDatabase({ 
  onViewPatient, 
  patients, 
  onEditPatient, 
  onDeletePatient,
  onRefresh,
  isRefreshing
}: PatientDatabaseProps){
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'overdue' | 'discharged'>('all');

const filteredPatients = patients.filter((patient) => {
  const name = patient.name?.toLowerCase() || "";
  const id = patient.id?.toLowerCase() || "";
  const diagnosis = patient.diagnosis?.toLowerCase() || "";
  const search = searchTerm.toLowerCase();

  const matchesSearch =
    name.includes(search) ||
    id.includes(search) ||
    diagnosis.includes(search);

  if (!matchesSearch) return false;

  if (filterStatus === "all") return true;

  if (filterStatus === "discharged") {
    return patient.status === "discharged";
  }

  const today = new Date();
  const checkupDate = patient.nextCheckup
    ? new Date(patient.nextCheckup)
    : null;

  if (filterStatus === "upcoming") {
    return checkupDate && checkupDate >= today && patient.status !== "discharged";
  }

  if (filterStatus === "overdue") {
    return checkupDate && checkupDate < today && patient.status !== "discharged";
  }

  return true;
});

  const getStatusBadge = (nextCheckup: string | null, status?: 'active' | 'discharged') => {
    if (status === 'discharged') {
      return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Discharged</span>;
    }

    if (!nextCheckup) {
      return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Not Scheduled</span>;
    }

    const today = new Date();
    const checkupDate = new Date(nextCheckup);
    const daysUntil = Math.ceil((checkupDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) {
      return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">Overdue</span>;
    } else if (daysUntil <= 7) {
      return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">Upcoming</span>;
    } else {
      return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Scheduled</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        {/* <h2 className="text-gray-900">Patient Database</h2> */}
        <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Patient Database</h1>
          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Refresh patients"
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw
                className={`w-5 h-5 ${
                  isRefreshing ? "animate-spin [animation-duration:1.8s] ease-in-out" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('upcoming')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilterStatus('overdue')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'overdue'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Overdue
            </button>
            <button
              onClick={() => setFilterStatus('discharged')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'discharged'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Discharged
            </button>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700">Patient ID</th>
                <th className="px-6 py-4 text-left text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-gray-700">Age</th>
                <th className="px-6 py-4 text-left text-gray-700">Diagnosis</th>
                <th className="px-6 py-4 text-left text-gray-700">Last Visit</th>
                <th className="px-6 py-4 text-left text-gray-700">Next Checkup</th>
                <th className="px-6 py-4 text-left text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{patient.patientCode}</td>
                  <td className="px-6 py-4 text-gray-900">{patient.name}</td>
                  <td className="px-6 py-4 text-gray-700">{patient.age}</td>
                  <td className="px-6 py-4 text-gray-700">{patient.diagnosis}</td>
                  <td className="px-6 py-4 text-gray-700">{patient.lastVisit}</td>
                  <td className="px-6 py-4 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {patient.nextCheckup || 'Not scheduled'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(patient.nextCheckup, patient.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewPatient(patient.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      {onEditPatient && (
                        <button
                          onClick={() => onEditPatient(patient.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDeletePatient && (
                        <button
                          onClick={() => onDeletePatient(patient.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No patients found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-blue-900">
          Showing {filteredPatients.length} of {patients.length} patients
        </p>
      </div>
    </div>
  );
}