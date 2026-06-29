import { graphqlRequest } from '@/lib/graphql';
import type { Baby, DashboardSummary } from '@/types';

const babyFields = `
  id
  userId
  name
  birthDate
  gender
  bloodType
  allergies
  pediatricianName
  notes
`;

export async function getBabies(userId: number) {
  const query = `
    query Babies($userId: Int!) {
      babies(userId: $userId) {
        ${babyFields}
      }
    }
  `;

  const data = await graphqlRequest<{ babies: Baby[] }>(query, { userId });
  return data.babies;
}

export async function getBaby(id: number) {
  const query = `
    query Baby($id: Int!) {
      baby(id: $id) {
        ${babyFields}
      }
    }
  `;

  const data = await graphqlRequest<{ baby: Baby | null }>(query, { id });
  return data.baby;
}

export async function createBaby(input: Omit<Baby, 'id'>) {
  const mutation = `
    mutation CreateBaby($input: CreateBabyInput!) {
      createBaby(input: $input) {
        ${babyFields}
      }
    }
  `;

  const data = await graphqlRequest<{ createBaby: Baby }>(mutation, { input });
  return data.createBaby;
}

export async function updateBaby(id: number, input: Partial<Omit<Baby, 'id' | 'userId'>>) {
  const mutation = `
    mutation UpdateBaby($id: Int!, $input: UpdateBabyInput!) {
      updateBaby(id: $id, input: $input) {
        ${babyFields}
      }
    }
  `;

  const data = await graphqlRequest<{ updateBaby: Baby }>(mutation, { id, input });
  return data.updateBaby;
}

export async function getDashboardSummary(babyId: number) {
  const query = `
    query DashboardSummary($babyId: Int!) {
      dashboardSummary(babyId: $babyId) {
        babyId
        consultationsCount
        vaccinesCount
        pendingVaccinesCount
        totalCosts
        nextVaccineName
        nextVaccineDate
        lastConsultationDate
      }
    }
  `;

  const data = await graphqlRequest<{ dashboardSummary: DashboardSummary }>(query, { babyId });
  return data.dashboardSummary;
}
