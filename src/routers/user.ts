import { Router } from 'express';
import { login, loginwithGoogle, refreshToken, register } from '../controllers/user';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', loginwithGoogle);
router.post('/refresh-token', refreshToken);

export default router;