import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import PurchaseOrderForm from './PurchaseOrderForm'
import type { FormValues } from './PurchaseOrderForm'
import { createPurchaseOrder } from '../../services/purchaseOrderService'

const CreatePurchaseOrderPage: React.FC = () => {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: () => {
      toast.success('Purchase order created successfully')
      navigate('/purchase-orders')
    },
    onError: () => {
      toast.error('Failed to create purchase order')
    }
  })

  const handleSubmit = (data: FormValues) => {
    mutation.mutate(data)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Purchase Order</h1>
      <PurchaseOrderForm onSubmit={handleSubmit} />
    </div>
  )
}

export default CreatePurchaseOrderPage