import supabase from '../utils/supabaseClient'
import type { Vendor } from '../types'

export const fetchVendors = async (): Promise<Vendor[]> => {
  const { data, error } = await supabase
    .from('vendors')
    .select('id, name, contact_email, contact_phone, address, created_at')

  if (error) {
    console.error('Error fetching vendors:', error.message)
    throw new Error('Failed to fetch vendors')
  }

  return data as Vendor[]
}