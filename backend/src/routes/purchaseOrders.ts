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
        vendor,
        department,
        priority,
        date,
        expectedDelivery,
        description,
        notes,
        lineItems,
    } = req.body

    if (
        !vendor ||
        !department ||
        !priority ||
        !date ||
        !expectedDelivery ||
        !description ||
        !lineItems ||
        !Array.isArray(lineItems) ||
        lineItems.length === 0
    ) {
        return res.status(400).json({ error: 'Missing required fields' })
    }

    const totalAmount = lineItems.reduce((sum, item) => {
        return sum + (item.quantity * item.unitPrice)
    }, 0)

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
            total_amount: totalAmount,
        }
        ])
        .select()

    if (poError) {
        return res.status(500).json({ error: poError.message })
    }

    const purchaseOrderId = poData[0].id
    const lineItemRecords = lineItems.map((item: any) => ({
        purchase_order_id: purchaseOrderId,
        item_name: item.itemName,
        quantity: item.quantity,
        unit_price: item.unitPrice
    }))

    const { error: lineItemError } = await supabase
        .from('purchase_order_items')
        .insert(lineItemRecords)

    if (lineItemError) {
        return res.status(500).json({ error: lineItemError.message })
    }

    res.status(201).json({
        message: 'Purchase order created successfully',
        purchaseOrderId
    })
})

export default router