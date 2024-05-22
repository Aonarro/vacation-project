import { Router } from 'express'
import { authenticateToken } from '../middlewares/auth-middleware'
import { checkUserRole } from '../middlewares/verify-admin'
import { getAllVacationsForChart } from '../services/chart-service'

const router = Router()

router.get('/', authenticateToken, getAllVacationsForChart)

export default router
