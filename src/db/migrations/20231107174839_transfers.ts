import { Knex } from "knex";
import { v4 as idGenerator } from 'uuid';


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable("transfers", (table) => {
      table.string("id").primary().unique().defaultTo(idGenerator()); 
      table.integer("amount").notNullable();
      table.string("foreign_user_id").notNullable();
      table.string("user_id").notNullable().unique();
      table.timestamps(true, true);
    //   table.foreign("user_id").references('id').inTable('users');
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("transfers");

}

