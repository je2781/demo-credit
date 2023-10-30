/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("transfers", (table) => {
      table.string("id").notNullable().primary().unique();
      table.integer("amount").notNullable();
      table.string("foreign_user_id").notNullable();
      table.string("user_id").notNullable().unique();
      table.timestamps(true, true);
    //   table.foreign("user_id").references('id').inTable('users');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("transfers");
};
