import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CartService } from 'shared/services/cart-service';

import { CartItemCard } from './cart-item-card';

describe('Cart Item Card', () => {
  let component: CartItemCard;
  let fixture: ComponentFixture<CartItemCard>;
  let cartServiceMock: jasmine.SpyObj<CartService>;

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

  beforeEach(waitForAsync(() => {
    cartServiceMock = jasmine.createSpyObj('CartService', [
      'addProduct',
      'removeProduct',
      'decrementProductQuantity',
      'clearCart',
    ]);
    TestBed.configureTestingModule({
      declarations: [CartItemCard],
      providers: [{ provide: CartService, useValue: cartServiceMock }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CartItemCard);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  describe('removeFromCart', () => {
    it('calls the service to remove the given product', () => {
      component.product = product;

      component.removeFromCart();

      expect(cartServiceMock.removeProduct).toHaveBeenCalledWith(product);
    });
  });

  describe('incrementItem', () => {
    it('calls the service to increment the given product', () => {
      component.product = product;

      component.incrementItem();

      expect(cartServiceMock.addProduct).toHaveBeenCalledWith(product);
    });
  });

  describe('decrementItem', () => {
    it('calls the service to decrement the given product', () => {
      component.product = { ...product, quantity: 5 };

      component.decrementItem();

      expect(cartServiceMock.decrementProductQuantity).toHaveBeenCalledWith({
        ...product,
        quantity: 5,
      });
    });
  });
});
