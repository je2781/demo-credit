import type { Knex } from "knex";
import { config } from 'dotenv';
config({ path: '../../.env' });
// Update with your config settings.

const options: { [key: string]: Knex.Config } = {
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

export default options;
