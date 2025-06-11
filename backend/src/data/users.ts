import { query } from '../db'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  department: string
  employeeId: string
  role: 'admin' | 'manager' | 'purchaser' | 'viewer'
  password: string
  createdAt: Date
  updatedAt: Date
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await query('SELECT * FROM users WHERE email = $1', [email])
  return result.rows[0] || null
}

interface CreateUserInput {
  name: string
  email: string
  phone: string
  department: string
  employeeId: string
  role: 'admin' | 'manager' | 'purchaser' | 'viewer'
  password: string
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const result = await query(
    `INSERT INTO users (name, email, phone, department, employee_id, role, password)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      input.name,
      input.email,
      input.phone,
      input.department,
      input.employeeId,
      input.role,
      input.password,
    ]
  )
  return result.rows[0]
}
