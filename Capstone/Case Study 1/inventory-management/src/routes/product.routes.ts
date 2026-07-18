import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All product routes require authentication
router.use(authMiddleware);

// List all products
router.get('/', ProductController.getAll);

// Create product (admin/manager only)
router.post('/', roleMiddleware(['ADMIN', 'MANAGER']), ProductController.create);

// Get products by category
router.get('/category/:category', ProductController.getByCategory);

// Get specific product
router.get('/:id', ProductController.getById);

// Update product (admin/manager only)
router.put('/:id', roleMiddleware(['ADMIN', 'MANAGER']), ProductController.update);

// Delete product (admin only)
router.delete('/:id', roleMiddleware(['ADMIN']), ProductController.delete);

export default router;
