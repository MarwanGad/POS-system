import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';
import { cartItemInterface } from 'shared/models/cartItem.interface';
import { CartService } from 'shared/services/cart-service';
import { ProductService } from 'shared/services/product-service';

import { Navbar } from './navbar';

@Component({
  selector: 'app-account',
  template: '',
  standalone: false,
})
class AccountStubComponent {}

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let productServiceMock: jasmine.SpyObj<ProductService>;
  let cartServiceMock: jasmine.SpyObj<CartService>;
  let authMock: Partial<AuthService>;

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
      quantity: 2,
    },
    {
      categoriesIds: ['1753550377977-5792'],
      date: '7/26/2025',
      estimatedDeliveryTime: '',
      imageUrl: [
        'https://firebasestorage.googleapis.com/v0/b/neat-planet-378416-live/o/project_assets%2F10376%2Fimages%2Fproducts%2F4sf5jBmzRF6211110001571.webp?alt=media&token=a0475b37-2da4-4661-aa7b-d32f1b8b4e94',
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
        '<p>الخس الامريكي الكابوتشا مميز لتلوين السلطه وهو مفيد للصحه ويعتبر من الورقيات اللذيذه تباع بالحبه مهما كان حجمها&nbsp;</p>',
      productFormat: 'physical',
      productName: 'خس امريكي (كابوتشا)',
      productSKU: '1 حبه',
      productStock: 996,
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
      regularPrice: 4.18,
      salePrice: '',
      sizeChartUrl: '',
      quantity: 2,
    },
  ];
  beforeEach(waitForAsync(() => {
    productServiceMock = jasmine.createSpyObj('ProductService', [
      'getAllProducts',
      'getProductsByCategoryId',
      'countAllProducts',
    ]);

    cartServiceMock = jasmine.createSpyObj('CartService', [
      'addProduct',
      'removeProduct',
      'decrementProductQuantity',
      'clearCart',
    ]);

    cartServiceMock.cart$ = of(cartItems as cartItemInterface[]);

    authMock = {
      isAuthenticated$: of(true),
    };

    TestBed.configureTestingModule({
      declarations: [Navbar, AccountStubComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: AuthService, useValue: authMock },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(Navbar);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('gets cart items', () => {
      component.ngOnInit();

      expect(component.currentCart).toEqual(cartItems as cartItemInterface[]);
    });

    it('gets the count of all availiable prodcuts', () => {
      productServiceMock.countAllProducts.and.returnValue(4);

      component.ngOnInit();

      expect(productServiceMock.countAllProducts).toHaveBeenCalled();
      expect(component.productsQuantity).toBe(4);
    });

    it('calculates the number of items in the cart', () => {
      const expectedNumber = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );

      component.ngOnInit();

      expect(component.cartProductsQuantity).toBe(expectedNumber);
    });
  });
});
