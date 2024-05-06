import { Router } from 'express'
import { authenticateToken } from '../middlewares/auth-middleware'
import { checkUserRole } from '../middlewares/verify-admin'
import { uploadImg } from '../services/img-service'
import {
	deleteVacation,
	editVacation,
	getAllVacations,
	getOneVacation,
	postNewVacation,
} from '../services/vacation-service'
import { upload } from '../utils/multer-configuration'

const router = Router()

//get all
router.get('/', authenticateToken, getAllVacations)

//get by id
router.get('/:id([0-9]+)', authenticateToken, getOneVacation)

//upload new vacation
router.post('/', authenticateToken, checkUserRole, postNewVacation)
//edit vacation
router.put('/:id([0-9]+)', authenticateToken, checkUserRole, editVacation)
//delete vacation
router.delete('/:id([0-9]+)', authenticateToken, checkUserRole, deleteVacation)
//post img
router.post('/upload', upload.single('file'), uploadImg)

export default router
