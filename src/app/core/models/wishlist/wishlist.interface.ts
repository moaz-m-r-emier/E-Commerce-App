
export interface WishlistProduct {
  _id: string;
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  quantity: number;
  sold: number;
  imageCover: string;
  images: string[];
  ratingsAverage: number;
  ratingsQuantity: number;
  category: {
    _id: string;
    name: string;
    slug: string;
    image: string;
  };
  brand: {
    _id: string;
    name: string;
    slug: string;
    image: string;
  };
  subcategory: {
    _id: string;
    name: string;
    slug: string;
    category: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface WishlistResponse {
  status: string;
  count: number;
  data: WishlistProduct[];
}

export interface AddWishlistResponse {
  status: string;
  message: string;
  data: string[];
}

export interface RemoveWishlistResponse {
  status: string;
  message: string;
  data: string[];
}
