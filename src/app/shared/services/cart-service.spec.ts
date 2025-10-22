import { CartService } from './cart-service';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ProductInterface } from 'shared/models/product.interface';

const product = {
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

describe('CartService', () => {
  let cartService: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService],
    });

    cartService = TestBed.inject(CartService);
  });

  it('creates  cart service', () => {
    expect(cartService).toBeTruthy();
  });

  describe('addProduct', () => {
    it('adds new product to the cart', () => {
      let newProduct = { ...product };
      let newCartItem = { ...newProduct, quantity: 1 };

      cartService.addProduct(newProduct);

      expect(cartService.cartItems).toEqual([newCartItem]);
    });

    it('adds an existing product', () => {
      let extitngProduct = { ...product, quantity: 3 };

      cartService.cartItems = [extitngProduct];
      cartService.addProduct({ ...product });

      expect(cartService.cartItems.length).toBe(1);
      expect(cartService.cartItems[0]).toEqual({
        ...extitngProduct,
        quantity: 4,
      });
    });
  });

  describe('removeProduct', () => {
    it('removes product from the cart', () => {
      let existingProduct = { ...product, quantity: 5 };
      cartService.cartItems = [existingProduct];

      cartService.removeProduct(product);

      expect(cartService.cartItems).toEqual([]);
    });
  });

  describe('decrementProductQuantity', () => {
    it('returns without doing anything when the product wasnt in the cart', () => {
      const notExistingProduct = {
        ...product,
        quantity: 4,
        productName: 'not in the cart',
      };

      const result = cartService.decrementProductQuantity(notExistingProduct);

      expect(result).toBeUndefined();
    });

    it('decrements quantity of a product that already have quantity more than 1', () => {
      const existingProduct = { ...product, quantity: 4 };
      cartService.cartItems = [existingProduct];

      cartService.decrementProductQuantity(existingProduct);

      expect(cartService.cartItems.length).toBe(1);
      expect(cartService.cartItems).toEqual([
        { ...existingProduct, quantity: 3 },
      ]);
    });

    it('removes the product from cart when quantity is 1', () => {
      const existingProduct = { ...product, quantity: 1 };
      cartService.cartItems = [existingProduct];

      cartService.decrementProductQuantity(existingProduct);

      expect(cartService.cartItems).toEqual([]);
    });
  });

  describe('clearCart', () => {
    it('clears the cart', () => {
      const cartItem = { ...product, quantity: 5 };

      cartService.clearCart();

      expect(cartService.cartItems).toEqual([]);
    });
  });

  describe('updateCart', () => {
    it('updates the cart with the added/removed products', async () => {
      const cartItem = { ...product, quantity: 2 };
      cartService.cartItems = [cartItem];

      cartService.updateCart();
      const emittedValue = await firstValueFrom(cartService.cart$);

      expect(emittedValue).toEqual([cartItem]);
    });
  });
});
