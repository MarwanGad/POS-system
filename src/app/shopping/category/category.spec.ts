import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProductInterface } from 'shared/models/product.interface';
import { CategoriesService } from 'shared/services/categories-service';
import { ProductService } from 'shared/services/product-service';
import { Component } from '@angular/core';
import { Category } from './category';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'cart',
  template: '',
  standalone: false,
})
class CartStubComponent {}

describe('Category', () => {
  let component: Category;
  let fixture: ComponentFixture<Category>;
  let productServiceMock: jasmine.SpyObj<ProductService>;
  let categoriesServiceMock: jasmine.SpyObj<CategoriesService>;
  let routeMock: jasmine.SpyObj<ActivatedRoute>;
  const category = {
    categoryId: '1753550266726-7213',
    categoryImage:
      'https://firebasestorage.googleapis.com/v0/b/neat-planet-378416-live/o/project_assets%2F10376%2Fimages%2Fcategories%2Fntg9cdmbDf%D8%A7%D9%84%D8%AE%D8%B6%D8%A7%D8%B1.png?alt=media&token=b06402a9-2313-4749-9cf7-74afc4ee9d15',
    categoryName: 'الخضار',
    pointsList: {
      '1754303777662-1933': {
        checked: false,
        points: 0,
      },
    },
  };

  const products = [
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
    },
  ];

  beforeEach(waitForAsync(() => {
    productServiceMock = jasmine.createSpyObj('ProductService', [
      'getAllProducts',
      'getProductsByCategoryId',
      'countAllProducts',
    ]);

    categoriesServiceMock = jasmine.createSpyObj('CategoriesService', [
      'getAllCategories',
      'getCategoryById',
    ]);
    routeMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1753550266726-7213'),
        },
      },
    } as any;

    TestBed.configureTestingModule({
      declarations: [Category, CartStubComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: CategoriesService, useValue: categoriesServiceMock },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(Category);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('gets category by cateogory id', () => {
      component.categoryId = '1753550266726-7213';
      categoriesServiceMock.getCategoryById.and.callFake(() => category);

      component.ngOnInit();

      expect(categoriesServiceMock.getCategoryById).toHaveBeenCalledWith(
        component.categoryId
      );
      expect(component.currentCategory).toEqual(category);
    });

    it('gets products with given category id', () => {
      component.categoryId = '1753550266726-7213';
      productServiceMock.getProductsByCategoryId.and.callFake(
        () => products as ProductInterface[]
      );

      component.ngOnInit();

      expect(productServiceMock.getProductsByCategoryId).toHaveBeenCalledWith(
        component.categoryId
      );
      expect(component.products).toEqual(products);
    });

    it('gives nothing when categortyId is null', () => {
      component.categoryId = null;

      component.ngOnInit();

      expect(component.currentCategory).toBeNull();
      expect(component.products).toEqual([]);
    });
  });
});
