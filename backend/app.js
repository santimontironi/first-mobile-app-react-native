import express from 'express'
import dotenv from "dotenv"
import cors from "cors"
import authRouter from './routes/auth.routes.js'
import tasksRouter from './routes/tasks.routes.js'

dotenv.config()

const app = express()

app.use(express.json())

app.use(cors({
    origin: process.env.FRONTEND_URL
}))

app.use("", authRouter)
app.use("", tasksRouter)


export default app