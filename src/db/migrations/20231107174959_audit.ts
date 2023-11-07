import { Knex } from "knex";
import { v4 as idGenerator } from 'uuid';


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable("audit", (table) => {
      table.string("id").primary().unique().defaultTo(idGenerator()); 
      table.integer("credit").nullable();
      table.integer("debit").nullable();
      table.string("user_id").notNullable();
      table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("audit");
}

