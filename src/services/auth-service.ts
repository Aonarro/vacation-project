import { PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { loginSchema, registerSchema } from '../models/user-model'
import { LoginInput, RegistrationInput } from '../types/types'

const prisma = new PrismaClient()

export const register = async (
	req: Request<{}, {}, RegistrationInput>,
	res: Response
) => {
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

		res.status(201).json({
			message: 'Пользователь успешно зарегистрирован',
			user: newUser,
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

		const { password: _, ...userInformation } = existingUser

		res.status(200).json({
			message: 'Пользователь успешно авторизован',
			user: userInformation,
		})
	} catch (error) {
		res.status(500).json({ error: 'Внутренняя ошибка сервера' })
	}
}
