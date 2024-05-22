import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import {
	createVacationSchema,
	updateVacationSchema,
} from '../models/vacation-model'

const prisma = new PrismaClient()

export const getAllVacations = async (req: Request, res: Response) => {
	try {
		const page = parseInt(req.query.page as string) || 1
		const pageSize = parseInt(req.query.pageSize as string) || 8

		const sortBy = (req.query.sortBy as string) || 'startDate'
		const sortOrder = (req.query.sortOrder as string) || 'asc'

		const totalCount = await prisma.vacation.count()
		const totalPages = Math.ceil(totalCount / pageSize)

		const vacationsArray = await prisma.vacation.findMany({
			take: pageSize,
			skip: (page - 1) * pageSize,
			include: {
				Followers: true,
			},
			orderBy: {
				[sortBy]: sortOrder,
			},
		})

		res.status(200).json({
			vacationsArray,
			page,
			pageSize,
			totalCount,
			totalPages,
		})
	} catch (error) {
		res.status(500).json('Internal server error')
	}
}

export const createVacation = async (req: Request, res: Response) => {
	try {
		console.log(req.body)
		const { error } = createVacationSchema.validate(req.body)
		if (error) {
			return res.status(400).json(error.details[0].message)
		}

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

		res.sendStatus(201)
	} catch (error) {
		res.json(error)
	}
}

export const editVacation = async (req: Request, res: Response) => {
	try {
		console.log(req.body)
		const { error } = updateVacationSchema.validate(req.body)
		if (error) {
			return res.status(400).json(error.details[0].message)
		}
		const { id } = req.params
		const imageName = req.file?.filename
		const { destination, description, startDate, endDate, price } = req.body

		const existingVacation = await prisma.vacation.findUnique({
			where: { vacationId: +id },
		})
		if (!existingVacation) {
			return res.status(404).json('Vacation not found')
		}

		let data: any = {
			destination,
			description,
			startDate: new Date(startDate),
			endDate: new Date(endDate),
			price: Number.parseFloat(price),
		}

		if (imageName) {
			data.imageName = imageName
		}

		const updatedVacation = await prisma.vacation.update({
			where: { vacationId: +id },
			data,
		})

		res.sendStatus(204)
	} catch (error) {
		res.status(500).json('Internal Server Error')
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
		res.status(500).json('Internal Server Error')
	}
}
