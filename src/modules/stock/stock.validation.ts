import Joi from 'joi';
import { objectId } from '../validate/custom.validation';

export const updateProductStock = {
  body: Joi.object({
    products: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().custom(objectId).required(),
          quantity: Joi.number().required(),
        })
      )
      .required(),
  }),
};

export const buyProduct = {
  body: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
    quantity: Joi.number().required(),
  }),
};
