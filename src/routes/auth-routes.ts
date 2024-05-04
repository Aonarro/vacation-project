import { Router } from 'express'
import { authenticateToken } from '../middlewares/auth-middleware'
import { autoLogin, login, registration } from '../services/auth-service'

const router = Router()

router.post('/registration', registration)
router.post('/login', login)

router.get('/auto-login', authenticateToken, autoLogin)

export default router
