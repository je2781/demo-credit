"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        connection: `mysql://bmbg9hhg6h9skrfg5jju:pscale_pw_PTB8Eu66XTsWlXkRXnXIQ1QZWJcyhsvN5Rptoa8rh1@aws.connect.psdb.cloud/demo_credit?ssl=true`,
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
