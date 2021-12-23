import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { createUser } from '../user/user.service';
import { generateAuthTokens, generateResetPasswordToken, generateVerifyEmailToken } from '../token/token.service';
import { loginUserWithEmailAndPassword, logout, refreshAuth, resetPassword, verifyEmail } from './auth.service';
import {
  sendAccountCreated,
  sendResetPasswordEmail,
  sendSuccessfulRegistration,
  sendVerificationEmail,
} from '../email/email.service';
import config from '../../config/config';
import { AccessAndRefreshTokens } from '../token/token.interfaces';

export const sendTokens = (res: Response, tokens: AccessAndRefreshTokens) => {
  res.cookie('accessToken', tokens.access, config.jwt.cookieOptions);
  res.cookie('refreshToken', tokens.refresh, config.jwt.cookieOptions);
};

export const registerController = catchAsync(async (req: Request, res: Response) => {
  const user = await createUser(req.body);
  const tokens = await generateAuthTokens(user);
  const verifyEmailToken = await generateVerifyEmailToken(user);
  await sendSuccessfulRegistration(user.email, verifyEmailToken, user.name);
  sendTokens(res, tokens);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

export const loginController = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await loginUserWithEmailAndPassword(email, password);
  const tokens = await generateAuthTokens(user);
  sendTokens(res, tokens);
  res.send({ user, tokens });
});

export const logoutController = catchAsync(async (req: Request, res: Response) => {
  await logout(req.cookies.refreshToken);
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(httpStatus.NO_CONTENT).send();
});

export const refreshTokensController = catchAsync(async (req: Request, res: Response) => {
  const tokens = await refreshAuth(req.cookies.refreshToken);
  sendTokens(res, tokens);
  res.status(httpStatus.OK).send();
});

export const forgotPasswordController = catchAsync(async (req: Request, res: Response) => {
  const resetPasswordToken = await generateResetPasswordToken(req.body.email);
  await sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const resetPasswordController = catchAsync(async (req: Request, res: Response) => {
  await resetPassword(req.cookies.resetPasswordToken, req.body.password);
  res.clearCookie('resetPasswordToken');
  res.status(httpStatus.NO_CONTENT).send();
});

export const sendVerificationEmailController = catchAsync(async (req: Request, res: Response) => {
  const verifyEmailToken = await generateVerifyEmailToken(req.user);
  await sendVerificationEmail(req.user.email, verifyEmailToken, req.user.name);
  res.status(httpStatus.NO_CONTENT).send();
});

export const verifyEmailController = catchAsync(async (req: Request, res: Response) => {
  const user = await verifyEmail(req.cookies.verifyEmailToken);
  if (user) {
    await sendAccountCreated(user.email, user.name);
  }
  res.clearCookie('verifyEmailToken');
  res.status(httpStatus.NO_CONTENT).send();
});
