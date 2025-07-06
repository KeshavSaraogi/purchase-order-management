import express, { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import {
  createDepartment,
  findAllDepartments,
  findDepartmentById,
  findDepartmentByCode,
  updateDepartment,
  deleteDepartment,
  updateDepartmentBudgetUsed,
  getDepartmentBudgetStatus
} from '../model/Department'
import { findUserById } from '../model/user'
import { CreateDepartmentInput, UpdateDepartmentInput } from '../model/Department'
import supabase from '../utils/supabaseClient'

const router = express.Router()

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
    email: string
    role: 'admin' | 'manager' | 'purchaser' | 'viewer'
  }
}

const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]

  if (!token) return res.status(401).json({ success: false, message: 'Access token is required' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await findUserById(decoded.userId)
    if (!user) return res.status(401).json({ success: false, message: 'User not found' })

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role.toLowerCase() as any
    }
    next()
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid or expired token' })
  }
}

const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
      })
    }
    next()
  }
}

router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const departments = await findAllDepartments()
    res.json({ success: true, data: departments })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch departments' })
  }
})

router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const department = await findDepartmentById(req.params.id)
    if (!department) return res.status(404).json({ success: false, message: 'Department not found' })

    res.json({ success: true, data: department })
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch department' })
  }
})

router.post('/', authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  const input: CreateDepartmentInput = req.body

  if (!input.name || !input.code || !input.manager_id) {
    return res.status(400).json({ success: false, message: 'Name, code, and manager_id are required' })
  }

  try {
    const existing = await findDepartmentByCode(input.code)
    if (existing) return res.status(409).json({ success: false, message: 'Department code already exists' })

    const newDept = await createDepartment(input)
    res.status(201).json({ success: true, message: 'Department created', data: newDept })
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create department' })
  }
})

router.put('/:id', authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await updateDepartment(req.params.id, req.body as UpdateDepartmentInput)
    res.json({ success: true, message: 'Department updated', data: updated })
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update department' })
  }
})

router.patch('/:id/status', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { is_active } = req.body
    const updated = await updateDepartment(req.params.id, { is_active })
    res.json({ success: true, message: 'Status updated', data: updated })
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update status' })
  }
})

router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    await deleteDepartment(req.params.id)
    res.json({ success: true, message: 'Department deleted (soft)' })
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete department' })
  }
})

router.get('/:id/budget', authenticateToken, async (req, res) => {
  try {
    const status = await getDepartmentBudgetStatus(req.params.id)
    if (!status) return res.status(404).json({ success: false, message: 'Not found' })

    res.json({ success: true, data: status })
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch budget status' })
  }
})

router.get('/stats', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('budget, budget_used, is_active')

    if (error || !data) throw error || new Error('No data returned')

    const total = data.length
    const active = data.filter(d => d.is_active).length
    const totalBudget = data.reduce((sum, d) => sum + (d.budget || 0), 0)
    const totalBudgetUsed = data.reduce((sum, d) => sum + (d.budget_used || 0), 0)

    res.json({
      success: true,
      data: {
        total,
        active,
        totalBudget,
        totalBudgetUsed
      }
    })
  } catch (err: any) {
    console.error('❌ Failed to fetch department stats:', err.message)
    res.status(500).json({ success: false, message: 'Failed to fetch stats' })
  }
})

export default router