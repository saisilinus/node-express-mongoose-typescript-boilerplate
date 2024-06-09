import mongoose from 'mongoose';
import paginate from '../paginate/paginate';
import toJSON from '../toJSON/toJSON';
import { IStockDoc, IStockModel } from './stock.interfaces';

const stockSchema = new mongoose.Schema<IStockDoc, IStockModel>(
  {
    quantity: {
      type: Number,
      default: 0,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
stockSchema.plugin(toJSON);
stockSchema.plugin(paginate);

const Stock = mongoose.model<IStockDoc, IStockModel>('Stock', stockSchema);

export default Stock;
