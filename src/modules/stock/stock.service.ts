import httpStatus from 'http-status';
import { Types } from 'mongoose';
import ApiError from '../errors/ApiError';
import { IStockDoc, UpdateStockBody } from './stock.interfaces';
import Stock from './stock.model';

/**
 * Get stock by id
 * @param {mongoose.Types.ObjectId} productId
 * @returns {Promise<IStockDoc | null>}
 */
export const getStockByProductId = async (productId: Types.ObjectId): Promise<IStockDoc | null> =>
  Stock.findOne({ productId });

/**
 * Update stock by id
 * @param {UpdateStockBody[]} updateStock
 * @returns {Promise<IStockDoc | null>}
 */
export const updateStockByProductId = async (updateStock: UpdateStockBody[]): Promise<IStockDoc[] | null> => {
  const updatedStocks = await Promise.all(
    updateStock.map(async ({ productId, quantity }) => {
      if (!productId) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'ProductId is required');
      }

      const stock = await getStockByProductId(productId);
      if (!stock) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Stock not found');
      }

      stock.quantity = quantity !== undefined ? quantity : stock.quantity;
      await stock.save();
      return stock.populate('productId');
    })
  );
  return updatedStocks;
};

/**
 * Update stock by id
 * @param {UpdateStockBody} updateStock
 * @returns {Promise<IStockDoc | null>}
 */
export const buyProduct = async ({ productId, quantity }: UpdateStockBody): Promise<IStockDoc | null> => {
  if (!productId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'ProductId is required');
  }
  const stock = await getStockByProductId(productId);
  if (!stock) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stock not found');
  }
  stock.quantity -= quantity;
  await stock.save();
  return stock.populate('productId');
};
