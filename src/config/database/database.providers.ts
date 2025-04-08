import { DEVELOPMENT, TEST, PRODUCTION, DATABASE_CONNECTION } from '../constants';
import { databaseConfig } from './database.config';
import * as models from '../../models/index';
import { Model, ModelCtor, Sequelize } from 'sequelize-typescript';


export const databaseProviders = [
    {
        name: DATABASE_CONNECTION,
        provide: DATABASE_CONNECTION,
    useFactory: async () => {
        let config;
        switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
                config = databaseConfig.development;
                break;
        case TEST:
                config = databaseConfig.test;
                break;
        case PRODUCTION:
                config = databaseConfig.production;
                break;
        default:
                config = databaseConfig.development;
        }

        const sequelize = new Sequelize(config);

        // Type assertion to ensure the models array is treated as ModelCtor[]
        const modelArray = Object.values(models) as ModelCtor[];

        sequelize.addModels(modelArray);

        // Check if connection is established
        await sequelize.authenticate()
            .then(() => {
                const loggingdata = {
                    HOST: config.host,
                    PORT: config.port,
                };
                console.log(loggingdata);
                console.log(`${config.database} DB CONNECTED!`);
            })
            .catch((err) => {
                const loggingdata = {
                    HOST: config.host,
                    PORT: config.port,
                };
                console.log(loggingdata);
                console.log(`${config.database} DB Connection Error !!`);
                console.log(err);
            });

            return sequelize;
        },
    },
];
