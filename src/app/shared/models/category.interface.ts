export interface CategoryInterface {
 
  categoryId: string;
  categoryName: string;
  categoryImage: string;
  pointsList?: Record<string, { checked: boolean; points: number }>;

}