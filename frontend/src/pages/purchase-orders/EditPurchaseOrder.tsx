import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import PurchaseOrderForm from './PurchaseOrderForm'
import  type { FormValues } from './PurchaseOrderForm'
import { getPurchaseOrderById, updatePurchaseOrder } from '../../services/purchaseOrderService'

const EditPurchaseOrderPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const { data, isLoading, error } = useQuery({
        queryKey: ["purchase-order", id],
        queryFn: () => getPurchaseOrderById(id!),
        enabled: !!id
    })

    const mutation = useMutation({
        mutationFn: (formData: FormValues) => updatePurchaseOrder(id!, formData),
        onSuccess: () => {
            toast.success('Purchase order updated successfully')
            navigate('/purchase-orders')
        },
        onError: () => {
            toast.error('Failed to update purchase order')
        }
    })

    const handleSubmit = (formData: FormValues) => {
        mutation.mutate(formData)
    }

    if (isLoading) return <div className="p-6">Loading...</div>
    if (error || !data) return <div className="p-6 text-red-500">Failed to load purchase order</div>

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Purchase Order</h1>
            <PurchaseOrderForm onSubmit={handleSubmit} defaultValues={data} />
        </div>
    )
}

export default EditPurchaseOrderPage