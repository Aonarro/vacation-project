import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import AuthRoutes from './routes/auth-routes'

const server = express()

server.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
)
dotenv.config()
server.use(express.json())

server.use(AuthRoutes)

server.listen(process.env.PORT, () => {
	console.log(`Example server listening on port ${process.env.PORT}!`)
})
