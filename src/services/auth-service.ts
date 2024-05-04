import { PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { loginSchema, registerSchema } from '../models/user-model'
import { LoginInput } from '../types/types'
import { generateAccessToken, generateRefreshToken } from '../utils/utilities'

const prisma = new PrismaClient()

export const registration = async (req: Request, res: Response) => {
	try {
		const { error } = registerSchema.validate(req.body)
		if (error) {
			return res.status(400).json({ error: error.details[0].message })
		}

		const { firstName, lastName, email, password } = req.body

		const existingUser = await prisma.user.findUnique({
			where: {
				email,
			},
		})

		if (existingUser) {
			return res
				.status(400)
				.json({ error: 'Пользователь с таким email уже зарегистрирован' })
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		const newUser = await prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				password: hashedPassword,
				roleId: 2,
			},
		})

		const accessToken = generateAccessToken(newUser.email, newUser.roleId)
		const refreshToken = generateRefreshToken(newUser.email, newUser.roleId)

		const { password: _, ...userInformation } = newUser

		res.status(201).json({
			message: 'Пользователь успешно зарегистрирован',
			access_token: accessToken,
			refresh_token: refreshToken,
			user: userInformation,
		})
	} catch (error) {
		res.status(500).json({ error: 'Внутренняя ошибка сервера' })
	}
}

export const login = async (
	req: Request<{}, {}, LoginInput>,
	res: Response
) => {
	try {
		const { error } = loginSchema.validate(req.body)
		if (error) {
			return res.status(400).json({ error: error.details[0].message })
		}

		const { email, password } = req.body

		const existingUser: User | null = await prisma.user.findUnique({
			where: {
				email,
			},
		})

		if (!existingUser) {
			return res
				.status(400)
				.json({ error: 'Пользователь с таким email не найдено' })
		}

		const isPasswordCorrect = await bcrypt.compare(
			password,
			existingUser.password
		)

		if (!isPasswordCorrect) {
			return res.status(400).json({ error: 'Неправильный пароль' })
		}

		const accessToken = generateAccessToken(
			existingUser.email,
			existingUser.roleId
		)
		const refreshToken = generateRefreshToken(
			existingUser.email,
			existingUser.roleId
		)

		const { password: _, ...userInformation } = existingUser

		res.status(200).json({
			message: 'Пользователь успешно авторизован',
			access_token: accessToken,
			refresh_token: refreshToken,
			user: userInformation,
		})
	} catch (error) {
		res.status(500).json({ error: 'Внутренняя ошибка сервера' })
	}
}

export const autoLogin = async (req: Request, res: Response) => {
	try {
		console.log(req, res)

		if (!req.user || !('email' in req.user)) {
			return res
				.status(400)
				.json({ error: 'Email не найден авторизуйтесь заново' })
		}

		const email: string | undefined = req.user?.email as string | undefined

		const existingUser: User | null = await prisma.user.findUnique({
			where: {
				email,
			},
		})

		if (!existingUser) {
			return res
				.status(404)
				.json({ error: 'Пользователь с таким email не найдено' })
		}

		const { password: _, ...userInformation } = existingUser

		res.status(200).json({
			message: 'Пользователь успешно авторизован',
			user: userInformation,
		})
	} catch (error) {
		res.status(500).json({ error: 'Внутренняя ошибка сервера' })
	}
}
