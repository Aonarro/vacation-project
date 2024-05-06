import { PrismaClient } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'

const prisma = new PrismaClient()

export const checkUserRole = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const email = req.user?.email
		const user = await prisma.user.findUnique({
			where: { email },
			include: { role: true },
		})

		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}

		if (user.role.roleName === 'Admin') {
			next()
		} else {
			return res
				.status(403)
				.json({ message: 'Access denied. You are not an admin.' })
		}
	} catch (error) {
		return res.status(500).json({ message: 'Internal server error' })
	}
}
