const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const result = (await response.json()) as GraphQLResponse<T>;

  if (!response.ok) {
    throw new Error('Network error while calling GraphQL API');
  }

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors[0].message);
  }

  if (!result.data) {
    throw new Error('No data returned from GraphQL API');
  }

  return result.data;
}
