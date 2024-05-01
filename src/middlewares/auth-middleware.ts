import { NextFunction, Request, Response } from 'express'
import { generateAccessToken, verifyToken } from '../utils/utilities'

export async function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const authHeader = req.headers['authorization']

		if (!authHeader) {
			return res.sendStatus(401)
		}
		const token = authHeader.split(' ')[1]

		if (!token) {
			return res.sendStatus(401)
		}

		const decoded = verifyToken(token)
		console.log(decoded)

		if (!decoded) {
			console.log(req.cookies)
			const refreshToken = req.cookies.refreshToken
			console.log(refreshToken)

			if (!refreshToken) {
				return res.sendStatus(401)
			}

			const refreshDecoded = verifyToken(refreshToken)

			if (!refreshDecoded) {
				return res.sendStatus(401)
			}

			const newAccessToken = generateAccessToken(
				refreshDecoded.email,
				refreshDecoded.roleId
			)

			res.setHeader('Authorization', `Bearer ${newAccessToken}`)

			next()
		} else {
			req.user = decoded

			next()
		}
	} catch (error) {
		return res.sendStatus(500)
	}
}
