import { graphqlRequest } from '@/lib/graphql';
import type { Consultation } from '@/types';

const fields = `
  id
  babyId
  consultationDate
  doctorName
  specialistType
  weight
  height
  diagnosis
  notes
  medicinePrescribed
  nextAppointmentDate
`;

export async function getConsultations(babyId: number) {
  const query = `
    query Consultations($babyId: Int!) {
      consultations(babyId: $babyId) {
        ${fields}
      }
    }
  `;

  const data = await graphqlRequest<{ consultations: Consultation[] }>(query, { babyId });
  return data.consultations;
}

export async function createConsultation(input: Omit<Consultation, 'id'>) {
  const mutation = `
    mutation CreateConsultation($input: CreateConsultationInput!) {
      createConsultation(input: $input) {
        ${fields}
      }
    }
  `;

  const data = await graphqlRequest<{ createConsultation: Consultation }>(mutation, { input });
  return data.createConsultation;
}
