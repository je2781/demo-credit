"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: '../../.env' });
// Update with your config settings.
const options = {
    development: {
        client: "mysql",
        connection: {
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'server1',
            database: 'demo_credit_dev',
        },
        migrations: {
            directory: "./migrations",
        },
    },
    testing: {
        client: "mysql",
        connection: {
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'server1',
            database: 'demo_credit_testing'
        },
        migrations: {
            directory: "./migrations",
        },
    },
    production: {
        client: "mysql",
        connection: process.env.DATABASE_URL,
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: "./migrations",
        },
    },
};
exports.default = options;
