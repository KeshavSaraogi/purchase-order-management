import express from 'express';
import supabase from '../utils/supabaseClient'

const router = express.Router()

router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('purchase_orders')
        .select('*')
        .order('order_date', { ascending: false})
    
    if (error) {
        return res.status(500).json({ error: error.message})
    }

    res.status(200).json(data)
})

router.post('/', async (req, res) => {
  const {
    vendor,
    department,
    priority,
    date,
    expectedDelivery,
    description,
    notes,
    lineItems,
  } = req.body

  const { data: poData, error: poError } = await supabase
    .from('purchase_orders')
    .insert([
      {
        vendor,
        department,
        priority,
        order_date: date,
        expected_delivery: expectedDelivery,
        description,
        notes,
      },
    ])
    .select()

  if (poError) {
    return res.status(500).json({ error: poError.message })
  }

  const purchaseOrderId = poData?.[0]?.id

  const lineItemRecords = lineItems.map((item: any) => ({
    purchase_order_id: purchaseOrderId,
    item_name: item.itemName,
    quantity: item.quantity,
    unit_price: item.unitPrice,
  }))

  const { error: lineItemError } = await supabase
    .from('purchase_order_items')
    .insert(lineItemRecords)

  if (lineItemError) {
    return res.status(500).json({ error: lineItemError.message })
  }

  res.status(201).json({ message: 'Purchase order created successfully' })
})

export default router