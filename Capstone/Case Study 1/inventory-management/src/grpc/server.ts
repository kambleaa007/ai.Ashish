import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';
import { inventoryServiceImplementation } from './inventory.service';
import { warehouseServiceImplementation } from './warehouse.service';
import { productServiceImplementation } from './product.service';

const PROTO_PATH = path.join(__dirname, '../../proto/inventory.proto');

interface ProtoType {
  [key: string]: any;
}

let protoDefinition: ProtoType;

const loadProto = () => {
  if (!protoDefinition) {
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    protoDefinition = grpc.loadPackageDefinition(packageDefinition) as ProtoType;
  }
  return protoDefinition;
};

export const startGRPCServer = () => {
  const proto = loadProto();
  const server = new grpc.Server();

  try {
    // Register services
    server.addService(proto.inventory.InventoryService.service, inventoryServiceImplementation);
    server.addService(proto.inventory.WarehouseService.service, warehouseServiceImplementation);
    server.addService(proto.inventory.ProductService.service, productServiceImplementation);

    const GRPC_PORT = process.env.GRPC_PORT || 50051;
    const grpcAddress = `0.0.0.0:${GRPC_PORT}`;

    server.bindAsync(grpcAddress, grpc.ServerCredentials.createInsecure(), (err, port) => {
      if (err) {
        console.error('Failed to bind gRPC server:', err);
        return;
      }
      console.log(`✓ gRPC server running on ${grpcAddress}`);
      server.start();
    });

    return server;
  } catch (error) {
    console.error('Failed to start gRPC server:', error);
    throw error;
  }
};

export const getProtoDefinition = () => {
  return loadProto();
};
