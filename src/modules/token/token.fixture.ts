import moment from 'moment';
import config from '../../config/config';
import tokenTypes from './token.types';
import * as tokenService from './token.service';
import { userOne, admin } from '../user/user.fixture';

const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
export const userOneAccessToken = tokenService.generateToken(userOne._id, accessTokenExpires, tokenTypes.ACCESS);
export const adminAccessToken = tokenService.generateToken(admin._id, accessTokenExpires, tokenTypes.ACCESS);
