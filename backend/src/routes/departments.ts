import express, { Request, Response } from 'express'
import {
    findAllDepartments,
    findDepartmentById,
    getDepartmentBudgetStatus,
    CreateDepartmentInput,
    createDepartment, 
    findDepartmentByCode, 
    updateDepartment,
    UpdateDepartmentInput, 
    updateDepartmentBudgetUsed, 
    deleteDepartment
} from '../model/Department';

const router = express.Router();

// GET /api/departments - Get all departments
router.get('/', async (req: Request, res: Response) => {
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

// GET /api/departments/:id - Get department by ID
router.get('/:id', async (req: Request, res: Response) => {
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

// GET /api/departments/:id/budget-status - Get budget status
router.get('/:id/budget-status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const budgetStatus = await getDepartmentBudgetStatus(id);
    
    if (!budgetStatus) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    
    res.json({
      success: true,
      data: budgetStatus
    });
  } catch (error) {
    console.error('Error fetching budget status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch budget status'
    });
  }
});

// POST /api/departments - Create new department
router.post('/', async (req: Request, res: Response) => {
  try {
    const departmentData: CreateDepartmentInput = req.body;
    
    // Basic validation
    if (!departmentData.name || !departmentData.code || !departmentData.manager_id) {
      return res.status(400).json({
        success: false,
        message: 'Name, code, and manager_id are required'
      });
    }
    
    // Check if department code already exists
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

// PUT /api/departments/:id - Update department
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateDepartmentInput = req.body;
    
    // Check if department exists
    const existingDepartment = await findDepartmentById(id);
    if (!existingDepartment) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    
    // If updating code, check if new code already exists
    if (updateData.code && updateData.code !== existingDepartment.code) {
      const departmentWithCode = await findDepartmentByCode(updateData.code);
      if (departmentWithCode) {
        return res.status(409).json({
          success: false,
          message: 'Department with this code already exists'
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

// PUT /api/departments/:id/budget-used - Update budget used
router.put('/:id/budget-used', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    
    if (typeof amount !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a number'
      });
    }
    
    await updateDepartmentBudgetUsed(id, amount);
    
    res.json({
      success: true,
      message: 'Budget used updated successfully'
    });
  } catch (error) {
    console.error('Error updating budget used:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update budget used'
    });
  }
});

// DELETE /api/departments/:id - Soft delete department
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if department exists
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