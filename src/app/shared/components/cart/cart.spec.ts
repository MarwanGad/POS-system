import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { CartService } from 'shared/services/cart-service';

import { Cart } from './cart';

@Component({
  selector: 'receipt',
  template: '',
  standalone: false,
})
class ReceiptStubComponent {
  @Input() cart: any;
}

@Component({
  selector: 'cart-item-card',
  template: '',
  standalone: false,
})
class CartItemStubComponent {
  @Input() product: any;
}

describe('Cart', () => {
  let component: Cart;
  let fixture: ComponentFixture<Cart>;
  let cartServiceMock: jasmine.SpyObj<CartService>;
  const cartItems = [
    {
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
      quantity: 1,
    },
    {
      categoriesIds: ['1753550377977-5712'],
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
      quantity: 3,
    },
  ];

  beforeEach(waitForAsync(() => {
    cartServiceMock = jasmine.createSpyObj('CartService', [
      'addProduct',
      'removeProduct',
      'decrementProductQuantity',
      'clearCart',
    ]);
    cartServiceMock.cart$ = of(cartItems);

    TestBed.configureTestingModule({
      declarations: [Cart, ReceiptStubComponent, CartItemStubComponent],
      providers: [{ provide: CartService, useValue: cartServiceMock }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(Cart);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnit', () => {
    it('getting cart items from cart service', () => {
      component.ngOnInit();

      expect(component.currentCart).toEqual(cartItems);
    });

    it('calculates the correct total price', () => {
      const expectedTotalPrice = cartItems.reduce(
        (sum, item) => sum + item.regularPrice * item.quantity,
        0
      );

      component.ngOnInit();

      expect(component.totalPrice).toEqual(expectedTotalPrice);
    });

    it('gets the correct number of products in the cart', () => {
      const expectedTotalNumber = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );

      component.ngOnInit();

      expect(component.cartProductsQuantity).toEqual(expectedTotalNumber);
    });
  });

  describe('clearCart', () => {
    it('clears the cart', () => {
      component.clearCart();

      expect(cartServiceMock.clearCart).toHaveBeenCalled();
    });
  });

  describe('placeOrder', () => {
    it('adds cart items in receiptCart before placeing the order', () => {
      component.currentCart = cartItems;

      component.placeOrder();

      expect(component.recepitCart).toEqual(cartItems);
    });

    it('clears the cart after placing the order', () => {
      cartServiceMock.clearCart.and.callFake(() => {
        cartServiceMock.cart$ = of([]);
      });

      component.placeOrder();
      component.ngOnInit();

      expect(cartServiceMock.clearCart).toHaveBeenCalled();
      expect(component.currentCart).toEqual([]);
    });
  });
});
