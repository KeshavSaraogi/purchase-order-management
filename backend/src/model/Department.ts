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

export async function createDepartment(input: CreateDepartmentInput): Promise<Department> {
    const { data, error } = await supabase
        .from('departments')
        .insert([
            {
                name: input.name,
                code: input.code.toUpperCase(),
                description: input.description,
                manager_id: input.manager_id,
                budget: input.budget,
                budget_used: 0,
                budget_period: input.budget_period,
                is_active: true,
            }
        ])
        .select('*')
        .single();

    if (error) {
        throw error;
    }
    return data as Department;
}
