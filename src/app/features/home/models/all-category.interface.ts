
export interface AllCategoryResponse {
  results: number
  metadata: AllCategory
  data: Daum[]
}

export interface AllCategory {
  currentPage: number
  numberOfPages: number
  limit: number
}

export interface Daum {
  _id: string
  name: string
  slug: string
  image: string
  createdAt: string
  updatedAt: string
}
