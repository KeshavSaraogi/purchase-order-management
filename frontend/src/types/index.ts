export interface User {
  id: string
  name: string
  email: string
  role: UserRole
//  department?: Department
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'admin' | 'manager' | 'purchaser' | 'viewer'