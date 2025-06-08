import express, { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { users, User } from '../data/users.ts'

const router = express.Router()

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    const user = users.find(u => u.email === email)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    const { password: _, ...userWithoutPassword } = user
    
    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, department, employeeId, role, password } = req.body

    if (!firstName || !lastName || !email || !password || !department || !role) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      })
    }

    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: `${firstName} ${lastName}`,
      email,
      phone: phone || '',
      department,
      employeeId: employeeId || '',
      role: role as any,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    users.push(newUser)

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    const { password: _, ...userWithoutPassword } = newUser

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userWithoutPassword,
        token
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router
