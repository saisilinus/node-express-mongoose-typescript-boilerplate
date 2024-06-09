import mongoose from 'mongoose';
import paginate from '../paginate/paginate';
import toJSON from '../toJSON/toJSON';
import { IProductDoc, IProductModel } from './product.interfaces';
import { Stock } from '../stock';

const productSchema = new mongoose.Schema<IProductDoc, IProductModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock',
    },
  },
  {
    timestamps: true,
  }
);

productSchema.post('save', async function (doc: IProductDoc, next) {
  try {
    if (!doc.stock) {
      const stock = await Stock.create({ productId: doc.id });
      doc.set({ stock: stock.id });
      await doc.save();
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

const Product = mongoose.model<IProductDoc, IProductModel>('Product', productSchema);

export default Product;
