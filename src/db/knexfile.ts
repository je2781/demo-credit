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
    connection: `mysql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@${process.env.DATABASE_HOST}/${process.env.DB_PROD}?ssl=true`,
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
