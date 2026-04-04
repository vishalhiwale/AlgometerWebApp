import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

interface AddPatientModalProps {
  onClose: () => void;
  onAddPatient: (patient: Omit<Patient, 'id' | 'totalVisits' | 'hasReadings'>) => void;
}

export function AddPatientModal({ onClose, onAddPatient }: AddPatientModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    contact: '+91-',
    diagnosis: '',
    lastVisitDate: new Date().toISOString().split('T')[0],
    nextCheckupDate: '',
    status: 'active' as 'active' | 'discharged',
    photo: null as File | null
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] || null;
  setFormData({ ...formData, photo: file });
};

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Remove all non-digit characters except the leading +91-
    const digits = input.replace(/^\+91-/, '').replace(/\D/g, '');
    
    // Limit to 10 digits
    const limitedDigits = digits.slice(0, 10);
    
    // Format as +91-xxxxx-xxxxx
    let formatted = '+91-';
    if (limitedDigits.length > 0) {
      formatted += limitedDigits.slice(0, 5);
      if (limitedDigits.length > 5) {
        formatted += '-' + limitedDigits.slice(5);
      }
    }
    
    setFormData({ ...formData, contact: formatted });
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name || !formData.age || !formData.contact || !formData.diagnosis) {
    alert("Please fill in all required fields");
    return;
  }

  const phoneRegex = /^\+91-\d{5}-\d{5}$/;
  if (!phoneRegex.test(formData.contact)) {
    alert("Invalid phone number");
    return;
  }

  // Send only form data to parent
  onAddPatient({
    name: formData.name,
    age: Number(formData.age),
    gender: formData.gender,
    contact: formData.contact,
    diagnosis: formData.diagnosis,
    lastVisitDate: formData.lastVisitDate,
    nextCheckupDate: formData.nextCheckupDate,
    status: formData.status
  });

  onClose();
};


//   // ✅ REAL FormData for backend
//   const data = new FormData();
//   data.append("name", formData.name);
//   data.append("age", formData.age);
//   data.append("gender",formData.gender);
//   data.append("contact", formData.contact);
//   data.append("diagnosis", formData.diagnosis);
//   data.append("lastVisitDate", formData.lastVisit);
//   if (formData.nextCheckup) {data.append("nextCheckupDate", formData.nextCheckup);}
//   data.append( "status", formData.status === "active" ? "Active" : "Inactive");
//   if (formData.photo) {data.append("photo", formData.photo);}

//   fetch("http://localhost/api/addPatients.php", {
//     method: "POST",
//     body: data,
//   })
//     .then((res) => res.json())
//     .then((res) => {
//       console.log(res);
//       if (res.success) {
//         alert("Patient added successfully");
//         onClose();
//       } else {
//         alert(res.message || "Failed to add patient");
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       alert("Server error");
//     });
// };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-gray-900">Add New Patient</h2>
            <p className="text-gray-600 text-sm mt-1">Enter patient details to create a new record</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">
                Patient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Rajesh Kumar"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-gray-700 mb-2">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="e.g., 45"
                min="1"
                max="120"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Contact */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.contact}
                onChange={handlePhoneChange}
                placeholder="+91-98765-43210"
                pattern="\+91-\d{5}-\d{5}"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-gray-500 text-sm mt-1">Format: +91-xxxxx-xxxxx</p>
            </div>

            {/* Diagnosis */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">
                Diagnosis <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                placeholder="e.g., Chronic TMJ Disorder"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-y"
                required
              />
            </div>

            {/* Last Visit */}
            <div>
              <label className="block text-gray-700 mb-2">
                Last Visit Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.lastVisitDate}
                onChange={(e) => setFormData({ ...formData, lastVisitDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Next Checkup */}
            <div>
              <label className="block text-gray-700 mb-2">
                Next Checkup Date
              </label>
              <input
                type="date"
                value={formData.nextCheckupDate}
                onChange={(e) => setFormData({ ...formData, nextCheckupDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-gray-700 mb-2">
                Patient Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'discharged' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="active">Active</option>
                <option value="discharged">Discharged</option>
              </select>
            </div>

            {/* Photo */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">
                Patient Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

           {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              type="button"
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add Patient
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}