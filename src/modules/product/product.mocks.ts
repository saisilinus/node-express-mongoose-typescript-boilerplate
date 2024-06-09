// eslint-disable-next-line import/no-extraneous-dependencies
import faker from '@faker-js/faker';
import mongoose from 'mongoose';
import { IProduct } from './product.interfaces';

export const productMockNoId: IProduct = {
  name: faker.name.findName(),
  description: faker.commerce.productDescription(),
  userId: new mongoose.Types.ObjectId(),
  image: faker.image.imageUrl(),
  price: faker.datatype.number(),
  quantity: faker.datatype.number(),
};
export const productMockNoUser = {
  name: faker.name.findName(),
  description: faker.commerce.productDescription(),
  image: faker.image.imageUrl(),
  price: faker.datatype.number(),
  quantity: faker.datatype.number(),
};
export const productMock = {
  id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  description: faker.commerce.productDescription(),
  userId: new mongoose.Types.ObjectId(),
  image: faker.image.imageUrl(),
  price: faker.datatype.number(),
  quantity: faker.datatype.number(),
};
export const productMockTwo = {
  id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  description: faker.commerce.productDescription(),
  userId: new mongoose.Types.ObjectId(),
  image: faker.image.imageUrl(),
  price: faker.datatype.number(),
  quantity: faker.datatype.number(),
};
