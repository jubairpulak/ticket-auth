import dotenv from 'dotenv';
import { IDatabaseConfig } from './database.interface';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const databaseConfig: IDatabaseConfig = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_DEVELOPMENT,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        dialect: process.env.DB_DIALECT,
        dialectOptions: {
			charset: "utf8mb4",
			collation: "utf8mb4_unicode_ci",
		},
        timezone: process.env.DB_TIMEZONE, // for writing to database
        define: {
            timestamps: false,
            charset: "utf8mb4",
        },
        pool: {
            max: 40,
            min: 0,
            acquire: 60000,
            idle: 10000
        },
        logging: false
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_TEST,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        dialect: process.env.DB_DIALECT,
        dialectOptions: {
			charset: "utf8mb4",
			collation: "utf8mb4_unicode_ci",
		},
        timezone: process.env.DB_TIMEZONE, // for writing to database
        define: {
            timestamps: false,
            charset: "utf8mb4",
        },
        pool: {
            max: 40,
            min: 0,
            acquire: 60000,
            idle: 10000
        },
        logging: false
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_PRODUCTION,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        dialect: process.env.DB_DIALECT,
        dialectOptions: {
			charset: "utf8mb4",
			collation: "utf8mb4_unicode_ci",
		},
        timezone: process.env.DB_TIMEZONE, // for writing to database
        define: {
            timestamps: false,
            charset: "utf8mb4",
        },
        pool: {
            max: 40,
            min: 0,
            acquire: 60000,
            idle: 10000
        },
        logging: false
    },
};
