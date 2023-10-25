"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
// Update with your config settings.
const config = {
    development: {
        client: "mysql",
        connection: {
            host: "127.0.0.1",
            port: 3306,
            user: "root",
            password: "server1",
            database: "demo_credit_dev",
        },
        migrations: {
            directory: "./migrations",
        },
    },
    testing: {
        client: "mysql",
        connection: {
            host: "127.0.0.1",
            port: 3306,
            user: "root",
            password: "server1",
            database: "demo_credit_testing",
        },
        migrations: {
            directory: "./migrations",
        },
    },
    production: {
        client: "mysql",
        connection: {
            host: "127.0.0.1",
            port: 3306,
            user: "root",
            password: "server1",
            database: "demo_credit",
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
