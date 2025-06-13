import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.json('Welcome to the Purchase Management API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})