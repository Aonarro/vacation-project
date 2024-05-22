import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import AuthRoutes from './routes/auth-routes'
import VacationRoutes from './routes/vacation-routes'
import ChartRoutes from './routes/chart-routes'
import CsvRoutes from './routes/csv-router'
import path from 'path'

dotenv.config()

const server = express()
server.use(cookieParser())
server.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
)

const uploadsPath = path.join(__dirname, '..', 'uploads')
server.use('/uploads', express.static(uploadsPath))
server.use(express.json())

//Routes
server.use('/api', AuthRoutes)
server.use('/api/vacations', VacationRoutes)
server.use('/api/chart', ChartRoutes)
server.use('/api/csv', CsvRoutes)

server.listen(process.env.PORT, () => {
	console.log(`Example server listening on port ${process.env.PORT}!`)
})
