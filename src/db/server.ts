require("dotenv").config();
const knexFile = require('./knexfile');
import knex from 'knex';
import app from '../functions/api';

const environment = process.env.NODE_ENV || "development";


export const dbConnection = (env?: string, port?: number) => {
    const db = knex(knexFile[env || environment]);
    app.listen(port || 8000);
    return db;
}
