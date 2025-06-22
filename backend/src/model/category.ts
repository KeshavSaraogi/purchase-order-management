export interface Category {
  id: string
  name: string
  description: string
  parentCategoryId?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}