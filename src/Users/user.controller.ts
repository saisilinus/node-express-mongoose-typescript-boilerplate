import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/ApiError';
import pick from '../utils/pick';
import { createUser, queryUsers, getUserById, updateUserById, deleteUserById } from './user.service';
import { IOptions } from '../plugins/paginate';

export const createUserController = catchAsync(async (req: Request, res: Response) => {
  const user = await createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

export const getUsersController = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await queryUsers(filter, options);
  res.send(result);
});

export const getUserController = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    const user = await getUserById(new mongoose.Schema.Types.ObjectId(req.params['userId']));
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
  }
});

export const updateUserController = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    const user = await updateUserById(new mongoose.Schema.Types.ObjectId(req.params['userId']), req.body);
    res.send(user);
  }
});

export const deleteUserController = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    await deleteUserById(new mongoose.Schema.Types.ObjectId(req.params['userId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
