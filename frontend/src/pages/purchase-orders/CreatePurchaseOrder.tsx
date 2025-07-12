import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import PurchaseOrderForm from './PurchaseOrderForm'
import { createPurchaseOrder } from '../../services/purchaseOrderService'

const CreatePurchaseOrder = () => {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: () => {
      toast.success('Purchase order created!')
      navigate('/purchase-orders')
    },
    onError: () => {
      toast.error('Failed to create purchase order')
    }
  })

  const handleSubmit = (data: any) => {
    mutation.mutate(data)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Purchase Order</h1>
      <PurchaseOrderForm onSubmit={handleSubmit} />
    </div>
  )
}

export default CreatePurchaseOrder
