export interface CartDetail {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: string;
  session_id: string;
  status: string;
}
