/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const {v4:idGenerator} = require('uuid');

exports.up = function (knex) {
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
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists("users");
  };
  