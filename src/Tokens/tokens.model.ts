import mongoose, { ObjectId, Schema, model } from 'mongoose';
import ITokens from './tokens.types';
import toJSON from '../plugins/toJSON';

interface IToken {
  token: string;
  user: ObjectId;
  type: string;
  expires: Date;
  blacklisted: boolean;
}

const tokenSchema = new Schema<IToken>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [ITokens.REFRESH, ITokens.RESET_PASSWORD, ITokens.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

const Token = model<IToken>('Token', tokenSchema);

export default Token;
