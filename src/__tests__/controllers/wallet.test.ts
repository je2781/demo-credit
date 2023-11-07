import { v4 as idGenerator } from "uuid";
import { transfer, withdraw, deposit } from "../../controllers/wallet";
import walletService from "../../service/wallet-service";

let statusCode: number;
let locationHeader: string;
let id1: string;
let id2: string;
let error: string;

describe("wallet controller", () => {
  /* Connecting to the database before all tests. */
  beforeAll(async () => {
    //creating test user records
    id1 = idGenerator();
    id2 = idGenerator();
    await walletService.createUser(
      {
        email: "testing1000@test.com",
        password: "testingpassword",
        imageUrl: "src/build/public/images/testing.jpg",
        wallet: 200,
        fullName: "testinguser",
      },
      {
        id: id1,
        env: "testing",
      }
    );
    await walletService.createUser(
      {
        email: "testing10@test.com",
        password: "testpassword",
        imageUrl: "src/build/public/images/test.jpg",
        wallet: 200,
        fullName: "testuser",
      },
      {
        id: id2,
        env: "testing",
      }
    );
  });

  it("should throw an error if accessing the database fails", async () => {
    const req = {
      session: {
        user: {},
      },
      env: "testing",
      body: {
        fund: "20",
      },
    };

    const res = {
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
          oldInput: {
            recName: string,
            recEmail: string,
          },
          path: string;
          action: string;
          balance: string;
        }
      ) {
        error = viewParams.errorMsg;
      }),
    };

    await withdraw(req, res, () => {});
    expect(statusCode).toBe(500);
    expect(error).toBe("Missing user or user.id");
  });

  it("should throw an error if user withdraws outside their balance",async() => {
    const req = {
      session: {
        user: {
          id: id1,
          email: "testing1000@test.com",
          wallet: 200
        },
      },
      env: "testing",
      body: {
        fund: "600",
      },
    };

    const res = {
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
          oldInput: {
            recName: string,
            recEmail: string,
          },
          path: string;
          action: string;
          balance: string;
        }
      ) {
        error = viewParams.errorMsg;
      }),
    };

    await withdraw(req, res, () => {});
    expect(statusCode).toBe(500);
    expect(error).toBe("You cannot put your account in the red. choose a lower amount");
  });

  it("should redirect to home page after withdrawing from account", async() => {
    const req = {
      session: {
        user: {
          id: id1,
          email: "testing1000@test.com",
          wallet: 200
        },
      },
      body: {
        fund: "100",
      },
      env: "testing",
    };

    const res = {
      status: jest.fn(function (code: number) {
        statusCode = code;
        return this;
      }),
      redirect: jest.fn(function (location: string) {
        locationHeader = location;
      }),
    };

    await withdraw(req, res, () => {});
    const currentUser = await walletService.findUser({
      email: req.session.user.email,
    }, req.env);
    expect(currentUser.wallet).toBe(100);
    expect(statusCode).toBe(302);
    expect(locationHeader).toBe("/");
  });

  it("should redirect to home page after depositing into account", async () => {
    const req = {
      session: {
        user: {
          id: id1,
          email: "testing1000@test.com",
          wallet: 100
        },
      },
      body: {
        fund: "400",
      },
      env: "testing",
    };

    const res = {
      status: jest.fn(function (code: number) {
        statusCode = code;
        return this;
      }),
      redirect: jest.fn(function (location: string) {
        locationHeader = location;
      }),
    };

    await deposit(req, res, () => {});
    const currentUser = await walletService.findUser({
      email: req.session.user.email,
    }, req.env);
    expect(currentUser.wallet).toBe(500);
    expect(statusCode).toBe(302);
    expect(locationHeader).toBe("/");
  });

  it("should redirect to home page after transfering funds to another user",async () => {
    const req = {
      session: {
        user: {
          id: id2,
          email: "testing10@test.com",
          wallet: 500
        },
      },
      flash: jest.fn(function (name: string, message: string) {}),
      body: {
        fund: "40",
        r_email: "testing1000@test.com",
        r_name: "testinguser",
      },
      env: "testing",
    };

    const res = {
      status: jest.fn(function (code: number) {
        statusCode = code;
        return this;
      }),
      redirect: jest.fn(function (location: string) {
        locationHeader = location;
      }),
    };

    await transfer(req, res, () => {});
    const receipient = await walletService.findUser({
      email: req.body.r_email,
    }, req.env);
    expect(receipient.wallet).toBe(540);
    expect(statusCode).toBe(302);
    expect(locationHeader).toBe("/");
  });



  /* Closing database connection aftAll test. */
  afterAll(async () => {
    await walletService.deleteUser("testing1000@test.com", "testing");
    await walletService.deleteUser("testing10@test.com", "testing");
    await walletService.deleteTransfer(id2, 'testing');
    await walletService.deleteAudit(id2, 'testing');
    await walletService.deleteAudit(id1, 'testing');

  });
});

