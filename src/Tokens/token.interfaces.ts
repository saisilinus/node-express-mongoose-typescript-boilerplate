import { ObjectId } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

export interface IToken {
  token: string;
  user: ObjectId;
  type: string;
  expires: Date;
  blacklisted: boolean;
}

export interface IPayload extends JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  type: string;
}

export interface TokenPayload {
  token: string;
  expires: Date;
}

export interface AccessAndRefreshTokens {
  access: TokenPayload;
  refresh: TokenPayload;
}
