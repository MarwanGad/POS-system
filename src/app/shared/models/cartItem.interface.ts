import { ProductInterface } from "./product.interface";

export interface cartItemInterface extends ProductInterface  {
    quantity: number;
}