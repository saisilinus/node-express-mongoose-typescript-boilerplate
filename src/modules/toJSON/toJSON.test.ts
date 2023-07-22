import mongoose, { Model, Document } from 'mongoose';
import { toJSON } from '.';

interface SampleSchema {
  public: string;
  private: string;
  nested: {
    private: string;
  };
}

interface SampleSchemaDoc extends SampleSchema, Document {}
interface SampleSchemaModel extends Model<SampleSchemaDoc> {}

describe('toJSON plugin', () => {
  let connection: mongoose.Connection;

  beforeEach(() => {
    connection = mongoose.createConnection();
  });

  it('should replace _id with id', () => {
    const schema = new mongoose.Schema<SampleSchemaDoc, SampleSchemaModel>();
    schema.plugin(toJSON);
    const SampleModel = connection.model<SampleSchemaDoc, SampleSchemaModel>('Model', schema);
    const doc = new SampleModel();
    expect(doc.toJSON()).not.toHaveProperty('_id');
    expect(doc.toJSON()).toHaveProperty('id', doc._id.toString());
  });

  it('should remove __v', () => {
    const schema = new mongoose.Schema<SampleSchemaDoc, SampleSchemaModel>();
    schema.plugin(toJSON);
    const SampleModel = connection.model<SampleSchemaDoc, SampleSchemaModel>('Model', schema);
    const doc = new SampleModel();
    expect(doc.toJSON()).not.toHaveProperty('__v');
  });

  it('should remove createdAt and updatedAt', () => {
    const schema = new mongoose.Schema<SampleSchemaDoc, SampleSchemaModel>({}, { timestamps: true });
    schema.plugin(toJSON);
    const SampleModel = connection.model<SampleSchemaDoc, SampleSchemaModel>('Model', schema);
    const doc = new SampleModel();
    expect(doc.toJSON()).not.toHaveProperty('createdAt');
    expect(doc.toJSON()).not.toHaveProperty('updatedAt');
  });

  it('should remove any path set as private', () => {
    const schema = new mongoose.Schema<SampleSchemaDoc, SampleSchemaModel>({
      public: { type: String },
      private: { type: String, private: true },
    });
    schema.plugin(toJSON);
    const SampleModel = connection.model<SampleSchemaDoc, SampleSchemaModel>('Model', schema);
    const doc = new SampleModel({ public: 'some public value', private: 'some private value' });
    expect(doc.toJSON()).not.toHaveProperty('private');
    expect(doc.toJSON()).toHaveProperty('public');
  });

  it('should remove any nested paths set as private', () => {
    const schema = new mongoose.Schema<SampleSchemaDoc, SampleSchemaModel>({
      public: { type: String },
      nested: {
        private: { type: String, private: true },
      },
    });
    schema.plugin(toJSON);
    const SampleModel = connection.model<SampleSchemaDoc, SampleSchemaModel>('Model', schema);
    const doc = new SampleModel({
      public: 'some public value',
      nested: {
        private: 'some nested private value',
      },
    });
    expect(doc.toJSON()).not.toHaveProperty('nested.private');
    expect(doc.toJSON()).toHaveProperty('public');
  });

  it('should also call the schema toJSON transform function', () => {
    const schema = new mongoose.Schema<SampleSchemaDoc, SampleSchemaModel>(
      {
        public: { type: String },
        private: { type: String },
      },
      {
        toJSON: {
          transform: (_doc, ret) => {
            // eslint-disable-next-line no-param-reassign, @typescript-eslint/dot-notation
            delete ret['private'];
          },
        },
      }
    );
    schema.plugin(toJSON);
    const SampleModel = connection.model<SampleSchemaDoc, SampleSchemaModel>('Model', schema);
    const doc = new SampleModel({ public: 'some public value', private: 'some private value' });
    expect(doc.toJSON()).not.toHaveProperty('private');
    expect(doc.toJSON()).toHaveProperty('public');
  });
});
