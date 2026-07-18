import { startServer } from './app';
import { startGRPCServer } from './grpc/server';

async function main() {
  try {
    console.log('🚀 Starting Inventory Management API...\n');

    // Start REST & GraphQL server
    await startServer();

    // Start gRPC server
    startGRPCServer();

    console.log('\n✅ All servers started successfully!\n');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
