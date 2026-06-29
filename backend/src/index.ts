import { createSchema, createYoga } from 'graphql-yoga';
import './db/connection';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/typeDefs';

const corsOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const yoga = createYoga({
  graphqlEndpoint: '/graphql',
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  cors: {
    origin: corsOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: false,
  },
});

const server = Bun.serve({
  port: Number(process.env.PORT ?? 4000),
  fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return Response.json({ status: 'ok' });
    }

    return yoga(request);
  },
});

console.log(`GraphQL server running at http://localhost:${server.port}/graphql`);
