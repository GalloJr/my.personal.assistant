import { Router } from 'express';
const router = Router();
import { register, login, profile } from '../controllers/authController';
import authMiddleware from '../middleware/authMiddleware';

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, profile);

export default router;
