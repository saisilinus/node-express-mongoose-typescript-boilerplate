"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const paginate = (schema) => {
    /**
     * @typedef {Object} QueryResult
     * @property {Document[]} results - Results found
     * @property {number} page - Current page
     * @property {number} limit - Maximum number of results per page
     * @property {number} totalPages - Total number of pages
     * @property {number} totalResults - Total number of documents
     */
    /**
     * Query for documents with pagination
     * @param {Object} [filter] - Mongo filter
     * @param {Object} [options] - Query options
     * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
     * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
     * @param {number} [options.limit] - Maximum number of results per page (default = 10)
     * @param {number} [options.page] - Current page (default = 1)
     * @returns {Promise<QueryResult>}
     */
    schema.static('paginate', function (filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let sort = '';
            if (options.sortBy) {
                const sortingCriteria = [];
                options.sortBy.split(',').forEach((sortOption) => {
                    const [key, order] = sortOption.split(':');
                    sortingCriteria.push((order === 'desc' ? '-' : '') + key);
                });
                sort = sortingCriteria.join(' ');
            }
            else {
                sort = 'createdAt';
            }
            const limit = options.limit && parseInt(options.limit.toString(), 10) > 0 ? parseInt(options.limit.toString(), 10) : 10;
            const page = options.page && parseInt(options.page.toString(), 10) > 0 ? parseInt(options.page.toString(), 10) : 1;
            const skip = (page - 1) * limit;
            const countPromise = this.countDocuments(filter).exec();
            let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);
            if (options.populate) {
                options.populate.split(',').forEach((populateOption) => {
                    docsPromise = docsPromise.populate(populateOption
                        .split('.')
                        .reverse()
                        .reduce((a, b) => ({ path: b, populate: a })));
                });
            }
            docsPromise = docsPromise.exec();
            return Promise.all([countPromise, docsPromise]).then((values) => {
                const [totalResults, results] = values;
                const totalPages = Math.ceil(totalResults / limit);
                const result = {
                    results,
                    page,
                    limit,
                    totalPages,
                    totalResults,
                };
                return Promise.resolve(result);
            });
        });
    });
};
exports.default = paginate;
