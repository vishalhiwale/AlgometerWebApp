import { useEffect, useState } from "react";
import { Search, Eye, Calendar, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { RefreshCw } from "lucide-react";

interface Patient {
  id: string;
  patientCode: string;
  name: string;
  age: number;
  gender: string;
  contact?: string;
  diagnosis?: string;
  lastVisit?: string | null;
  nextCheckupDate?: string | null;
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
  const [filterStatus, setFilterStatus] = useState<'all' | 'today' | 'upcoming' | 'overdue' | 'discharged'>('all');

    // const formatDate = (timestamp: string) => {
    // return new Date(timestamp).toLocaleString('en-IN', {
    //   day: '2-digit',
    //   month: 'short',
    //   year: 'numeric',
    //   });
    // };
    const formatDate = (date: string) => {
      if (!date) return null;
      return new Date(date).toLocaleDateString("en-GB");
    };

const columns = [
  { key: "patientCode", label: "Patient ID" },
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "diagnosis", label: "Diagnosis" },
  { key: "lastVisitDate", label: "Last Visit" },
  { key: "nextCheckupDate", label: "Next Checkup" },
  { key: "status", label: "Status" },
];

const filteredPatients = patients.filter((patient) => {
  const name = patient.name?.toLowerCase() || "";
  const id = patient.id?.toLowerCase() || "";
  const diagnosis = patient.diagnosis?.toLowerCase() || "";
  const search = searchTerm.toLowerCase();
  
  //debugging line
  // console.log("In filteredPatients");

  const matchesSearch =
    name.includes(search) ||
    id.includes(search) ||
    diagnosis.includes(search);

    if (!matchesSearch) return false;

    if (filterStatus === "all") return true;

    if (filterStatus === "discharged") {
      return patient.status === "discharged";
    }

    const today = new Date().toLocaleDateString("en-GB");
    // console.log("todays date: ", today);
    const checkupDate = patient.nextCheckupDate
      ? new Date(patient.nextCheckupDate).toLocaleDateString("en-GB")
      : null;

    if (filterStatus === "today") {
      return checkupDate && checkupDate == today && patient.status !== "discharged";
    }

    if (filterStatus === "upcoming") {
      return checkupDate && checkupDate > today && patient.status !== "discharged";
    }

    if (filterStatus === "overdue") {
      return checkupDate && checkupDate < today && patient.status !== "discharged";
    }

    return true;
  });

  const getStatusBadge = (nextCheckupDate: string | null, status?: 'active' | 'discharged') => {
    if (status === 'discharged') {
      return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Discharged</span>;
    }
    if (!nextCheckupDate) {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">Awaiting</span>;
    }

    const today = new Date();
    const checkupDate = new Date(nextCheckupDate);
    // const daysUntil = Math.ceil((checkupDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const daysUntil = Math.round((checkupDate.getTime() - today.getTime()) / (1000*60*60*24)) ;

    // console.log("Today: ",today);
    // console.log("checkup date:, ",nextCheckupDate);
    // console.log(daysUntil);

    if (nextCheckupDate && daysUntil < 0) {
      return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">Overdue</span>;
    } else if (nextCheckupDate && daysUntil == 0) {
      return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Today</span>;
    }else if (nextCheckupDate && daysUntil <= 7 && daysUntil > 0) {
      return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Upcoming</span>;
    }else if (nextCheckupDate && daysUntil > 7){
      return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">Scheduled</span>;
    }else {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">Awaiting</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        {/* <h2 className="text-gray-900">Patient Database</h2> */}
        <div className="flex justify-between items-center">
              {/* <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Patient Database</h1> */}
              <h2 className="text-2xl font-bold text-gray-700 tracking-tight">Patient Database</h2>
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
              onClick={() => setFilterStatus('today')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'today'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Today
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
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-5 py-4 text-left text-greay-800 font-bold whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-center text-grey-600 font-bold">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {filteredPatients.map((patient) => (
                <tr 
                  key={`${patient.id}-`}
                  onClick={() => onViewPatient(patient.id)}
                  className="hover:bg-blue-50 cursor-pointer transition">
                  
                  {columns.map((col) => {
                    let value = patient[col.key];

                    // Custom rendering for Dates and Status
                    if (col.key === "nextCheckupDate" ) {
                      value = formatDate(value) || "Not scheduled";
                    }
                    if (col.key === "lastVisitDate") {
                      value = formatDate(value) || "No record";
                    }

                    if (col.key === "status") {
                      return (
                        <td key={`${patient.id}-${col.key}`} className="px-6 py-4">
                          {getStatusBadge(patient.nextCheckupDate, patient.status)}
                        </td>
                      );
                    }

                    return (
                      <td key={`${patient.id}-${col.key}`} className="px-5 py-4 text-left text-gray-700 whitespace-nowrap">
                        {value || "-"}
                      </td>
                    );
                  })}

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onViewPatient(patient.id)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs"
                      >
                        View
                      </button>

                      {onEditPatient && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditPatient(patient.id);
                          }}
                          className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-xs"
                        >
                          Edit
                        </button>
                      )}

                      {onDeletePatient && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePatient(patient.id);
                          }}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-xs"
                        >
                          Delete
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