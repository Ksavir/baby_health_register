import { graphqlRequest } from '@/lib/graphql';
import type { Vaccine } from '@/types';

const fields = `
  id
  babyId
  name
  recommendedAge
  appliedDate
  nextDoseDate
  status
  notes
`;

export async function getVaccines(babyId: number) {
  const query = `
    query Vaccines($babyId: Int!) {
      vaccines(babyId: $babyId) {
        ${fields}
      }
    }
  `;

  const data = await graphqlRequest<{ vaccines: Vaccine[] }>(query, { babyId });
  return data.vaccines;
}

export async function createVaccine(input: Omit<Vaccine, 'id'>) {
  const mutation = `
    mutation CreateVaccine($input: CreateVaccineInput!) {
      createVaccine(input: $input) {
        ${fields}
      }
    }
  `;

  const data = await graphqlRequest<{ createVaccine: Vaccine }>(mutation, { input });
  return data.createVaccine;
}
