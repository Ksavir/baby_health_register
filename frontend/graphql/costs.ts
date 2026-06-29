import { graphqlRequest } from '@/lib/graphql';
import type { Cost } from '@/types';

const fields = `
  id
  babyId
  costDate
  category
  description
  amount
`;

export async function getCosts(babyId: number) {
  const query = `
    query Costs($babyId: Int!) {
      costs(babyId: $babyId) {
        ${fields}
      }
    }
  `;

  const data = await graphqlRequest<{ costs: Cost[] }>(query, { babyId });
  return data.costs;
}

export async function createCost(input: Omit<Cost, 'id'>) {
  const mutation = `
    mutation CreateCost($input: CreateCostInput!) {
      createCost(input: $input) {
        ${fields}
      }
    }
  `;

  const data = await graphqlRequest<{ createCost: Cost }>(mutation, { input });
  return data.createCost;
}
