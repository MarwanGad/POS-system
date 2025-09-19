import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';
import { CartService } from 'shared/services/cart-service';
import { ToastService } from 'shared/services/toast-service';

import { ProductCard } from './product-card';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  let authServiceSpy: Partial<AuthService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  let el: DebugElement;

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
    authServiceSpy = {
      user$: of({
        'https://auth.myapp.com/roles': ['admin'],
      }),
    };

    cartServiceSpy = jasmine.createSpyObj('CartService', [
      'addProduct',
      'removeProduct',
      'decrementProductQuantity',
      'clearCart',
    ]);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    TestBed.configureTestingModule({
      declarations: [ProductCard],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ProductCard);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        fixture.detectChanges();
      });
  }));

  it('creates the product card', () => {
    expect(component).toBeTruthy();
  });

  describe('addToCart', () => {
    it('adds the product to the cart', () => {
      cartServiceSpy.addProduct.and.callFake(() => product);

      component.addToCart(product);

      expect(cartServiceSpy.addProduct).toHaveBeenCalledWith(product);
    });

    it('do nothing when not passing a product', () => {
      cartServiceSpy.addProduct.and.callFake(() => product);

      component.addToCart(null);

      expect(cartServiceSpy.addProduct).not.toHaveBeenCalled();
    });

    it('shows the toast with the correct product details added to cart', () => {
      const toast = { header: 'تم إضافة المنتج', body: product.productName };
      toastServiceSpy.show.and.callFake(() => toast);

      component.addToCart(product);

      expect(toastServiceSpy.show).toHaveBeenCalledWith(toast);
    });
  });

  describe('gets user roles', () => {
    it('gets the user roles', () => {
      component.ngOnInit();

      expect(component.roles).toEqual(['admin']);
    });
  });
});
