import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { follow, unFollow } from '../models/follow-model'

const prisma = new PrismaClient()

export const addNewFollower = async (req: Request, res: Response) => {
	try {
		const { error } = follow.validate(req.body)
		if (error) {
			return res.status(400).json(error.details[0].message)
		}

		const { userId, vacationId } = req.body

		const userExists = await prisma.user.findUnique({
			where: { userId },
		})
		const vacationExists = await prisma.vacation.findUnique({
			where: { vacationId },
		})

		if (!userExists || !vacationExists) {
			return res.status(404).json('User or vacation not found')
		}

		const existingFollower = await prisma.followers.findFirst({
			where: {
				userId,
				vacationId,
			},
		})

		if (existingFollower) {
			return res.status(400).json('User is already a follower of this vacation')
		}

		await prisma.followers.create({
			data: {
				userId,
				vacationId,
			},
		})

		res.sendStatus(200)
	} catch (error) {
		res.status(500).json('Internal Server Error')
	}
}

export const removeFollower = async (req: Request, res: Response) => {
	try {
		const { error } = unFollow.validate(req.body)
		if (error) {
			return res.status(400).json(error.details[0].message)
		}
		const { userId, vacationId } = req.body

		const follow = await prisma.followers.findFirst({
			where: {
				userId,
				vacationId,
			},
		})

		if (!follow) {
			return res.status(404).json('Follow not found')
		}

		await prisma.followers.delete({
			where: {
				userId_vacationId: {
					userId: +userId,
					vacationId: +vacationId,
				},
			},
		})

		res.sendStatus(200)
	} catch (error) {
		res.status(500).json('Internal Server Error')
	}
}
