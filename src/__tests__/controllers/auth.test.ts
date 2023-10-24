import request from "supertest";
import app from "../../functions/api";
import { dbConnection } from "../../db/server";
import { Knex } from "knex";

require("dotenv").config();
const agent = request.agent(app); // Create an agent to maintain cookies

let db: Knex;

describe("Authentication", () => {
  /* Connecting to the database before each test. */
  beforeAll(async () => {
    db = dbConnection('testing', 0);
  });

  it("should show validation error because user already registered", async () => {
    const response = await agent.post("/signup").send({
      fullName: "testinguser",
      password: "testingpassword",
      email: "test1000@test.com",
      c_password: "testingpassword",
    });

    expect(response.statusCode).toBe(422);
  });

  it("should log in a user", async () => {
    const response = await agent
      .post("/login")
      .send({ email: "test1000@test.com", password: "testingpassword" });

    expect(response.statusCode).toBe(302);
    expect(response.header.location).toBe("/");
  });

  it("should show validation error because user doesn't exist", async () => {
    const response = await agent
      .post("/login")
      .send({ email: "test100@test.com", password: "testpassword" });

    expect(response.statusCode).toBe(422);
  });

  /* Closing database connection aftAll test. */
  afterAll(async () => {
    await db.destroy();
  });
});
