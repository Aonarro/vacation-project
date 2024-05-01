import { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../utils/utilities'

export function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const authHeader = req.headers['authorization']
		const token = authHeader && authHeader.split(' ')[1]

		if (!token) {
			return res.sendStatus(401) // Ошибка: отсутствует токен
		}

		const decoded = verifyToken(token)
		if (!decoded) {
			return res.sendStatus(401) // Ошибка: неверный токен
		}

		req.user = decoded
		next()
	} catch (error) {
		return res.sendStatus(500) // Ошибка: неверный токен
	}
}
