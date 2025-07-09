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

router.post('/', async (req, res) => {
  const {
    name,
    code,
    description,
    budget,
    budget_period
  } = req.body

  // Basic validation
  if (!name || !code || !budget || !budget_period) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  const newDepartment = {
    name,
    code,
    description,
    budget,
    budget_used: 0,
    budget_period,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('departments')
    .insert([newDepartment])
    .select()

  if (error) {
    console.error('[POST /departments] Insert failed:', error)
    return res.status(500).json({ message: 'Failed to create department', error })
  }

  return res.status(201).json(data[0])
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

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  console.log('[DELETE] Department ID:', id)
  const { error } = await supabase
    .from('departments')
    .delete()
    .eq('id', id)

  if (error) {
    return res.status(500).json({ message: 'Delete failed', error })
  }

  return res.status(200).json({ message: 'Deleted successfully' })
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

    if (error) throw error
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'No departments found' })
    }

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