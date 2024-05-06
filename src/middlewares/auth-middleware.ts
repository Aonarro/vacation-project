import { NextFunction, Request, Response } from 'express'
import { DecodedUser } from '../types/types'
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

		const decoded: DecodedUser = verifyToken(token)
		//Get new access token
		if (!decoded) {
			const refreshToken = req.cookies.refreshToken

			if (!refreshToken) {
				return res.sendStatus(401)
			}

			const refreshDecoded: DecodedUser = verifyToken(refreshToken)

			if (!refreshDecoded) {
				return res.sendStatus(401)
			}

			const newAccessToken = generateAccessToken(
				refreshDecoded.email,
				refreshDecoded.roleId
			)

			res.setHeader('Authorization', `Bearer ${newAccessToken}`)
			res.setHeader('Access-Control-Expose-Headers', 'Authorization')
			req.user = refreshDecoded
			next()
		} else {
			req.user = decoded

			next()
		}
	} catch (error) {
		return res.sendStatus(500)
	}
}
