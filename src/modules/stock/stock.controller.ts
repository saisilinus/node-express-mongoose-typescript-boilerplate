import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as stockService from './stock.service';

export const updateProductStock = catchAsync(async (req: Request, res: Response) => {
  if (req.body.products) {
    const products = await stockService.updateStockByProductId(req.body.products);
    res.send(products);
  }
});

export const buyProduct = catchAsync(async (req: Request, res: Response) => {
  const products = await stockService.buyProduct(req.body);
  res.send(products);
});
