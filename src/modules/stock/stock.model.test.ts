import faker from '@faker-js/faker';
import mongoose from 'mongoose';
import { IStock, NewCreatedStock } from './stock.interfaces';
import Stock from './stock.model';

const stockMock: IStock = {
  quantity: faker.datatype.number(),
  productId: new mongoose.Types.ObjectId(),
};

describe('Stock model', () => {
  describe('Stock validation', () => {
    let newStock: NewCreatedStock;
    beforeEach(() => {
      newStock = {
        ...stockMock,
      };
    });

    test('should correctly validate a valid stock', async () => {
      await expect(new Stock(newStock).validate()).resolves.toBeUndefined();
    });
  });
});
