import { supabase } from '../db/index';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: 'admin' | 'manager' | 'purchaser' | 'viewer';
  password: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  phone: string;
  department: string;
  role: 'admin' | 'manager' | 'purchaser' | 'viewer';
  password: string;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    return null;
  }
  return data as User;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const hashedPassword = await bcrypt.hash(input.password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        name: input.name,
        email: input.email,
        phone: input.phone,
        department: input.department,
        role: input.role,
        password: hashedPassword
      }
    ])
    .select('*')
    .single();

  console.log("Insert result:", { data, error });

  if (error) {
    throw error;
  }
  return data as User;
}

export async function validateUser(email: string, password: string): Promise<User | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? user : null;
}

export async function findUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }
  return data as User;
}