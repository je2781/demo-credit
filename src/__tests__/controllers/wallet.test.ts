import "@testing-library/jest-dom";
import { JSDOM } from "jsdom";
import path from "path";
import { v4 as idGenerator } from "uuid";
import { transfer, withdraw, deposit } from "../../controllers/wallet";
import { createUser, deleteUser, findUser } from "../../dao/user";
import ejs from "ejs";
import fs from "fs";
import { User } from "../../types";

const homeFilePath = path.resolve(__dirname, "../../views/home_mock.ejs");

let statusCode: number;
let locationHeader: string;
let id1: string;
let id2: string;
let error: string;

describe("wallet controller", () => {

  const response = {
    status: jest.fn(function (code: number) {
      statusCode = code;
      return this;
    }),
    render: jest.fn(function (
      view: string,
      viewParams: {
        errorMsg: string;
        docTitle: string;
        mode: string;
        path: string;
        oldInput: {
          recName: string;
          recEmail: string;
        };
        action: string;
      }
    ) {
      error = viewParams.errorMsg;
    }),
  };

  /* Connecting to the database before all tests. */
  beforeAll(async () => {
    //creating test user records
    id1 = idGenerator();
    id2 = idGenerator();
    await createUser(
      {
        email: "testing1000@test.com",
        password: "testingpassword",
        imageUrl: "src/public/images/testing.jpg",
        wallet: 200,
        fullName: "testinguser",
      },
      {
        id: id1,
        env: "testing",
      }
    );
    await createUser(
      {
        email: "testing10@test.com",
        password: "testpassword",
        imageUrl: "src/public/images/test.jpg",
        wallet: 200,
        fullName: "testuser",
      },
      {
        id: id2,
        env: "testing",
      }
    );
  });

  it("should throw an error if accessing the database fails", (done) => {
    const req = {
      session: {
        user: undefined,
      },
      env: "testing",
      body: {
        fund: "20",
      },
    };

    withdraw(req, response, () => {}).then((result: any) => {
      expect(error).toBe("Missing user or user.id");
      done();
    });
  });

  it("should redirect to home page after trasnfering funds to another user", (done) => {
    const req = {
      session: {
        user: {
          id: id2,
          email: "testing10test.com",
        },
      },
      body: {
        fund: "40",
        r_email: "testing1000@test.com",
        r_name: "testinguser",
      },
      env: "testing",
    };


    transfer(req, response, () => {}).then((result) => {
      expect(statusCode).toBe(302);
      expect(locationHeader).toBe("/");
      done();
    });
  });

  it("should show balance of foreign user has increased", (done) => {
    const req = {
      body: {
        email: "testing1000@test.com"
      },
      env: 'testing'
    }
    findUser({
      email: req.body.email,
    }, req.env).then((user) => {
      expect(user.wallet).toBe(240);
      done();
    });
  });

  /* Closing database connection aftAll test. */
  afterAll(async () => {
    await deleteUser("testing1000@test.com", "testing");
    await deleteUser("testing10@test.com", "testing");
  });
});

