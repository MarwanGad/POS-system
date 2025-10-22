import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProductInterface } from 'shared/models/product.interface';
import { CategoriesService } from 'shared/services/categories-service';
import { ProductService } from 'shared/services/product-service';

import { Categories } from './categories';

@Component({
  selector: 'category-card',
  template: '',
  standalone: false,
})
class CategoryCardStubComponent {
  @Input() category: any;
  @Input() count: any;
}

@Component({
  selector: 'cart',
  template: '',
  standalone: false,
})
class CartStubComponent {}

describe('Categories', () => {
  let component: Categories;
  let fixture: ComponentFixture<Categories>;
  let categoriesServiceMock: jasmine.SpyObj<CategoriesService>;
  let productsServiceMock: jasmine.SpyObj<ProductService>;

  const categories = [
    {
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
    },
    {
      categoryId: '1753550324472-3504',
      categoryImage:
        'https://firebasestorage.googleapis.com/v0/b/neat-planet-378416-live/o/project_assets%2F10376%2Fimages%2Fcategories%2Fbsvz6U8XlB%D8%AE%D8%B6%D8%A7%D8%B1%20%D9%85%D9%82%D8%B7%D8%B9_.png?alt=media&token=2a6f6d67-29e6-44b5-8488-4ff08e12e386',
      categoryName: 'خضار مقطع',
      pointsList: {
        '1754303777662-1933': {
          checked: false,
          points: 0,
        },
      },
    },
    {
      categoryId: '1753550373793-5924',
      categoryImage:
        'https://firebasestorage.googleapis.com/v0/b/neat-planet-378416-live/o/project_assets%2F10376%2Fimages%2Fcategories%2F6Ks6d3nJRO%D9%85%D8%AD%D8%A7%D8%B4%D9%8A_.png?alt=media&token=3a27d102-f5fe-4236-bcbf-4be49dd5d57f',
      categoryName: 'طبخة بكرا',
      pointsList: {
        '1754303777662-1933': {
          checked: false,
          points: 0,
        },
      },
    },
  ];

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
    },
  ];
  beforeEach(waitForAsync(() => {
    categoriesServiceMock = jasmine.createSpyObj('CategoriesService', [
      'getAllCategories',
      'getCategory',
    ]);

    productsServiceMock = jasmine.createSpyObj('ProductsService', [
      'getAllProducts',
      'getProductsByCategoryId',
      'countAllProducts',
    ]);

    TestBed.configureTestingModule({
      declarations: [Categories, CartStubComponent, CategoryCardStubComponent],
      providers: [
        { provide: CategoriesService, useValue: categoriesServiceMock },
        { provide: ProductService, useValue: productsServiceMock },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(Categories);
        component = fixture.componentInstance;
        fixture.detectChanges;
      });
  }));

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('gets all the categories from service and counts products per category', () => {
      productsServiceMock.getAllProducts.and.returnValue(
        products as ProductInterface[]
      );

      component.ngOnInit();

      expect(categoriesServiceMock.getAllCategories).toHaveBeenCalled();
      expect(productsServiceMock.getAllProducts).toHaveBeenCalled();

      expect(component.categoryCount).toEqual({
        '1753550377977-5792': 2,
      });
    });
  });
});
