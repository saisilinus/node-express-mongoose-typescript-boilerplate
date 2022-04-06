import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import tokenTypes from '../modules/token/token.types';
import config from './config';
import User from '../modules/user/user.model';
import { IPayload } from '../modules/token/token.interfaces';

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload: IPayload, done) => {
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
  }
);

export default jwtStrategy;
