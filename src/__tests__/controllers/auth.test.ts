import walletService from "../../service/wallet-service";
import { postSignup, postLogin, postLogout } from "../../controllers/auth";
import bcrypt from "bcryptjs";
import { v4 as idGenerator } from "uuid";


let statusCode: number;
let locationHeader: string;
let id: string;
let error: string;

describe("Authentication", () => {
  /* Connecting to the database before each test. */
  beforeAll( async() => {
    id = idGenerator();

    //creating test user record
    await walletService.createUser(
      {
        email: "testing1000@test.com",
        password: "testingpassword",
        imageUrl: "src/build/public/images/testing.jpg",
        wallet: 200,
        fullName: "testinguser",
      },
      {
        id: id,
        env: "testing",
      }
    );
  });

  it("should throw error because user already registered", async() => {
    const request = {
      body: {
        email: "testing1000@test.com",
        password: "testingpassword",
        c_password: "testingpassword",
        image: "/src/build/public/images/testing.jpg",
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

    await postSignup(request, response, () => {});
    expect(error).toBe("Email is already in use");
    expect(statusCode).toBe(422);
  });

  it("should log in a user", async() => {
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

    await postLogin(request, response, () => {});
    expect(statusCode).toBe(302);
    expect(locationHeader).toBe("/");
  });

  it("should show validation error because the user doesn't exist", async() => {
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

    await postLogin(request, response, () => {});
    expect(error).toBe("User account doesn't exist. Create an account");
    expect(statusCode).toBe(422);
  });

  it("should logout when logout button is pressed",async () => {
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

    await postLogout(request, response, () => {});
    expect(statusCode).toBe(302);
    expect(locationHeader).toBe("/login");
  });

  /* Closing database connection aftAll test. */
  afterAll(async() => {
    await walletService.deleteUser("testing1000@test.com", "testing");
  });
});
