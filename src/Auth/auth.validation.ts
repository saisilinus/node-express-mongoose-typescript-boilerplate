import Joi from 'joi';
import { password } from '../utils/custom.validation';
import { NewRegisteredUser } from '../Users/user.interfaces';

const registerBody: Record<keyof NewRegisteredUser, any> = {
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
  name: Joi.string().required(),
};

export const registerValidator = {
  body: Joi.object().keys(registerBody),
};

export const loginValidator = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const logoutValidator = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const refreshTokensValidator = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const forgotPasswordValidator = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export const resetPasswordValidator = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

export const verifyEmailValidator = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};
