export type User = {
  id: number;
  email: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type Baby = {
  id: number;
  userId: number;
  name: string;
  birthDate: string;
  gender: string | null;
  bloodType: string | null;
  allergies: string | null;
  pediatricianName: string | null;
  notes: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type Consultation = {
  id: number;
  babyId: number;
  consultationDate: string;
  doctorName: string;
  specialistType: string | null;
  weight: number | null;
  height: number | null;
  diagnosis: string | null;
  notes: string | null;
  medicinePrescribed: string | null;
  nextAppointmentDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type Vaccine = {
  id: number;
  babyId: number;
  name: string;
  recommendedAge: string | null;
  appliedDate: string | null;
  nextDoseDate: string | null;
  status: string;
  notes: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type Cost = {
  id: number;
  babyId: number;
  costDate: string;
  category: string;
  description: string | null;
  amount: number;
  createdAt: string | null;
  updatedAt: string | null;
};

export type DashboardSummary = {
  babyId: number;
  consultationsCount: number;
  vaccinesCount: number;
  pendingVaccinesCount: number;
  totalCosts: number;
  nextVaccineName: string | null;
  nextVaccineDate: string | null;
  lastConsultationDate: string | null;
};
