import { Document, Model, Types } from 'mongoose';

export interface IStock {
  quantity: number;
  productId: Types.ObjectId;
}

export interface IStockDoc extends IStock, Document {
  populate: (path: string) => Promise<IStockDoc>;
}

export interface IStockModel extends Model<IStockDoc> {}

export type UpdateStockBody = IStock;

export type NewCreatedStock = Omit<IStock, 'productId'>;
