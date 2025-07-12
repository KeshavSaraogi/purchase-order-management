import { api } from './api'

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

export const getAllPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  const response = await api.get('/purchase-orders')
  return response.data
}
