import { supabase } from '../db/index'

export interface Department {
    id: string; 
    name: string;
    code: string;
    description?: string;
    manager_id: string;
    budget: number;
    budget_used: number;
    budget_period: 'monthly' | 'quarterly' | 'yearly';
    isActive: boolean;
    created_at: string;
    updated_at: string
}

export interface CreateDepartmentInput {
    name: string;
    code: string;
    description?: string;
    manager_id: string;
    budget: number;
    budget_period: 'monthly' | 'quarterly' | 'yearly';
}

export interface UpdateDepartmentInput {
    name?: string;
    code?: string;
    description?: string;
    manager_id?:string,
    budget?: number;
    budget_used?: number;
    budget_period?: 'monthly' | 'quarterly' | 'yearly';
    isActive?: boolean;
}

