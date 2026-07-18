import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All inventory routes require authentication
router.use(authMiddleware);

// List all inventory
router.get('/', InventoryController.getAll);

// Get low stock items
router.get('/status/low-stock', InventoryController.getLowStock);

// Create inventory (admin/manager only)
router.post('/', roleMiddleware(['ADMIN', 'MANAGER']), InventoryController.create);

// Get inventory by warehouse
router.get('/warehouse/:warehouseId', InventoryController.getByWarehouse);

// Get inventory by product
router.get('/product/:productId', InventoryController.getByProduct);

// Get specific inventory
router.get('/:id', InventoryController.getById);

// Update inventory quantity (manager/staff)
router.patch('/:id/quantity', roleMiddleware(['ADMIN', 'MANAGER', 'STAFF']), InventoryController.updateQuantity);

// Transfer inventory between warehouses (manager only)
router.post('/:id/transfer', roleMiddleware(['ADMIN', 'MANAGER']), InventoryController.transfer);

// Delete inventory (admin only)
router.delete('/:id', roleMiddleware(['ADMIN']), InventoryController.delete);

export default router;
