interface Vendor {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: Address
  category: string
  rating: number
  isActive: boolean
  taxId: string
  paymentTerms: string
  createdAt: Date
  updatedAt: Date
}