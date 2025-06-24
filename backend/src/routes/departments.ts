import express, { Request, Response } from 'express'
import {
    findAllDepartments,
    findDepartmentById
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