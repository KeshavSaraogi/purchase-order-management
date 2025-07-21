import express from 'express'
import supabase from '../utils/supabaseClient'

const router = express.Router()

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .order('order_date', { ascending: false })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(200).json(data)
})

router.post('/', async (req, res) => {
  const {
    vendor, department, priority, date,
    expectedDelivery, description, notes, lineItems
  } = req.body

  if (!vendor || !department || !priority || !date || !expectedDelivery || !description || !lineItems) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const totalAmount = lineItems.reduce(
    (sum: number, item: { quantity: number; unitPrice: number }) =>
      sum + item.quantity * item.unitPrice, 0
  )

  const { data: poData, error: poError } = await supabase
    .from('purchase_orders')
    .insert([{
      vendor,
      department,
      priority,
      order_date: date,
      expected_delivery: expectedDelivery,
      description,
      notes,
      total_amount: totalAmount
    }])
    .select()

  if (poError) return res.status(500).json({ error: poError.message })

  const purchaseOrderId = poData[0].id

  const itemsToInsert = lineItems.map((item: { itemName: string; quantity: number; unitPrice: number }) => ({
    purchase_order_id: purchaseOrderId,
    item_name: item.itemName,
    quantity: item.quantity,
    unit_price: item.unitPrice
  }))

  const { error: itemError } = await supabase
    .from('purchase_order_items')
    .insert(itemsToInsert)

  if (itemError) return res.status(500).json({ error: itemError.message })

  res.status(201).json({ message: 'Purchase order created successfully', id: purchaseOrderId })
})

router.put('/:id', async (req, res) => {
  const id = req.params.id
  const {
    vendor, department, priority, date,
    expectedDelivery, description, notes, lineItems
  } = req.body

  if (!id || !lineItems || lineItems.length === 0) {
    return res.status(400).json({ error: 'Missing purchase order ID or items' })
  }

  const totalAmount = lineItems.reduce(
    (sum: number, item: { quantity: number; unitPrice: number }) =>
      sum + item.quantity * item.unitPrice, 0
  )

  const { error: updateError } = await supabase
    .from('purchase_orders')
    .update({
      vendor,
      department,
      priority,
      order_date: date,
      expected_delivery: expectedDelivery,
      description,
      notes,
      total_amount: totalAmount
    })
    .eq('id', id)

  if (updateError) return res.status(500).json({ error: updateError.message })

  await supabase.from('purchase_order_items').delete().eq('purchase_order_id', id)

  const itemsToInsert = lineItems.map((item: { itemName: string; quantity: number; unitPrice: number }) => ({
    purchase_order_id: id,
    item_name: item.itemName,
    quantity: item.quantity,
    unit_price: item.unitPrice
  }))

  const { error: insertError } = await supabase
    .from('purchase_order_items')
    .insert(itemsToInsert)

  if (insertError) return res.status(500).json({ error: insertError.message })

  res.status(200).json({ message: 'Purchase order updated successfully' })
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id

  if (!id) return res.status(400).json({ error: 'Purchase order ID is required' })

  const { error: itemError } = await supabase
    .from('purchase_order_items')
    .delete()
    .eq('purchase_order_id', id)

  if (itemError) return res.status(500).json({ error: itemError.message })

  const { error: orderError } = await supabase
    .from('purchase_orders')
    .delete()
    .eq('id', id)

  if (orderError) return res.status(500).json({ error: orderError.message })

  res.status(200).json({ message: 'Purchase order deleted successfully' })
})

export default router