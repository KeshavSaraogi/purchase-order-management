import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'

export type LineItem = {
  itemName: string
  quantity: number
  unitPrice: number
}

export type FormValues = {
  vendor: string
  department: string
  priority: string
  date: string
  expectedDelivery: string
  description: string
  notes: string
  lineItems: LineItem[]
}

const defaultValues: FormValues = {
  vendor: '',
  department: '',
  priority: 'medium',
  date: '',
  expectedDelivery: '',
  description: '',
  notes: '',
  lineItems: [{ itemName: '', quantity: 1, unitPrice: 0 }]
}

type Props = {
  onSubmit: (data: FormValues) => void
  defaultValues?: FormValues
}
const PurchaseOrderForm: React.FC<Props> = ({ onSubmit, defaultValues }) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: defaultValues || {
      vendor: '',
      department: '',
      priority: 'medium',
      date: '',
      expectedDelivery: '',
      description: '',
      notes: '',
      lineItems: [{ itemName: '', quantity: 1, unitPrice: 0 }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems'
  })

  const watchedItems = watch('lineItems')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Vendor</label>
          <input {...register('vendor', { required: 'Vendor is required' })} className="input" />
          {errors.vendor && <p className="text-red-500 text-sm">{errors.vendor.message}</p>}
        </div>

        <div>
          <label>Department</label>
          <input {...register('department', { required: 'Department is required' })} className="input" />
          {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
        </div>

        <div>
          <label>Priority</label>
          <select {...register('priority', { required: 'Priority is required' })} className="input">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
        </div>

        <div>
          <label>Order Date</label>
          <input type="date" {...register('date', { required: 'Order date is required' })} className="input" />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
        </div>

        <div>
          <label>Expected Delivery</label>
          <input type="date" {...register('expectedDelivery', { required: 'Expected delivery date is required' })} className="input" />
          {errors.expectedDelivery && <p className="text-red-500 text-sm">{errors.expectedDelivery.message}</p>}
        </div>

        <div>
          <label>Description</label>
          <input {...register('description', { required: 'Description is required' })} className="input" />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>
      </div>

      <div>
        <label>Notes</label>
        <textarea {...register('notes')} className="input w-full" rows={3} />
      </div>

      <div>
        <label className="block mb-2">Line Items</label>
        <table className="w-full table-auto border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Item</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Unit Price</th>
              <th className="border px-2 py-1">Total</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td className="border p-1">
                  <input {...register(`lineItems.${index}.itemName`, { required: true })} className="input" />
                </td>
                <td className="border p-1">
                  <input
                    type="number"
                    {...register(`lineItems.${index}.quantity`, { valueAsNumber: true, required: true })}
                    className="input w-20"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="number"
                    {...register(`lineItems.${index}.unitPrice`, { valueAsNumber: true, required: true })}
                    className="input w-24"
                  />
                </td>
                <td className="border p-1 text-right">
                  {watchedItems[index]?.quantity * watchedItems[index]?.unitPrice || 0}
                </td>
                <td className="border p-1 text-center">
                  <button type="button" onClick={() => remove(index)} className="text-red-500">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="button" onClick={() => append({ itemName: '', quantity: 1, unitPrice: 0 })} className="mt-2 text-blue-600">
          + Add Item
        </button>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Create Purchase Order
      </button>
    </form>
  )
}

export default PurchaseOrderForm
