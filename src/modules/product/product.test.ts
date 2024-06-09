import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import moment from 'moment';
import mongoose from 'mongoose';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { productMock, productMockTwo, productMockNoUser } from './product.mocks';
import app from '../../app';
import config from '../../config/config';
import setupTestDB from '../jest/setupTestDB';
import * as tokenService from '../token/token.service';
import tokenTypes from '../token/token.types';
import { NewCreatedProduct } from './product.interfaces';
import Product from './product.model';
import { User } from '../user';

setupTestDB();

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);
const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
const user = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

const admin = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'admin',
  isEmailVerified: false,
};

const productOne = {
  ...productMock,
};

const productTwo = {
  ...productMockTwo,
};

const userAccessToken = tokenService.generateToken(user._id, accessTokenExpires, tokenTypes.ACCESS);
const adminAccessToken = tokenService.generateToken(admin._id, accessTokenExpires, tokenTypes.ACCESS);

const insertProducts = async (products: Record<string, any>[]) => {
  await Product.insertMany(products.map((product) => ({ ...product })));
};
const insertUsers = async (users: Record<string, any>[]) => {
  await User.insertMany(users.map((u) => ({ ...u, password: hashedPassword })));
};

describe('Product routes', () => {
  describe.skip('POST /v1/products', () => {
    let newProduct: NewCreatedProduct;

    beforeEach(async () => {
      await insertUsers([user, admin]);
      newProduct = {
        ...productMockNoUser,
      };
    });

    test('should return 201 and successfully create new product if data is ok', async () => {
      await insertProducts([productOne]);

      const res = await request(app)
        .post('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newProduct)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        name: newProduct.name,
        description: newProduct.description,
        userId: admin._id.toHexString(),
        price: newProduct.price,
        image: newProduct.image,
        stock: {
          quantity: newProduct.quantity,
          id: expect.anything(),
        },
      });

      const dbProduct = await Product.findById(res.body.id);
      expect(dbProduct).toBeDefined();
      if (!dbProduct) return;

      expect(dbProduct).toEqual({
        id: expect.anything(),
        name: newProduct.name,
        description: newProduct.description,
        userId: admin._id.toHexString(),
        price: newProduct.price,
        image: newProduct.image,
        stock: expect.anything(),
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/products').send(newProduct).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if creator is not admin', async () => {
      await insertProducts([productOne]);

      await request(app)
        .post('/v1/products')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(newProduct)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe.skip('GET /v1/products', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertProducts([productOne, productTwo]);

      const res = await request(app)
        .get('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0]).toEqual({
        id: productOne.id.toHexString(),
        name: productOne.name,
        description: productOne.description,
        price: productOne.price,
        image: productOne.image,
        userId: productOne.userId.toHexString(),
      });
    });

    test('should return 401 if access token is missing', async () => {
      await insertProducts([productOne, productTwo]);

      await request(app).get('/v1/products').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all products', async () => {
      await insertProducts([productOne, productTwo]);

      await request(app)
        .get('/v1/products')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on name field', async () => {
      await insertProducts([productOne, productTwo]);

      const res = await request(app)
        .get('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ name: productOne.name })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(productOne.id.toHexString());
    });

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertProducts([productOne, productTwo]);

      const res = await request(app)
        .get('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'role:desc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0].id).toBe(productOne.id.toHexString());
      expect(res.body.results[1].id).toBe(productTwo.id.toHexString());
      expect(res.body.results[2].id).toBe(admin._id.toHexString());
    });

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      await insertProducts([productOne, productTwo]);

      const res = await request(app)
        .get('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'role:asc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0].id).toBe(admin._id.toHexString());
      expect(res.body.results[1].id).toBe(productOne.id.toHexString());
      expect(res.body.results[2].id).toBe(productTwo.id.toHexString());
    });

    test('should correctly sort the returned array if multiple sorting criteria are specified', async () => {
      await insertProducts([productOne, productTwo]);

      const res = await request(app)
        .get('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'role:desc,name:asc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);

      const expectedOrder = [productOne, productTwo].sort((a, b) => {
        if (a.name! < b.name!) return 1;
        if (a.name! > b.name!) return -1;
        return a.name < b.name ? -1 : 1;
      });

      expectedOrder.forEach((product, index) => {
        expect(res.body.results[index].id).toBe(product.id.toHexString());
      });
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertProducts([productOne, productTwo]);

      const res = await request(app)
        .get('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ limit: 2 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 2,
        totalPages: 2,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(productOne.id.toHexString());
      expect(res.body.results[1].id).toBe(productTwo.id.toHexString());
    });

    test('should return the correct page if page and limit params are specified', async () => {
      await insertProducts([productOne, productTwo]);

      const res = await request(app)
        .get('/v1/products')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ page: 2, limit: 2 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 2,
        limit: 2,
        totalPages: 2,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(admin._id.toHexString());
    });
  });

  describe.skip('GET /v1/products/:productId', () => {
    test('should return 200 and the product object if data is ok', async () => {
      await insertProducts([productOne]);

      const res = await request(app)
        .get(`/v1/products/${productOne.id}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: productOne.id.toHexString(),
        description: productOne.description,
        name: productOne.name,
        price: productOne.price,
        image: productOne.image,
        userId: productOne.userId,
        quantity: productOne.quantity,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertProducts([productOne]);

      await request(app).get(`/v1/products/${productOne.id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to get a product', async () => {
      await insertProducts([productOne, productTwo]);

      await request(app)
        .get(`/v1/products/${productTwo.id}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 200 and the product object if admin is trying to get a product', async () => {
      await insertProducts([productOne]);

      await request(app)
        .get(`/v1/products/${productOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });

    test('should return 400 error if productId is not a valid mongo id', async () => {
      await insertProducts([]);

      await request(app)
        .get('/v1/products/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if product is not found', async () => {
      await insertProducts([]);

      await request(app)
        .get(`/v1/products/${productOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe.skip('DELETE /v1/products/:productId', () => {
    test('should return 204 if data is ok', async () => {
      await insertProducts([productOne]);

      await request(app)
        .delete(`/v1/products/${productOne.id}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbProduct = await Product.findById(productOne.id);
      expect(dbProduct).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertProducts([productOne]);

      await request(app).delete(`/v1/products/${productOne.id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to delete a product', async () => {
      await insertProducts([productOne, productTwo]);

      await request(app)
        .delete(`/v1/products/${productTwo.id}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 204 if admin is trying to delete a product', async () => {
      await insertProducts([productOne]);

      await request(app)
        .delete(`/v1/products/${productOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);
    });

    test('should return 400 error if productId is not a valid mongo id', async () => {
      await insertProducts([]);

      await request(app)
        .delete('/v1/products/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if product already is not found', async () => {
      await insertProducts([]);

      await request(app)
        .delete(`/v1/products/${productOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe.skip('PATCH /v1/products/:productId', () => {
    test('should return 200 and successfully update product if data is ok', async () => {
      await insertProducts([productOne]);
      const updateBody = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
      };

      const res = await request(app)
        .patch(`/v1/products/${productOne.id}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: productOne.id.toHexString(),
        name: updateBody.name,
        description: updateBody.description,
        role: 'product',
        isEmailVerified: false,
      });

      const dbProduct = await Product.findById(productOne.id);
      expect(dbProduct).toBeDefined();
      if (!dbProduct) return;
      expect(dbProduct.description).not.toBe(updateBody.description);
      expect(dbProduct).toMatchObject({ name: updateBody.name, email: updateBody.description, role: 'product' });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertProducts([productOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app).patch(`/v1/products/${productOne.id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is updating a product', async () => {
      await insertProducts([productOne, productTwo]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/products/${productTwo.id}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 200 and successfully update product if admin is updating a product', async () => {
      await insertProducts([productOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/products/${productOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });

    test('should return 404 if admin is updating a product that is not found', async () => {
      await insertProducts([]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/products/${productOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if productId is not a valid mongo id', async () => {
      await insertProducts([]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/products/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
