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
