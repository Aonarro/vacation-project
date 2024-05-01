import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import AuthRoutes from './routes/auth-routes'

dotenv.config()
const server = express()

server.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
)
server.use(express.json())

const prisma = new PrismaClient()

server.use(AuthRoutes)

server.listen(process.env.PORT, () => {
	console.log(`Example server listening on port ${process.env.PORT}!`)
})
