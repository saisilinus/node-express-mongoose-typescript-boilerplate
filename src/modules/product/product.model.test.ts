import { productMockNoId } from '@/modules/product/product.mocks';
import { NewCreatedProduct } from './product.interfaces';
import Product from './product.model';

describe('Product model', () => {
  describe('Product validation', () => {
    let newProduct: NewCreatedProduct;
    beforeEach(() => {
      newProduct = {
        ...productMockNoId,
      };
    });

    test('should correctly validate a valid product', async () => {
      await expect(new Product(newProduct).validate()).resolves.toBeUndefined();
    });
  });
});
