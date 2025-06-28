import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../db/index';
import {
  createDepartment,
  findAllDepartments,
  findDepartmentById,
  findDepartmentByCode,
  updateDepartment,
  updateDepartmentBudgetUsed,
  deleteDepartment,
  getDepartmentBudgetStatus,
  CreateDepartmentInput,
  UpdateDepartmentInput
} from '../model/Department'
import { findUserById } from '../model/user'

const router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: 'admin' | 'manager' | 'purchaser' | 'viewer';
  };
}

const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token is required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await findUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role.toLowerCase() as 'admin' | 'manager' | 'purchaser' | 'viewer'
    };
    
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('📋 GET /departments called - fetching all departments');
    const departments = await findAllDepartments();
    
    console.log(`✅ Found ${departments.length} departments`);
    res.json({
      success: true,
      data: departments,
      message: `Retrieved ${departments.length} departments successfully`
    });
  } catch (error) {
    console.error('❌ Error fetching departments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`📋 GET /departments/${id} called`);
    
    const department = await findDepartmentById(id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    
    console.log(`✅ Found department: ${department.name}`);
    res.json({
      success: true,
      data: department
    });
  } catch (error) {
    console.error('❌ Error fetching department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch department'
    });
  }
});

router.post('/', authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const departmentData: CreateDepartmentInput = req.body;
    
    if (!departmentData.name || !departmentData.code || !departmentData.manager_id) {
      return res.status(400).json({
        success: false,
        message: 'Name, code, and manager_id are required'
      });
    }

    const existingDepartment = await findDepartmentByCode(departmentData.code);
    if (existingDepartment) {
      return res.status(409).json({
        success: false,
        message: 'Department with this code already exists'
      });
    }

    const newDepartment = await createDepartment(departmentData);
    
    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: newDepartment
    });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create department'
    });
  }
});

router.get('/test/connection', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: '🎉 Department API connection successful!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

export default router;