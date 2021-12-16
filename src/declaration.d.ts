import { IUserDoc } from './Users/user.interfaces';

declare module 'express' {
  export interface Request {
    user: IUserDoc;
  }
}

declare module 'xss-clean';
