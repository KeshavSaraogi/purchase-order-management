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
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'sent' | 'received' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  orderDate: string
  expectedDelivery: string
  createdAt: string
  updatedAt: string
}