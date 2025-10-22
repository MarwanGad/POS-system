import { ProductInterface } from './../models/product.interface';
import { ProductService } from './product-service';
import { TestBed } from '@angular/core/testing';

describe('ProductService', () => {
  let productService: ProductService;
  let product: ProductInterface;

  product = {
    categoriesIds: ['1753550377977-5792'],
    date: '7/26/2025',
    estimatedDeliveryTime: 1,
    estimatedDeliveryUnit: 'days',
    imageUrl: [
      'https://firebasestorage.googleapis.com/v0/b/neat-planet-378416-live/o/project_assets%2F10376%2Fimages%2Fproducts%2FeHcXnWY2f0image.jpg?alt=media&token=2ddfb118-cf12-472e-881d-efa4163f918c',
    ],
    pointsList: {
      '1754303777662-1933': {
        checked: false,
        points: 0,
      },
    },
    productAttributes: [
      {
        name: '',
        value: '',
      },
    ],
    productDescription:
      '<p>أوراق الريحان نبات عطري يستخدم على نطاق واسع في الطهي وهي تستخدم طازجه او مجففه في العديد من الأطباق مثل السلطات والشوربات والصلصات واللحوم والدجاج والاسماك</p>',
    productFormat: 'physical',
    productName: 'أوراق الريحان ',
    productSKU: '1 ربطه ',
    productStock: 108,
    productType: 'simple',
    productVariations: [
      {
        image: '',
        regularPrice: '',
        salePrice: '',
        sku: '',
        stock: '',
        values: '',
      },
    ],
    regularPrice: 2,
    salePrice: '',
    sizeChartUrl: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService],
    });
    productService = TestBed.inject(ProductService);
  });

  it('creates products service', () => {
    expect(productService).toBeTruthy();
  });

  describe('getAllProducts', () => {
    it('returns all products', () => {
      productService.products = [product];

      const result = productService.getAllProducts();

      expect(result.length).toBe(1);
      expect(result).toEqual([product]);
    });
  });

  describe('getProductsByCategoryId', () => {
    it('gets all products with the given category id', () => {
      productService.products = [product];

      const result =
        productService.getProductsByCategoryId('1753550377977-5792');

      expect(result.length).toBe(1);
      expect(result[0]).toEqual(product);
    });

    it('returns empty array when no products with the given category id', () => {
      productService.products = [product];

      const result =
        productService.getProductsByCategoryId('1753550377977-1111');

      expect(result).toEqual([]);
    });
  });

  describe('getProductsQuantity', () => {
    it('returns the number of availiable products in the store', () => {
      productService.products = [product];

      const result = productService.countAllProducts();

      expect(result).toBe(productService.products.length);
    });

    it('returns zero when no there is no products', () => {
      productService.products = [];

      const result = productService.countAllProducts();

      expect(result).toBe(0);
    });
  });
});
