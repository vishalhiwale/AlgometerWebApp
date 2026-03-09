export interface Patient {
  id: string

  patientCode: string   // add this

  name: string
  age: number
  gender: string
  contact: string
  diagnosis: string

  lastVisit?: string
  status?: string
  photo?: string
}

export interface MuscleReading {
  muscleName: string
  threshold: number
  tolerance: number
}
export interface AlgometerReading {
  id: string

  patientId: string
  patientCode: string
  patientName: string

  doctorName: string
  doctorNotes?: string

  readings: MuscleReading[]

  status: "saved" | "committed"

  timestamp?: string
}