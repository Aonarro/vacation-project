import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const uploadImg = async (req: Request, res: Response) => {
	try {
		const imageName = req.file?.filename
		const newVacation = { ...req.body, imageName }

		const vacation = await prisma.vacation.create({
			data: {
				destination: newVacation.destination,
				description: newVacation.description,
				startDate: new Date(req.body.startDate),
				endDate: new Date(req.body.endDate),
				price: Number.parseFloat(req.body.price),
				imageName: newVacation.imageName,
			},
		})

		console.log(vacation)

		res.status(201).json('success')
	} catch (error) {
		res.json(error)
	}
}
