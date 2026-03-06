export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  diagnosis: string;
  lastVisit: string;
  status?: string;
  photo?: string;
};

export type LocationReading = {
  muscle: string;
  ppt: number | null;
  pptol: number | null;
};

export type AlgometerReading = {
  id: string;
  patientId: string;
  patientName?: string;
  readings: LocationReading[];
  doctorNotes?: string;
  takenBy: string;
  status: "saved" | "committed";
  sessionTime?: string;
};