import mongoose from 'mongoose';
import tokenTypes from './token.types';
import toJSON from '../toJSON/toJSON.plugin';

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
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
const Token = mongoose.model('Token', tokenSchema);
export default Token;
// # sourceMappingURL=token.model.js.map
