/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.string("id").notNullable().unique();
      table.string("full_name").notNullable();
      table.string("email").notNullable().unique();
      table.string("password").notNullable().unique();
      table.float("wallet").notNullable();
      table.timestamps(true, true);
    })
    .then((_) => {
      console.log("users table created");
      return knex.destroy();
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
