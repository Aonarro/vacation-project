import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const getAllVacationsForChart = async (req: Request, res: Response) => {
	try {
		const displayNumber = parseInt(req.query.displayNumber as string) || 5

		const totalCount = await prisma.vacation.count()

		const vacationsArray = await prisma.vacation.findMany({
			take: displayNumber,
			include: {
				Followers: true,
			},
		})
		res.status(200).json({
			vacationsArray,
			totalCount,
		})
	} catch (error) {
		res.status(500).json({ message: 'Internal server error' })
	}
}
