import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'

dotenv.config()
const server = express()

server.use(cors())
server.use(express.json())

const prisma = new PrismaClient()

server.get('/', async (req: Request, res: Response) => {
	const users = await prisma.user.findMany()
	res.json({ users: users }).status(200)
})

server.listen(process.env.PORT, () => {
	console.log(`Example server listening on port ${process.env.PORT}!`)
})
