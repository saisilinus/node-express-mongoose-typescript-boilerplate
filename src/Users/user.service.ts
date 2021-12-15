import httpStatus from 'http-status';
import { Document, ObjectId } from 'mongoose';
import User from './user.model';
import ApiError from '../utils/ApiError';
import { IOptions, QueryResult } from '../plugins/paginate';
import { NewCreatedUser, UpdateUserBody } from './user.interfaces';

/**
 * Create a user
 * @param {NewCreatedUser} userBody
 * @returns {Promise<Document>}
 */
export const createUser = async (userBody: NewCreatedUser): Promise<Document> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryUsers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<Document<any, any, any> | null>}
 */
export const getUserById = async (id: ObjectId): Promise<Document<any, any, any> | null> => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<Document<any, any, any> | null>}
 */
export const getUserByEmail = async (email: string): Promise<Document<any, any, any> | null> => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<Document<any, any, any> | null>}
 */
export const updateUserById = async (
  userId: ObjectId,
  updateBody: UpdateUserBody
): Promise<Document<any, any, any> | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Document<any, any, any> | null>}
 */
export const deleteUserById = async (userId: ObjectId): Promise<Document<any, any, any> | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};
