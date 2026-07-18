import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Protected routes
router.use(authMiddleware);

// Get current user profile
router.get('/profile', UserController.getProfile);

// Admin-only routes
router.get('/', roleMiddleware(['ADMIN']), UserController.getAll);
router.put('/:id', roleMiddleware(['ADMIN']), UserController.update);
router.delete('/:id', roleMiddleware(['ADMIN']), UserController.delete);

export default router;
