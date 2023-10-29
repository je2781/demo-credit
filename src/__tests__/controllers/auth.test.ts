import { createUser, findUser, deleteUser } from "../../dao/user";
import { postSignup, postLogin, postLogout } from "../../controllers/auth";
import bcrypt from "bcryptjs";
import { v4 as idGenerator } from "uuid";
import http from "http";
import { dbConnection } from "../../db/db";

let statusCode: number;
let locationHeader: string;
let id: string;
let error: string;

describe("Authentication", () => {
  /* Connecting to the database before each test. */
  beforeAll(async () => {
    id = idGenerator();

    //creating test user record
    await createUser(
      {
        email: "testing1000@test.com",
        password: "testingpassword",
        imageUrl: "src/public/images/testing.jpg",
        wallet: 200,
        fullName: "testinguser",
      },
      {
        id: id,
        env: "testing",
      }
    );
  });

  it("should throw error because user already registered", (done) => {
    const request = {
      body: {
        email: "testing1000@test.com",
        password: "testingpassword",
        c_password: "testingpassword",
        image: "/src/public/images/testing.jpg",
        balance: "200",
        fullName: "testinguser",
      },
      env: "testing",
      id: id,
    };

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
            email: string;
            password: string;
            confirmPassword: string;
            fullName: string;
            balance: string;
          };
          validationErrors: any[];
        }
      ) {
        error = viewParams.errorMsg;
      }),
    };

    postSignup(request, response, () => {}).then((result) => {
      expect(error).toBe("Email is already in use");
      expect(statusCode).toBe(422);
      done();
    });
  });

  it("should log in a user", (done) => {
    const response = {
      status: jest.fn(function (code: number) {
        statusCode = code;
        return this;
      }),
      redirect: jest.fn(function (location: string) {
        locationHeader = location;
      }),
    };

    const request = {
      body: {
        email: "testing1000@test.com",
        password: "testingpassword",
      },
      session: {
        isLoggedIn: false,
        user: {},
        save: jest.fn(() => {
          response.status(302);
          response.redirect("/");
        }),
      },
      env: "testing",
    };

    bcrypt.compare = async function (s: string, hash: string) {
      return true;
    };

    postLogin(request, response, () => {}).then((result) => {
      expect(statusCode).toBe(302);
      expect(locationHeader).toBe("/");
      done();
    });
  });

  it("should show validation error because the user doesn't exist", (done) => {
    const request = {
      body: {
        email: "testing34@test.com",
        password: "test23password",
      },
      env: "testing",
    };

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
            email: string;
            password: string;
          };
          validationErrors: any[];
        }
      ) {
        error = viewParams.errorMsg;
      }),
    };

    postLogin(request, response, () => {}).then((result) => {
      expect(error).toBe("User account doesn't exist. Create an account");
      expect(statusCode).toBe(422);
      done();
    });
  });

  it("should logout when logout button is pressed", (done) => {
    const response = {
      status: jest.fn(function (code: number) {
        statusCode = code;
        return this;
      }),
      redirect: jest.fn(function (location: string) {
        locationHeader = location;
      }),
    };

    const request = {
      session: {
        destroy: jest.fn((err?: Error) => {
          response.status(302);
          response.redirect("/login");
        }),
      },
    };

    postLogout(request, response, () => {}).then((result) => {
      expect(statusCode).toBe(302);
      expect(locationHeader).toBe("/login");
      done();
    });
  });

  /* Closing database connection aftAll test. */
  afterAll(async () => {
    await deleteUser("testing1000@test.com", "testing");
  });
});
