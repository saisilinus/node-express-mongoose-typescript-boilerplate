import { Request } from 'express';
import { Strategy as JwtStrategy } from 'passport-jwt';
import tokenTypes from '../Tokens/token.types';
import config from './config';
import User from '../Users/user.model';
import { IPayload } from '../Tokens/token.interfaces';

const cookieExtractor = function (req: Request): string {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.accessToken;
  }
  return token;
};

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: cookieExtractor,
};

const jwtVerify = async (payload: IPayload, done: any) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy;
