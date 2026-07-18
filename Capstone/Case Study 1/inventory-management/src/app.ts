import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Middleware imports
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Route imports
import warehouseRoutes from './routes/warehouse.routes';
import productRoutes from './routes/product.routes';
import inventoryRoutes from './routes/inventory.routes';
import userRoutes from './routes/user.routes';

// GraphQL imports
import { createApolloServer } from './graphql/setup';

// Load environment variables
dotenv.config();

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));

const PORT = process.env.PORT || 3000;

export const startServer = async () => {
  // Create and start Apollo Server BEFORE body parser middleware
  const apolloServer = createApolloServer();
  await apolloServer.start();
  
  // FIX: Apply Apollo middleware before body-parser to prevent stream consumption conflicts
  apolloServer.applyMiddleware({ app: app as any, path: '/graphql' });

  // Body parsing middleware (AFTER Apollo)
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/warehouses', warehouseRoutes);
  app.use('/api/v1/products', productRoutes);
  app.use('/api/v1/inventory', inventoryRoutes);

  // Root endpoint
  app.get('/api/v1', (req, res) => {
    res.json({
      message: 'Inventory Management API',
      version: '1.0.0',
      endpoints: {
        users: '/api/v1/users',
        warehouses: '/api/v1/warehouses',
        products: '/api/v1/products',
        inventory: '/api/v1/inventory',
        graphql: '/graphql',
      },
    });
  });

  // Error handling (at the end)
  app.use(notFoundHandler);
  app.use(errorHandler);

  const server = app.listen(PORT, () => {
    console.log(`✓ REST API server running on http://localhost:${PORT}`);
    console.log(`✓ GraphQL server running on http://localhost:${PORT}/graphql`);
    console.log(`✓ Health check: http://localhost:${PORT}/health`);
    console.log(`✓ API root: http://localhost:${PORT}/api/v1`);
  });
  return { server, apolloServer };
};

export default app;
