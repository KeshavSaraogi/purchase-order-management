import { api } from './api'
import axios from 'axios'
import type { FormValues } from '../pages/purchase-orders/PurchaseOrderForm'

const baseURL = 'https://purchase-order-management-6fb7.onrender.com'

export type PurchaseOrderStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'sent'
  | 'received'
  | 'cancelled'

export type PurchaseOrderPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface PurchaseOrder {
  id: string
  vendorId: string
  requestedBy: string
  approvedBy?: string
  department: string
  description: string
  notes?: string
  totalAmount: number
  currency: string
  status: PurchaseOrderStatus
  priority: PurchaseOrderPriority
  orderDate: string
  expectedDelivery: string
  createdAt: string
  updatedAt: string
  items: number
}

// GET all purchase orders
export const getAllPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  const response = await api.get('/api/purchase-orders')
  return response.data
}

// POST new purchase order
export const createPurchaseOrder = async (payload: FormValues) => {
  const response = await axios.post(`${baseURL}/api/purchase-orders`, payload)
  return response.data
}

// GET single purchase order by ID
export const getPurchaseOrderById = async (id: string) => {
  const response = await axios.get(`/api/purchase-orders/${id}`)
  return response.data
}

// PUT update purchase order by ID
export const updatePurchaseOrder = async (id: string, data: FormValues) => {
  const response = await axios.put(`/api/purchase-orders/${id}`, data)
  return response.data
}