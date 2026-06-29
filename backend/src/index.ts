import { createSchema, createYoga } from 'graphql-yoga';
import './db/connection';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/typeDefs';

const yoga = createYoga({
  graphqlEndpoint: '/graphql',
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: false,
  },
});

const server = Bun.serve({
  port: Number(process.env.PORT ?? 4000),
  fetch: yoga,
});

console.log(`GraphQL server running at http://localhost:${server.port}/graphql`);
