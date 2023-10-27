"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Update with your config settings.
const config = {
    development: {
        client: "mysql",
        connection: {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DEV,
        },
        migrations: {
            directory: "./migrations",
        },
    },
    testing: {
        client: "mysql",
        connection: {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_TEST,
        },
        migrations: {
            directory: "./migrations",
        },
    },
    production: {
        client: "mysql",
        connection: {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_PROD,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: "./migrations",
        },
    },
};
exports.default = config;
