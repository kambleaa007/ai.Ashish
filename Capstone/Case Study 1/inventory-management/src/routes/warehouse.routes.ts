import { Router } from 'express';
import { WarehouseController } from '../controllers/warehouse.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All warehouse routes require authentication
router.use(authMiddleware);

// List all warehouses
router.get('/', WarehouseController.getAll);

// Create warehouse (admin/manager only)
router.post('/', roleMiddleware(['ADMIN', 'MANAGER']), WarehouseController.create);

// Get specific warehouse
router.get('/:id', WarehouseController.getById);

// Update warehouse (admin/manager only)
router.put('/:id', roleMiddleware(['ADMIN', 'MANAGER']), WarehouseController.update);

// Delete warehouse (admin only)
router.delete('/:id', roleMiddleware(['ADMIN']), WarehouseController.delete);

export default router;
