import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IProductDoc, NewCreatedProduct, UpdateProductBody } from './product.interfaces';
import Product from './product.model';
import { stockService } from '../stock';

/**
 * Create a product
 * @param {NewCreatedProduct} productBody
 * @param {string} userId
 * @returns {Promise<IProductDoc>}
 */
export const createProduct = async (productBody: NewCreatedProduct, userId: string): Promise<IProductDoc> => {
  const product = await Product.create({ ...productBody, userId });
  if (productBody?.quantity)
    await stockService.updateStockByProductId([{ productId: product.id, quantity: productBody.quantity }]);
  return product.populate('stock', 'quantity');
};

/**
 * Query for products
 * @param {Object} filter - Mongo filter
 * @param {IOptions} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryProducts = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const products = await Product.paginate(filter, {
    ...options,
    populate: 'stock',
    populateSelect: 'quantity',
  });
  return products;
};

/**
 * Get product by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IProductDoc | null>}
 */
export const getProductById = async (id: mongoose.Types.ObjectId): Promise<IProductDoc | null> =>
  Product.findById(id).populate('stock', 'quantity');

/**
 * Update product by id
 * @param {mongoose.Types.ObjectId} productId
 * @param {UpdateProductBody} updateBody
 * @param {string} userId
 * @returns {Promise<IProductDoc | null>}
 */
export const updateProductById = async (
  productId: mongoose.Types.ObjectId,
  updateBody: UpdateProductBody,
  userId: string
): Promise<IProductDoc | null> => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  let productUpdate = { ...updateBody };
  if (updateBody?.quantity) {
    const { quantity, ...restUpdateBody } = updateBody;
    productUpdate = restUpdateBody;
    await stockService.updateStockByProductId([{ productId: product.id, quantity }]);
  }
  Object.assign(product, { ...productUpdate, userId });
  await product.save();
  return product.populate('stock', 'quantity');
};

/**
 * Delete product by id
 * @param {mongoose.Types.ObjectId} productId
 * @returns {Promise<IProductDoc | null>}
 */
export const deleteProductById = async (productId: mongoose.Types.ObjectId): Promise<IProductDoc | null> => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await product.deleteOne();
  return product;
};
