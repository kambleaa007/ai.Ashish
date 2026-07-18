import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './typedefs';
import { resolvers } from './resolvers';
import { UserService } from '../services/user.service';
import { UnauthorizedError } from '../utils/errors';

const userService = new UserService();

export interface GraphQLContext {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const createApolloServer = (): ApolloServer => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }): Promise<GraphQLContext> => {
      const context: GraphQLContext = {};

      // Extract token from Authorization header
      const authHeader = req?.headers?.authorization;
      if (authHeader) {
        try {
          const parts = authHeader.split(' ');
          if (parts.length === 2 && parts[0] === 'Bearer') {
            const token = parts[1];
            const payload = userService.verifyToken(token);
            context.user = {
              id: payload.id,
              email: payload.email,
              role: payload.role,
            };
          }
        } catch (error) {
          // Token validation failed, but we allow unauthenticated access for public queries
          // Authentication is checked per-resolver
        }
      }

      return context;
    },
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        extensions: {
          code: (error.extensions?.code as string) || 'INTERNAL_ERROR',
        },
      };
    },
    introspection: true,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              // Cleanup logic if needed
            },
          };
        },
      },
    ],
  });
};
