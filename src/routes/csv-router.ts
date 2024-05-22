import { Router } from 'express'
import { authenticateToken } from '../middlewares/auth-middleware'
import { getAllVacationsForChart } from '../services/chart-service'
import { getFollowersForCsv } from '../services/csv-service'

const router = Router()

router.get('/', authenticateToken, getFollowersForCsv)

export default router
