import { Request } from 'express';
import { Strategy as JwtStrategy } from 'passport-jwt';
import tokenTypes from './tokens';
import config from './config';

const { User } = require('../models');

interface Payload {
  sub: string;
  iat: number;
  exp: number;
  type: string;
}

const cookieExtractor = function (req: Request): string {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.jwt;
  }
  return token;
};

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: cookieExtractor,
};

const jwtVerify = async (payload: Payload, done: any) => {
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
