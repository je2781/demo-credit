import { v4 as idGenerator } from "uuid";
import { transfer, withdraw, deposit } from "../../controllers/wallet";
import { createUser, deleteUser, findUser } from "../../dao/user";
import { deleteTransfer } from "../../dao/transfer";

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

    withdraw(req, res, () => {}).then((result: any) => {
      expect(statusCode).toBe(500);
      expect(error).toBe("Missing user or user.id");
      done();
    });
  });

  it("should throw an error if user withdraws outside their balance", (done) => {
    const req = {
      session: {
        user: {
          id: id1,
          email: "testing1000@test.com",
        },
      },
      env: "testing",
      body: {
        fund: "300",
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

    withdraw(req, res, () => {}).then((result: any) => {
      expect(statusCode).toBe(500);
      expect(error).toBe("You cannot put your account in the red. choose a lower amount");
      done();
    });
  });

  it("should redirect to home page after withdrawing from account", (done) => {
    const req = {
      session: {
        user: {
          id: id1,
          email: "testing1000@test.com",
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

    withdraw(req, res, () => {}).then((result) => {
      findUser({
        email: req.session.user.email,
      }, req.env).then((currentUser) => {
        expect(currentUser.wallet).toBe(100);
        expect(statusCode).toBe(302);
        expect(locationHeader).toBe("/");
        done();
      });
    });
  });

  it("should redirect to home page after depositing into account", (done) => {
    const req = {
      session: {
        user: {
          id: id1,
          email: "testing1000@test.com",
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

    deposit(req, res, () => {}).then((result) => {
      findUser({
        email: req.session.user['email'],
      }, req.env).then((currentUser) => {
        expect(currentUser.wallet).toBe(500);
        expect(statusCode).toBe(302);
        expect(locationHeader).toBe("/");
        done();
      });
    });
  });

  it("should redirect to home page after transfering funds to another user", (done) => {
    const req = {
      session: {
        user: {
          id: id2,
          email: "testing10@test.com",
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

    transfer(req, res, () => {}).then((result) => {
      findUser({
        email: req.body.r_email,
      }, req.env).then((receipient) => {
        expect(receipient.wallet).toBe(540);
        expect(statusCode).toBe(302);
        expect(locationHeader).toBe("/");
        done();
      });
    });
  });



  /* Closing database connection aftAll test. */
  afterAll(async () => {
    await deleteUser("testing1000@test.com", "testing");
    await deleteUser("testing10@test.com", "testing");
    await deleteTransfer(id2, 'testing');

  });
});

