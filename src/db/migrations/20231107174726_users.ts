import { Knex } from "knex";
import { v4 as idGenerator } from 'uuid';



export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable("users", (table) => {
      table.string("id").primary().unique().defaultTo(idGenerator()); 
      table.string("full_name").notNullable();
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.string("image_url").notNullable();
      table.integer("wallet").notNullable();
      table.string("cloudinary_asset_id").nullable().unique();
      table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("users");
}

