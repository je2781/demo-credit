/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("users", (table) => {
      table.string("id").notNullable().primary().unique();
      table.string("full_name").notNullable();
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.string("image_url").notNullable();
      table.integer("wallet").notNullable();
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');

};
