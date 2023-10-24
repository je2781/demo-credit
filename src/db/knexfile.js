// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "server1",
      database: "demo-credit-dev",
    },
    migrations: {
      directory: './migrations'
    }
  },

  testing: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "server1",
      database: "demo-credit-test",
    },
    migrations: {
      directory: './migrations'
    }
  },

  production: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "server1",
      database: "demo-credit",
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations'
    }
  }

};
