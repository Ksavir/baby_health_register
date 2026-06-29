import { graphqlRequest } from '@/lib/graphql';
import type { User } from '@/types';

export async function registerUser(email: string, password: string) {
  const mutation = `
    mutation RegisterUser($input: RegisterUserInput!) {
      registerUser(input: $input) {
        id
        email
        createdAt
      }
    }
  `;

  const data = await graphqlRequest<{ registerUser: User }>(mutation, {
    input: { email, password },
  });

  return data.registerUser;
}

export async function loginUser(email: string, password: string) {
  const mutation = `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        id
        email
        createdAt
      }
    }
  `;

  const data = await graphqlRequest<{ login: User }>(mutation, {
    input: { email, password },
  });

  return data.login;
}
