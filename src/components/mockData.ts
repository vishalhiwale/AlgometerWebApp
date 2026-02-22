export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  diagnosis: string;
  lastVisit: string;
  nextCheckup: string | null;
  totalVisits: number;
  status?: 'active' | 'discharged';
  hasReadings?: boolean;
  photo?: string; // Base64 encoded image or URL
}

export interface LocationReading {
  location: string; // e.g., "Neck (Upper Trapezius)"
  ppt: number | null; // Pain Pressure Threshold
  pptol: number | null; // Pain Pressure Tolerance
}

export interface AlgometerReading {
  id: string;
  patientId: string | null; // null means unassigned
  patientName?: string;
  readings: LocationReading[]; // Array of location-based readings
  doctorNotes: string;
  timestamp: string;
  takenBy: string; // Doctor name
  status: 'saved' | 'committed'; // saved = temporary, committed = in database
}

export const mockPatients: Patient[] = [
  {
    id: 'P001',
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    contact: '+91-98765-43210',
    diagnosis: 'Chronic TMJ Disorder',
    lastVisit: '2025-02-02',
    nextCheckup: '2025-02-09',
    totalVisits: 12,
    status: 'active',
    hasReadings: true
  },
  {
    id: 'P002',
    name: 'Priya Sharma',
    age: 38,
    gender: 'Female',
    contact: '+91-98765-43211',
    diagnosis: 'Myofascial Pain Syndrome',
    lastVisit: '2025-02-01',
    nextCheckup: '2025-02-08',
    totalVisits: 8,
    status: 'active',
    hasReadings: true
  },
  {
    id: 'P003',
    name: 'Amit Patel',
    age: 52,
    gender: 'Male',
    contact: '+91-98765-43212',
    diagnosis: 'Trigeminal Neuralgia',
    lastVisit: '2025-01-30',
    nextCheckup: '2025-02-07',
    totalVisits: 15,
    status: 'active',
    hasReadings: true
  },
  {
    id: 'P004',
    name: 'Sneha Reddy',
    age: 29,
    gender: 'Female',
    contact: '+91-98765-43213',
    diagnosis: 'Tension Headaches',
    lastVisit: '2025-01-28',
    nextCheckup: '2025-02-05',
    totalVisits: 6,
    status: 'active',
    hasReadings: true
  },
  {
    id: 'P005',
    name: 'Vikram Singh',
    age: 41,
    gender: 'Male',
    contact: '+91-98765-43214',
    diagnosis: 'Fibromyalgia',
    lastVisit: '2025-01-27',
    nextCheckup: '2025-02-04',
    totalVisits: 20,
    status: 'active',
    hasReadings: true
  },
  {
    id: 'P006',
    name: 'Anjali Desai',
    age: 35,
    gender: 'Female',
    contact: '+91-98765-43215',
    diagnosis: 'Chronic Facial Pain',
    lastVisit: '2025-01-25',
    nextCheckup: '2025-02-02',
    totalVisits: 10,
    status: 'active',
    hasReadings: true
  },
  {
    id: 'P007',
    name: 'Karan Mehta',
    age: 48,
    gender: 'Male',
    contact: '+91-98765-43216',
    diagnosis: 'Temporomandibular Disorder',
    lastVisit: '2025-01-24',
    nextCheckup: null,
    totalVisits: 5,
    status: 'discharged'
  },
  {
    id: 'P008',
    name: 'Deepika Iyer',
    age: 33,
    gender: 'Female',
    contact: '+91-98765-43217',
    diagnosis: 'Cluster Headaches',
    lastVisit: '2025-01-22',
    nextCheckup: '2025-02-06',
    totalVisits: 14,
    status: 'active',
    hasReadings: true
  },
  {
    id: 'P009',
    name: 'Arjun Nair',
    age: 56,
    gender: 'Male',
    contact: '+91-98765-43218',
    diagnosis: 'Neuropathic Pain',
    lastVisit: '2025-01-20',
    nextCheckup: '2025-01-27',
    totalVisits: 18,
    status: 'active',
    hasReadings: true
  },
  {
    id: 'P010',
    name: 'Kavya Krishnan',
    age: 42,
    gender: 'Female',
    contact: '+91-98765-43219',
    diagnosis: 'Migraine with Aura',
    lastVisit: '2025-01-18',
    nextCheckup: '2025-01-25',
    totalVisits: 9,
    status: 'active',
    hasReadings: true
  },
  {
    id: 'P011',
    name: 'Rahul Gupta',
    age: 39,
    gender: 'Male',
    contact: '+91-98765-43220',
    diagnosis: 'Chronic Pain Syndrome',
    lastVisit: '2025-01-15',
    nextCheckup: '2025-02-01',
    totalVisits: 22,
    status: 'active',
    hasReadings: true
  },
  {
    id: 'P012',
    name: 'Meera Joshi',
    age: 31,
    gender: 'Female',
    contact: '+91-98765-43221',
    diagnosis: 'TMJ Arthritis',
    lastVisit: '2025-01-12',
    nextCheckup: '2025-01-26',
    totalVisits: 7,
    status: 'active',
    hasReadings: true
  },
  {
    id: 'P013',
    name: 'Suresh Rao',
    age: 47,
    gender: 'Male',
    contact: '+91-98765-43222',
    diagnosis: 'Muscle Tension Disorder',
    lastVisit: '2025-01-10',
    nextCheckup: null,
    totalVisits: 11,
    status: 'discharged'
  },
  {
    id: 'P014',
    name: 'Pooja Kapoor',
    age: 36,
    gender: 'Female',
    contact: '+91-98765-43223',
    diagnosis: 'Cervicogenic Headache',
    lastVisit: '2025-01-08',
    nextCheckup: '2025-02-03',
    totalVisits: 13,
    status: 'active'
  },
  {
    id: 'P015',
    name: 'Sanjay Verma',
    age: 50,
    gender: 'Male',
    contact: '+91-98765-43224',
    diagnosis: 'Facial Nerve Pain',
    lastVisit: '2025-01-05',
    nextCheckup: null,
    totalVisits: 16,
    status: 'discharged'
  },
  {
    id: 'P016',
    name: 'Vishal Hiwale',
    age: 34,
    gender: 'Male',
    contact: '+91-98765-43225',
    diagnosis: 'Temporomandibular Joint Pain',
    lastVisit: '2025-02-03',
    nextCheckup: '2025-02-10',
    totalVisits: 2,
    status: 'active',
    hasReadings: false
  }
];

export const mockAlgometerReadings: AlgometerReading[] = [
  // Rajesh Kumar - Multiple Checkups (showing progression over time)
  // Checkup 1 - Baseline (Jan 8, 2025)
  {
    id: 'R001',
    patientId: 'P001',
    patientName: 'Rajesh Kumar',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 220, pptol: 450 },
      { location: 'Jaw (Masseter)', ppt: 140, pptol: 350 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 350, pptol: 650 },
      { location: 'Lower Back (Erector Spinae)', ppt: 360, pptol: 600 },
    ],
    doctorNotes: 'Baseline measurements taken. Patient reports moderate pain in jaw and neck area.',
    timestamp: '2025-01-08T10:00:00Z',
    takenBy: 'Dr. Sharma',
    status: 'committed'
  },
  // Checkup 2 - Progress (Jan 15, 2025)
  {
    id: 'R002',
    patientId: 'P001',
    patientName: 'Rajesh Kumar',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 235, pptol: 475 },
      { location: 'Jaw (Masseter)', ppt: 155, pptol: 370 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 365, pptol: 670 },
      { location: 'Lower Back (Erector Spinae)', ppt: 370, pptol: 620 },
    ],
    doctorNotes: 'Slight improvement noted. Continue current treatment plan.',
    timestamp: '2025-01-15T10:30:00Z',
    takenBy: 'Dr. Sharma',
    status: 'committed'
  },
  // Checkup 3 - Progress (Jan 22, 2025)
  {
    id: 'R003',
    patientId: 'P001',
    patientName: 'Rajesh Kumar',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 250, pptol: 500 },
      { location: 'Jaw (Masseter)', ppt: 170, pptol: 390 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 380, pptol: 690 },
      { location: 'Lower Back (Erector Spinae)', ppt: 375, pptol: 640 },
    ],
    doctorNotes: 'Patient showing consistent progress. Pain threshold increasing in all areas.',
    timestamp: '2025-01-22T11:00:00Z',
    takenBy: 'Dr. Patel',
    status: 'committed'
  },
  // Checkup 4 - Progress (Jan 29, 2025)
  {
    id: 'R004',
    patientId: 'P001',
    patientName: 'Rajesh Kumar',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 265, pptol: 525 },
      { location: 'Jaw (Masseter)', ppt: 185, pptol: 410 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 395, pptol: 710 },
      { location: 'Lower Back (Erector Spinae)', ppt: 380, pptol: 660 },
    ],
    doctorNotes: 'Good progress. Patient reports reduced TMJ pain and improved jaw mobility.',
    timestamp: '2025-01-29T09:45:00Z',
    takenBy: 'Dr. Reddy',
    status: 'committed'
  },
  // Checkup 5 - Latest (Feb 2, 2025)
  {
    id: 'R005',
    patientId: 'P001',
    patientName: 'Rajesh Kumar',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 280, pptol: 550 },
      { location: 'Jaw (Masseter)', ppt: 200, pptol: 430 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 410, pptol: 730 },
      { location: 'Lower Back (Erector Spinae)', ppt: 385, pptol: 680 },
    ],
    doctorNotes: 'Excellent progress. Patient reports significant improvement. Continue maintenance therapy.',
    timestamp: '2025-02-02T10:00:00Z',
    takenBy: 'Dr. Sharma',
    status: 'committed'
  },
  
  // Priya Sharma - Multiple Checkups
  // Checkup 1 - Baseline (Jan 10, 2025)
  {
    id: 'R006',
    patientId: 'P002',
    patientName: 'Priya Sharma',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 210, pptol: 440 },
      { location: 'Jaw (Masseter)', ppt: 150, pptol: 360 },
      { location: 'Thigh (Quadriceps/Vastus Medialis)', ppt: 310, pptol: 700 },
      { location: 'Lower Leg (Tibialis Anterior)', ppt: 365, pptol: 850 },
    ],
    doctorNotes: 'Initial assessment for myofascial pain syndrome. Multiple tender points identified.',
    timestamp: '2025-01-10T11:00:00Z',
    takenBy: 'Dr. Johnson',
    status: 'committed'
  },
  // Checkup 2 - Progress (Jan 17, 2025)
  {
    id: 'R007',
    patientId: 'P002',
    patientName: 'Priya Sharma',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 225, pptol: 465 },
      { location: 'Jaw (Masseter)', ppt: 162, pptol: 380 },
      { location: 'Thigh (Quadriceps/Vastus Medialis)', ppt: 330, pptol: 730 },
      { location: 'Lower Leg (Tibialis Anterior)', ppt: 385, pptol: 880 },
    ],
    doctorNotes: 'Responding well to physical therapy. Noticeable improvement in thigh region.',
    timestamp: '2025-01-17T14:30:00Z',
    takenBy: 'Dr. Johnson',
    status: 'committed'
  },
  // Checkup 3 - Progress (Jan 24, 2025)
  {
    id: 'R008',
    patientId: 'P002',
    patientName: 'Priya Sharma',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 242, pptol: 490 },
      { location: 'Jaw (Masseter)', ppt: 175, pptol: 400 },
      { location: 'Thigh (Quadriceps/Vastus Medialis)', ppt: 352, pptol: 765 },
      { location: 'Lower Leg (Tibialis Anterior)', ppt: 405, pptol: 920 },
    ],
    doctorNotes: 'Continued improvement. Patient reports better sleep quality and reduced morning stiffness.',
    timestamp: '2025-01-24T10:15:00Z',
    takenBy: 'Dr. Patel',
    status: 'committed'
  },
  // Checkup 4 - Latest (Feb 1, 2025)
  {
    id: 'R009',
    patientId: 'P002',
    patientName: 'Priya Sharma',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 258, pptol: 515 },
      { location: 'Jaw (Masseter)', ppt: 188, pptol: 420 },
      { location: 'Thigh (Quadriceps/Vastus Medialis)', ppt: 370, pptol: 795 },
      { location: 'Lower Leg (Tibialis Anterior)', ppt: 425, pptol: 960 },
    ],
    doctorNotes: 'Significant improvement across all measurement points. Reduce treatment frequency to bi-weekly.',
    timestamp: '2025-02-01T11:00:00Z',
    takenBy: 'Dr. Johnson',
    status: 'committed'
  },
  
  // Amit Patel (P003) - Trigeminal Neuralgia - 3 Checkups
  {
    id: 'R013',
    patientId: 'P003',
    patientName: 'Amit Patel',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 215, pptol: 445 },
      { location: 'Jaw (Masseter)', ppt: 145, pptol: 355 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 355, pptol: 655 },
    ],
    doctorNotes: 'Baseline assessment. Severe facial pain reported, particularly in jaw region.',
    timestamp: '2025-01-12T09:00:00Z',
    takenBy: 'Dr. Sharma',
    status: 'committed'
  },
  {
    id: 'R014',
    patientId: 'P003',
    patientName: 'Amit Patel',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 230, pptol: 470 },
      { location: 'Jaw (Masseter)', ppt: 160, pptol: 375 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 370, pptol: 675 },
    ],
    doctorNotes: 'Medication showing positive effects. Pain episodes less frequent.',
    timestamp: '2025-01-21T10:30:00Z',
    takenBy: 'Dr. Patel',
    status: 'committed'
  },
  {
    id: 'R015',
    patientId: 'P003',
    patientName: 'Amit Patel',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 248, pptol: 495 },
      { location: 'Jaw (Masseter)', ppt: 175, pptol: 395 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 385, pptol: 695 },
    ],
    doctorNotes: 'Good progress. Patient reports significant reduction in pain intensity.',
    timestamp: '2025-01-30T11:15:00Z',
    takenBy: 'Dr. Sharma',
    status: 'committed'
  },
  
  // Sneha Reddy (P004) - Tension Headaches - 3 Checkups
  {
    id: 'R016',
    patientId: 'P004',
    patientName: 'Sneha Reddy',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 225, pptol: 460 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 360, pptol: 660 },
      { location: 'Lower Back (Erector Spinae)', ppt: 365, pptol: 610 },
    ],
    doctorNotes: 'Young patient with work-related tension headaches. Neck muscles very tight.',
    timestamp: '2025-01-14T14:00:00Z',
    takenBy: 'Dr. Johnson',
    status: 'committed'
  },
  {
    id: 'R017',
    patientId: 'P004',
    patientName: 'Sneha Reddy',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 245, pptol: 485 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 378, pptol: 682 },
      { location: 'Lower Back (Erector Spinae)', ppt: 373, pptol: 630 },
    ],
    doctorNotes: 'Ergonomic adjustments helping. Recommend continued physiotherapy.',
    timestamp: '2025-01-21T15:30:00Z',
    takenBy: 'Dr. Reddy',
    status: 'committed'
  },
  {
    id: 'R018',
    patientId: 'P004',
    patientName: 'Sneha Reddy',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 262, pptol: 508 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 395, pptol: 705 },
      { location: 'Lower Back (Erector Spinae)', ppt: 380, pptol: 650 },
    ],
    doctorNotes: 'Excellent improvement. Headache frequency reduced significantly.',
    timestamp: '2025-01-28T14:45:00Z',
    takenBy: 'Dr. Johnson',
    status: 'committed'
  },
  
  // Vikram Singh (P005) - Fibromyalgia - 4 Checkups
  {
    id: 'R019',
    patientId: 'P005',
    patientName: 'Vikram Singh',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 205, pptol: 435 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 345, pptol: 645 },
      { location: 'Lower Back (Erector Spinae)', ppt: 358, pptol: 595 },
      { location: 'Thigh (Quadriceps/Vastus Medialis)', ppt: 305, pptol: 695 },
      { location: 'Lower Leg (Tibialis Anterior)', ppt: 360, pptol: 845 },
    ],
    doctorNotes: 'Fibromyalgia patient. Widespread pain noted. Multiple tender points.',
    timestamp: '2025-01-06T10:00:00Z',
    takenBy: 'Dr. Sharma',
    status: 'committed'
  },
  {
    id: 'R020',
    patientId: 'P005',
    patientName: 'Vikram Singh',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 218, pptol: 455 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 358, pptol: 662 },
      { location: 'Lower Back (Erector Spinae)', ppt: 365, pptol: 612 },
      { location: 'Thigh (Quadriceps/Vastus Medialis)', ppt: 318, pptol: 715 },
      { location: 'Lower Leg (Tibialis Anterior)', ppt: 375, pptol: 865 },
    ],
    doctorNotes: 'Slow but steady improvement. Medication dosage adjusted.',
    timestamp: '2025-01-13T11:00:00Z',
    takenBy: 'Dr. Patel',
    status: 'committed'
  },
  {
    id: 'R021',
    patientId: 'P005',
    patientName: 'Vikram Singh',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 232, pptol: 475 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 372, pptol: 680 },
      { location: 'Lower Back (Erector Spinae)', ppt: 370, pptol: 630 },
      { location: 'Thigh (Quadriceps/Vastus Medialis)', ppt: 332, pptol: 738 },
      { location: 'Lower Leg (Tibialis Anterior)', ppt: 390, pptol: 888 },
    ],
    doctorNotes: 'Gradual improvement across all measurement points. Continue current regimen.',
    timestamp: '2025-01-20T09:30:00Z',
    takenBy: 'Dr. Johnson',
    status: 'committed'
  },
  {
    id: 'R022',
    patientId: 'P005',
    patientName: 'Vikram Singh',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 245, pptol: 495 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 385, pptol: 698 },
      { location: 'Lower Back (Erector Spinae)', ppt: 375, pptol: 648 },
      { location: 'Thigh (Quadriceps/Vastus Medialis)', ppt: 345, pptol: 758 },
      { location: 'Lower Leg (Tibialis Anterior)', ppt: 405, pptol: 910 },
    ],
    doctorNotes: 'Positive trend continues. Patient reports better quality of life.',
    timestamp: '2025-01-27T10:15:00Z',
    takenBy: 'Dr. Sharma',
    status: 'committed'
  },
  
  // Anjali Desai (P006) - Chronic Facial Pain - 3 Checkups
  {
    id: 'R023',
    patientId: 'P006',
    patientName: 'Anjali Desai',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 218, pptol: 448 },
      { location: 'Jaw (Masseter)', ppt: 148, pptol: 358 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 352, pptol: 652 },
    ],
    doctorNotes: 'Chronic facial pain assessment. Jaw tenderness noted bilaterally.',
    timestamp: '2025-01-11T13:00:00Z',
    takenBy: 'Dr. Patel',
    status: 'committed'
  },
  {
    id: 'R024',
    patientId: 'P006',
    patientName: 'Anjali Desai',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 235, pptol: 472 },
      { location: 'Jaw (Masseter)', ppt: 163, pptol: 378 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 368, pptol: 672 },
    ],
    doctorNotes: 'Dental splint showing benefits. Pain levels decreasing.',
    timestamp: '2025-01-18T14:30:00Z',
    takenBy: 'Dr. Reddy',
    status: 'committed'
  },
  {
    id: 'R025',
    patientId: 'P006',
    patientName: 'Anjali Desai',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 252, pptol: 498 },
      { location: 'Jaw (Masseter)', ppt: 178, pptol: 398 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 383, pptol: 690 },
    ],
    doctorNotes: 'Good progress. Patient can eat normally again without significant pain.',
    timestamp: '2025-01-25T13:45:00Z',
    takenBy: 'Dr. Patel',
    status: 'committed'
  },
  
  // Deepika Iyer (P008) - Cluster Headaches - 3 Checkups
  {
    id: 'R026',
    patientId: 'P008',
    patientName: 'Deepika Iyer',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 212, pptol: 442 },
      { location: 'Jaw (Masseter)', ppt: 152, pptol: 362 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 358, pptol: 658 },
    ],
    doctorNotes: 'Cluster headache patient. Measuring during remission period.',
    timestamp: '2025-01-09T10:30:00Z',
    takenBy: 'Dr. Johnson',
    status: 'committed'
  },
  {
    id: 'R027',
    patientId: 'P008',
    patientName: 'Deepika Iyer',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 228, pptol: 465 },
      { location: 'Jaw (Masseter)', ppt: 167, pptol: 382 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 373, pptol: 678 },
    ],
    doctorNotes: 'Preventive medication working well. No cluster episodes this week.',
    timestamp: '2025-01-15T11:45:00Z',
    takenBy: 'Dr. Sharma',
    status: 'committed'
  },
  {
    id: 'R028',
    patientId: 'P008',
    patientName: 'Deepika Iyer',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 244, pptol: 488 },
      { location: 'Jaw (Masseter)', ppt: 182, pptol: 402 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 388, pptol: 698 },
    ],
    doctorNotes: 'Extended remission period. Patient very satisfied with treatment.',
    timestamp: '2025-01-22T12:00:00Z',
    takenBy: 'Dr. Johnson',
    status: 'committed'
  },
  
  // Arjun Nair (P009) - Neuropathic Pain - 4 Checkups
  {
    id: 'R029',
    patientId: 'P009',
    patientName: 'Arjun Nair',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 208, pptol: 438 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 348, pptol: 648 },
      { location: 'Lower Back (Erector Spinae)', ppt: 362, pptol: 602 },
      { location: 'Lower Leg (Tibialis Anterior)', ppt: 368, pptol: 858 },
    ],
    doctorNotes: 'Neuropathic pain baseline. Burning sensation in extremities reported.',
    timestamp: '2025-01-03T09:00:00Z',
    takenBy: 'Dr. Patel',
    status: 'committed'
  },
  {
    id: 'R030',
    patientId: 'P009',
    patientName: 'Arjun Nair',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 222, pptol: 458 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 362, pptol: 668 },
      { location: 'Lower Back (Erector Spinae)', ppt: 368, pptol: 618 },
      { location: 'Lower Leg (Tibialis Anterior)', ppt: 382, pptol: 878 },
    ],
    doctorNotes: 'Gabapentin dosage increased. Patient tolerating well.',
    timestamp: '2025-01-10T10:00:00Z',
    takenBy: 'Dr. Reddy',
    status: 'committed'
  },
  {
    id: 'R031',
    patientId: 'P009',
    patientName: 'Arjun Nair',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 236, pptol: 478 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 376, pptol: 686 },
      { location: 'Lower Back (Erector Spinae)', ppt: 372, pptol: 635 },
      { location: 'Lower Leg (Tibialis Anterior)', ppt: 396, pptol: 898 },
    ],
    doctorNotes: 'Neuropathic symptoms reducing. Sleep quality improved.',
    timestamp: '2025-01-17T11:30:00Z',
    takenBy: 'Dr. Sharma',
    status: 'committed'
  },
  {
    id: 'R032',
    patientId: 'P009',
    patientName: 'Arjun Nair',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 250, pptol: 498 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 390, pptol: 704 },
      { location: 'Lower Back (Erector Spinae)', ppt: 378, pptol: 652 },
      { location: 'Lower Leg (Tibialis Anterior)', ppt: 410, pptol: 918 },
    ],
    doctorNotes: 'Continued improvement. Patient able to resume light activities.',
    timestamp: '2025-01-20T09:45:00Z',
    takenBy: 'Dr. Patel',
    status: 'committed'
  },
  
  // Kavya Krishnan (P010) - Migraine with Aura - 3 Checkups
  {
    id: 'R033',
    patientId: 'P010',
    patientName: 'Kavya Krishnan',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 216, pptol: 446 },
      { location: 'Jaw (Masseter)', ppt: 154, pptol: 364 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 362, pptol: 662 },
    ],
    doctorNotes: 'Migraine patient. Neck tension contributing to attacks.',
    timestamp: '2025-01-05T13:00:00Z',
    takenBy: 'Dr. Johnson',
    status: 'committed'
  },
  {
    id: 'R034',
    patientId: 'P010',
    patientName: 'Kavya Krishnan',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 233, pptol: 470 },
      { location: 'Jaw (Masseter)', ppt: 169, pptol: 384 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 377, pptol: 682 },
    ],
    doctorNotes: 'Prophylactic treatment started. Migraine frequency reducing.',
    timestamp: '2025-01-11T14:15:00Z',
    takenBy: 'Dr. Reddy',
    status: 'committed'
  },
  {
    id: 'R035',
    patientId: 'P010',
    patientName: 'Kavya Krishnan',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 249, pptol: 494 },
      { location: 'Jaw (Masseter)', ppt: 184, pptol: 404 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 392, pptol: 700 },
    ],
    doctorNotes: 'Only one mild migraine episode this month. Significant improvement.',
    timestamp: '2025-01-18T13:30:00Z',
    takenBy: 'Dr. Johnson',
    status: 'committed'
  },
  
  // Rahul Gupta (P011) - Chronic Pain Syndrome - 5 Checkups
  {
    id: 'R036',
    patientId: 'P011',
    patientName: 'Rahul Gupta',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 198, pptol: 428 },
      { location: 'Jaw (Masseter)', ppt: 138, pptol: 348 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 342, pptol: 642 },
      { location: 'Lower Back (Erector Spinae)', ppt: 355, pptol: 592 },
      { location: 'Thigh (Quadriceps/Vastus Medialis)', ppt: 302, pptol: 692 },
    ],
    doctorNotes: 'Chronic pain syndrome. Long history of pain. Baseline very low.',
    timestamp: '2024-12-20T10:00:00Z',
    takenBy: 'Dr. Sharma',
    status: 'committed'
  },
  {
    id: 'R037',
    patientId: 'P011',
    patientName: 'Rahul Gupta',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 212, pptol: 448 },
      { location: 'Jaw (Masseter)', ppt: 148, pptol: 360 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 355, pptol: 658 },
      { location: 'Lower Back (Erector Spinae)', ppt: 363, pptol: 608 },
      { location: 'Thigh (Quadriceps/Vastus Medialis)', ppt: 315, pptol: 708 },
    ],
    doctorNotes: 'Multidisciplinary approach initiated. Slight improvement noted.',
    timestamp: '2024-12-27T11:00:00Z',
    takenBy: 'Dr. Patel',
    status: 'committed'
  },
  {
    id: 'R038',
    patientId: 'P011',
    patientName: 'Rahul Gupta',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 226, pptol: 468 },
      { location: 'Jaw (Masseter)', ppt: 158, pptol: 372 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 368, pptol: 674 },
      { location: 'Lower Back (Erector Spinae)', ppt: 368, pptol: 624 },
      { location: 'Thigh (Quadriceps/Vastus Medialis)', ppt: 328, pptol: 724 },
    ],
    doctorNotes: 'Combination therapy showing promise. Patient more optimistic.',
    timestamp: '2025-01-03T09:30:00Z',
    takenBy: 'Dr. Johnson',
    status: 'committed'
  },
  {
    id: 'R039',
    patientId: 'P011',
    patientName: 'Rahul Gupta',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 240, pptol: 486 },
      { location: 'Jaw (Masseter)', ppt: 168, pptol: 384 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 381, pptol: 690 },
      { location: 'Lower Back (Erector Spinae)', ppt: 373, pptol: 640 },
      { location: 'Thigh (Quadriceps/Vastus Medialis)', ppt: 341, pptol: 740 },
    ],
    doctorNotes: 'Steady progress. Able to return to part-time work.',
    timestamp: '2025-01-08T10:15:00Z',
    takenBy: 'Dr. Reddy',
    status: 'committed'
  },
  {
    id: 'R040',
    patientId: 'P011',
    patientName: 'Rahul Gupta',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 254, pptol: 504 },
      { location: 'Jaw (Masseter)', ppt: 178, pptol: 396 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 394, pptol: 706 },
      { location: 'Lower Back (Erector Spinae)', ppt: 378, pptol: 656 },
      { location: 'Thigh (Quadriceps/Vastus Medialis)', ppt: 354, pptol: 756 },
    ],
    doctorNotes: 'Remarkable improvement. Quality of life significantly enhanced.',
    timestamp: '2025-01-15T11:00:00Z',
    takenBy: 'Dr. Sharma',
    status: 'committed'
  },
  
  // Meera Joshi (P012) - TMJ Arthritis - 3 Checkups
  {
    id: 'R041',
    patientId: 'P012',
    patientName: 'Meera Joshi',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 214, pptol: 444 },
      { location: 'Jaw (Masseter)', ppt: 142, pptol: 352 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 354, pptol: 654 },
    ],
    doctorNotes: 'TMJ arthritis diagnosis. Severe jaw clicking and pain during chewing.',
    timestamp: '2024-12-29T14:00:00Z',
    takenBy: 'Dr. Patel',
    status: 'committed'
  },
  {
    id: 'R042',
    patientId: 'P012',
    patientName: 'Meera Joshi',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 230, pptol: 468 },
      { location: 'Jaw (Masseter)', ppt: 157, pptol: 372 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 369, pptol: 674 },
    ],
    doctorNotes: 'Anti-inflammatory treatment and jaw exercises helping.',
    timestamp: '2025-01-05T15:00:00Z',
    takenBy: 'Dr. Sharma',
    status: 'committed'
  },
  {
    id: 'R043',
    patientId: 'P012',
    patientName: 'Meera Joshi',
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 246, pptol: 490 },
      { location: 'Jaw (Masseter)', ppt: 172, pptol: 392 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 384, pptol: 692 },
    ],
    doctorNotes: 'Pain reduced. Jaw mobility improved. Continue current treatment.',
    timestamp: '2025-01-12T14:30:00Z',
    takenBy: 'Dr. Patel',
    status: 'committed'
  },
  
  // Unassigned readings (saved, not committed)
  {
    id: 'R010',
    patientId: null,
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 240, pptol: 480 },
      { location: 'Jaw (Masseter)', ppt: 160, pptol: 380 },
      { location: 'Forearm (Extensor Carpi Radialis)', ppt: 370, pptol: 680 },
    ],
    doctorNotes: 'Routine measurement for new assessment. Patient shows good pain tolerance.',
    timestamp: '2025-02-03T09:30:00Z',
    takenBy: 'Dr. Sharma',
    status: 'saved'
  },
  {
    id: 'R011',
    patientId: null,
    readings: [
      { location: 'Lower Back (Erector Spinae)', ppt: 365, pptol: 620 },
      { location: 'Thigh (Quadriceps/Vastus Medialis)', ppt: 340, pptol: 750 },
      { location: 'Lower Leg (Tibialis Anterior)', ppt: 390, pptol: 890 },
    ],
    doctorNotes: 'Follow-up measurements needed for analysis.',
    timestamp: '2025-02-03T14:15:00Z',
    takenBy: 'Dr. Patel',
    status: 'saved'
  },
  {
    id: 'R012',
    patientId: null,
    readings: [
      { location: 'Neck (Upper Trapezius)', ppt: 230, pptol: 470 },
      { location: 'Ankle (Tibialis Posterior/Anterior)', ppt: 465, pptol: 820 },
    ],
    doctorNotes: 'Initial screening completed. Awaiting patient assignment.',
    timestamp: '2025-02-04T11:00:00Z',
    takenBy: 'Dr. Reddy',
    status: 'saved'
  }
];