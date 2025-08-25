export interface ProductInterface {
  categoriesIds: string[];
  date: string;
  estimatedDeliveryTime?: number;
  estimatedDeliveryUnit?: string;
  imageUrl: string[];
  pointsList: {
    [key: string]: {
      checked: boolean;
      points: number;
    };
  };
  productAttributes: {
    name: string;
    value: string;
  }[];
  productDescription: string;
  productFormat: string;
  productName: string;
  productSKU: string;
  productStock: number;
  productType: string;
  productVariations: {
    image: string;
    regularPrice: string;
    salePrice: string;
    sku: string;
    stock: string;
    values: string;
  }[];
  regularPrice: number;
  salePrice: string;
  sizeChartUrl: string;
}
