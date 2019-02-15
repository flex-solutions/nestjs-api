import * as mongoose from 'mongoose';
import { ConfigService } from '../configuration';
import { DBConnection } from './constant/db.const';

export const databaseProviders = [
  {
    provide: DBConnection,
    useFactory: (config: ConfigService) => {
      const configObject = config.dbConfig;
      const connectString =
        `mongodb://${(process.env.DB_SERVER || configObject.server)}/${configObject.dbname}`;
      return mongoose.connect(connectString, {
        config: {
          autoIndex: false,
        },
        useNewUrlParser: true
      });
    },
    inject: [ConfigService],
  },
];
