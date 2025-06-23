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

export async function findDepartmentById(id: string): Promise<Department | null> {
    const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('id', id)
        .single();

    if ( error ) {
        return null;
    }

    return data as Department;
}

export async function findDepartmentByCode(code: string): Promise<Department | null> {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .eq('code', code.toUpperCase())
    .single();

  if (error) {
    return null;
  }
  return data as Department;
}

export async function findAllDepartments(): Promise<Department[]> {
    const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('is_active', true)
        .order('name');

    if (error) {
        return [];
    }
    return data as Department[];
}

export async function updateDepartment(id: string, input: UpdateDepartmentInput): Promise<Department> {
    const updateData = { ...input };
        if (updateData.code) {
        updateData.code = updateData.code.toUpperCase();
    }

    const { data, error } = await supabase
        .from('departments')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

    if (error) {
        throw error;
    }
    return data as Department;
}

export async function updateDepartmentBudgetUsed(id: string, amount: number): Promise<void> {
    const { error } = await supabase
        .from('departments')
        .update({ budget_used: amount })
        .eq('id', id);

    if (error) {
        throw error;
    }
}

export async function deleteDepartment(id: string): Promise<void> {
    const { error } = await supabase
        .from('departments')
        .update({ is_active: false })
        .eq('id', id);

    if (error) {
        throw error;
    }
}

export async function getDepartmentBudgetStatus(id: string): Promise<{ budget: number; used: number; remaining: number; percentage: number;} | null> {
    const department = await findDepartmentById(id);
    if (!department) return null;

    const remaining = department.budget - department.budget_used;
    const percentage = (department.budget_used / department.budget) * 100;

    return {
        budget: department.budget,
        used: department.budget_used,
        remaining,
        percentage: Math.round(percentage * 100) / 100,
    };
}
