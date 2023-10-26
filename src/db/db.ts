// require("dotenv").config();
import {config} from 'dotenv';
import knexFile from './knexfile';
import knex from 'knex';
config();
const environment = process.env.NODE_ENV;

export const dbConnection = (env?: string) => {
    const db = knex(knexFile[env || environment!]);
    return db;
}
