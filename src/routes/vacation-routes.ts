import { Router } from 'express'
import { authenticateToken } from '../middlewares/auth-middleware'
import { checkUserRole } from '../middlewares/verify-admin'
import { createVacation } from '../services/vacation-service'
import {
	deleteVacation,
	editVacation,
	getAllVacations,
} from '../services/vacation-service'
import { upload } from '../utils/multer-configuration'
import { addNewFollower, removeFollower } from '../services/follower-service'

const router = Router()

//get all
router.get('/', authenticateToken, getAllVacations)

//upload new vacation
router.post(
	'/new',
	authenticateToken,
	checkUserRole,
	upload.single('file'),
	createVacation
)

// edit vacation
router.put(
	'/:id([0-9]+)',
	authenticateToken,
	checkUserRole,
	upload.single('file'),
	editVacation
)
//delete vacation
router.delete('/:id([0-9]+)', authenticateToken, checkUserRole, deleteVacation)

router.post('/follow', authenticateToken, addNewFollower)
router.post('/unfollow', authenticateToken, removeFollower)

export default router
