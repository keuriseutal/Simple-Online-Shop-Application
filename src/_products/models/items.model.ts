import { Product } from "./products.model";

export interface Item {
  id: number;
  total: number;
  userId: number;
  name: string;
  price: number;
  category: "Gadget" | "Clothing" | "Music" | "Merchandise" | "Appliances";
  img: string;
  quantity: number;
  stock: number;
  status: "Available" | "In Cart" | "Pending" | "Sold Out" | "Sold";
  details: string;
}
