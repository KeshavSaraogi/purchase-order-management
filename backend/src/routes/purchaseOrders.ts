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

export default router