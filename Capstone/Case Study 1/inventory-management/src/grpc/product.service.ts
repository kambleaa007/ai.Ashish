import * as grpc from '@grpc/grpc-js';
import { ProductService } from '../services/product.service';
import { convertProductToGRPC } from './utils';
import { AppError } from '../utils/errors';

const productService = new ProductService();

export const productServiceImplementation = {
  createProduct: async (call: any, callback: grpc.sendUnaryData<any>) => {
    try {
      const { name, sku, description, price, category, supplier } = call.request;
      const product = await productService.createProduct({
        name,
        sku,
        description,
        price,
        category,
        supplier,
      });
      callback(null, convertProductToGRPC(product));
    } catch (error) {
      const err = error as AppError;
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: err.message || 'Failed to create product',
      });
    }
  },

  getProduct: async (call: any, callback: grpc.sendUnaryData<any>) => {
    try {
      const { value: id } = call.request;
      const product = await productService.getProduct(id);
      callback(null, convertProductToGRPC(product));
    } catch (error) {
      const err = error as AppError;
      callback({
        code: grpc.status.NOT_FOUND,
        message: err.message || 'Product not found',
      });
    }
  },

  updateProduct: async (call: any, callback: grpc.sendUnaryData<any>) => {
    try {
      const { id, name, sku, description, price, category, supplier } = call.request;
      const product = await productService.updateProduct(id, {
        name,
        sku,
        description,
        price,
        category,
        supplier,
      });
      callback(null, convertProductToGRPC(product));
    } catch (error) {
      const err = error as AppError;
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: err.message || 'Failed to update product',
      });
    }
  },

  deleteProduct: async (call: any, callback: grpc.sendUnaryData<any>) => {
    try {
      const { value: id } = call.request;
      const success = await productService.deleteProduct(id);
      callback(null, { success });
    } catch (error) {
      const err = error as AppError;
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: err.message || 'Failed to delete product',
      });
    }
  },

  listProducts: async (call: any, callback: grpc.sendUnaryData<any>) => {
    try {
      const { page = 1, limit = 10 } = call.request;
      const result = await productService.getAllProducts({ page, limit, sort: '', order: 'DESC' });
      callback(null, {
        products: result.data.map(convertProductToGRPC),
        pageInfo: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: 'Failed to list products',
      });
    }
  },

  getProductsByCategory: async (call: any, callback: grpc.sendUnaryData<any>) => {
    try {
      const { category, pagination } = call.request;
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const result = await productService.getProductsByCategory(category, { page, limit, sort: '', order: 'DESC' });
      callback(null, {
        products: result.data.map(convertProductToGRPC),
        pageInfo: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: 'Failed to get products by category',
      });
    }
  },
};
