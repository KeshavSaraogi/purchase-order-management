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

// Authentication middleware
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

const canEditDepartment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const { id } = req.params;
  
  if (req.user.role === 'admin') {
    return next();
  }

  if (req.user.role === 'manager') {
    try {
      const department = await findDepartmentById(id);
      if (!department) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }

      if (department.manager_id !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: 'You can only edit your own department'
        });
      }

      return next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking department permissions'
      });
    }
  }

  return res.status(403).json({
    success: false,
    message: 'Insufficient permissions to edit departments'
  });
};

router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const departments = await findAllDepartments();
    res.json({
      success: true,
      data: departments
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departments'
    });
  }
});

router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const department = await findDepartmentById(id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    
    res.json({
      success: true,
      data: department
    });
  } catch (error) {
    console.error('Error fetching department:', error);
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

router.put('/:id', authenticateToken, canEditDepartment, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateDepartmentInput = req.body;
    
    const existingDepartment = await findDepartmentById(id);
    if (!existingDepartment) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Non-admin users cannot modify budget or budget period
    if (req.user!.role !== 'admin') {
      if (updateData.budget !== undefined || updateData.budget_period !== undefined) {
        return res.status(403).json({
          success: false,
          message: 'Only administrators can modify budget settings'
        });
      }
    }

    const updatedDepartment = await updateDepartment(id, updateData);
    
    res.json({
      success: true,
      message: 'Department updated successfully',
      data: updatedDepartment
    });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update department'
    });
  }
});

router.delete('/:id', authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const existingDepartment = await findDepartmentById(id);
    if (!existingDepartment) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    await deleteDepartment(id);
    
    res.json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete department'
    });
  }
});

export default router;