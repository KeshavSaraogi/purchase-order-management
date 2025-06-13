import { query } from '../db/index';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  employeeId: string;
  role: 'admin' | 'manager' | 'purchaser' | 'viewer';
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  phone: string;
  department: string;
  employeeId: string;
  role: 'admin' | 'manager' | 'purchaser' | 'viewer';
  password: string;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const hashedPassword = await bcrypt.hash(input.password, 10);

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
      hashedPassword
    ]
  );
  return result.rows[0];
}

export async function validateUser(email: string, password: string): Promise<User | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? user : null;
}