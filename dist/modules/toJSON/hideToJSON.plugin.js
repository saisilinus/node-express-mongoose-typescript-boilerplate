/* eslint-disable no-param-reassign */
/**
 * A mongoose schema plugin which allows user to hide fields dynamically using a hide option
 */
const hideToJSON = (schema) => {
  schema.options.toJSON = {};
  schema.options.toJSON.hide = '';
  schema.options.toJSON.transform = function (_doc, ret, options) {
    if (options.hide) {
      options.hide.split(' ').forEach((prop) => {
        delete ret[prop];
      });
    }
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  };
};
export default hideToJSON;
// # sourceMappingURL=hideToJSON.plugin.js.map
