

export interface BrandsResponse {
  results: number
  metadata: Brands
  data: Brands[]
}

export interface Brands {
  currentPage: number
  numberOfPages: number
  limit: number
  nextPage: number
}

export interface Brands {
  _id: string
  name: string
  slug: string
  image: string
  createdAt: string
  updatedAt: string
}
