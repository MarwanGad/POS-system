import { CategoryInterface } from './../models/category.interface';
import { CategoriesService } from './categories-service';
import { TestBed } from '@angular/core/testing';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let categories: CategoryInterface[];
  categories = [
    {
      categoryId: '2',
      categoryName: 'Electronics',
      categoryImage: 'asdas.com',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoriesService],
    });

    categoriesService = TestBed.inject(CategoriesService);
  });

  it('creates category service', () => {
    expect(categoriesService).toBeTruthy();
  });

  describe('getAllCategories', () => {
    it('returns all the categories', () => {
      categoriesService.categories = categories;

      expect(categoriesService.getAllCategories()).toEqual(categories);
    });
  });

  describe('getCategory', () => {
    it('gets a category by its category id', () => {
      categoriesService.categories = [...categories];

      const result = categoriesService.getCategoryById('2');

      expect(result).toEqual(categories[0]);
    });

    it('returns undefined if there is no category with the given ID', () => {
      const result = categoriesService.getCategoryById('3');

      expect(result).toBeUndefined();
    });
  });
});
