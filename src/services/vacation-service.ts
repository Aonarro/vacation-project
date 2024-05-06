import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { saveImage } from '../utils/file-utility-functions'

const prisma = new PrismaClient()

interface NewVacation {
	destination: string
	description: string
	startDate: Date
	endDate: Date
	price: number
}

export const getAllVacations = async (req: Request, res: Response) => {
	try {
		const id = +req.params.id
		const vacation = await prisma.vacation.findUnique({
			where: {
				vacationId: id,
			},
		})
		res.json(vacation)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

export const getOneVacation = async (req: Request, res: Response) => {
	try {
		const id = +req.params.id
		const vacation = await prisma.vacation.findUnique({
			where: {
				vacationId: id,
			},
		})
		res.json(vacation)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

export const postNewVacation = async (req: Request, res: Response) => {
	try {
		const { destination, description, startDate, endDate, price, image } =
			req.body

		const vacation = await prisma.vacation.create({
			data: {
				destination,
				description,
				startDate,
				endDate,
				price,
				imageName: image ? await saveImage(image) : null,
			},
		})

		res.status(201).json(vacation)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

export const editVacation = async (req: Request, res: Response) => {
	try {
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

export const deleteVacation = async (req: Request, res: Response) => {
	try {
		const id = +req.params.id

		await prisma.vacation.delete({
			where: {
				vacationId: id,
			},
		})

		res.sendStatus(204)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}
