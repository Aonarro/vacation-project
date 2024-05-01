import { Request, Response, Router } from 'express'
import { authenticateToken } from '../middlewares/auth-middleware'
import { login, register } from '../services/auth-service'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/protected', authenticateToken, (req: Request, res: Response) => {
	res.status(200).json({ message: 'Это защищенный маршрут' })
})

export default router
