// require("dotenv").config();
import knexFile from './knexfile';
import knex from 'knex';
import { config } from 'dotenv';
config();

const environment = process.env.NODE_ENV;

export const dbConnection = (env?: string) => {
    const db = knex(knexFile[env || environment!]);
    return db;
}
