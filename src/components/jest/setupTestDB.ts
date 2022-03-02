import mongoose from 'mongoose';
import config from '../../config/config';

const setupTestDB = () => {
  beforeAll(async () => {
    await mongoose.connect(config.mongoose.url);
  });

  beforeEach(async () => {
    await Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany({})));
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
};

export default setupTestDB;
