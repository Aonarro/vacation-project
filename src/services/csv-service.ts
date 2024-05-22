import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

interface ICSVState {
	destination: string
	vacationId: number
	followersCount: number
}

export const getFollowersForCsv = async (req: Request, res: Response) => {
	try {
		const vacations = await prisma.vacation.findMany({
			include: {
				_count: {
					select: { Followers: true },
				},
			},
		})

		const csvData: Record<string, ICSVState> = {}

		vacations.forEach(vacation => {
			const {
				destination,
				vacationId,
				_count: { Followers },
			} = vacation

			if (!csvData[destination]) {
				csvData[destination] = {
					destination,
					vacationId,
					followersCount: Followers,
				}
			} else {
				csvData[destination].followersCount += Followers
			}
		})

		const result = Object.values(csvData)
		console.log(result)
		console.log(vacations)

		res.status(200).json(result)
	} catch (error) {
		res.status(500).json('Internal Server Error')
	}
}
