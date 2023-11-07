import { dbConnection } from "../db/db";
import { v4 as idGenerator } from "uuid";
import { User, createUserProps } from "../types";
import transferDAO from "./transfer";
import auditDAO from "./audit";
class UserDAO {
  createUser = async (
    data: createUserProps,
    testObj?: { env: string; id: string }
  ) => {
    if (testObj && testObj.env) {
      await dbConnection(testObj.env)("users").insert({
        id: testObj.id,
        email: data.email,
        password: data.password,
        full_name: data.fullName,
        wallet: data.wallet,
        image_url: data.imageUrl,
      });
    } else {
      await dbConnection()("users").insert({
        id: idGenerator(),
        email: data.email,
        password: data.password,
        full_name: data.fullName,
        wallet: data.wallet,
        image_url: data.imageUrl,
      });
    }
  };

  deleteUser = async (email: string, env?: string) => {
    if (env) {
      await dbConnection(env)("users").where("email", email).del();
    } else {
      await dbConnection()("users").where("email", email).del();
    }
  };

  updateUser = async (input: { email: string; assetId: string }) => {
    await dbConnection()("users").where("email", input.email).update({
      cloudinary_asset_id: input.assetId,
    });
  };

  findUser = async (input: { email: string }, env?: string): Promise<User> => {
    let user: User;
    if (env) {
      user = await dbConnection(env)("users")
        .where("email", input.email)
        .first();
    } else {
      user = await dbConnection()("users").where("email", input.email).first();
    }

    return user;
  };

  manageFund = async (
    input: {
      foreignUser?: { name: string; email: string };
      user?: User;
      fund: number;
      mode: string;
    },
    env?: string
  ) => {
    let extractedUser: any;
    let extractedTransfer: any;

    switch (input.mode) {
      case "transfer":
        if (input.foreignUser && env && input.user) {
          extractedUser = await dbConnection(env)("users")
            .where("email", input.foreignUser.email)
            .first();

          if (!extractedUser) {
            throw new Error("your receipient account doesn't exist");
          }

          await dbConnection(env)("users")
            .where("email", input.foreignUser.email)
            .update({
              wallet: extractedUser.wallet + input.fund,
            });
          //updating transfers table
          const extractedTransfer = await transferDAO.findTransfer(
            {
              foreignId: extractedUser.id,
            },
            env
          );

          if (!extractedTransfer) {
            await transferDAO.createTransfer(
              {
                amount: input.fund,
                foreignUserId: extractedUser.id,
                userId: input.user.id,
              },
              env
            );

            //updating audit table
            return await auditDAO.debit(
              {
                amount: input.fund,
                userId: input.user.id,
              },
              env
            );
          }

          await transferDAO.updateTransfer(
            {
              transfer: extractedTransfer,
              fund: input.fund,
              foreignId: extractedUser.id,
            },
            env
          );

          //updating audit table
          return await auditDAO.debit(
            {
              amount: input.fund,
              userId: input.user.id,
            },
            env
          );
        }
        if (input.foreignUser && input.user) {
          extractedUser = await dbConnection()("users")
            .where("email", input.foreignUser.email)
            .first();

          if (!extractedUser) {
            throw new Error("your receipient account doesn't exist");
          }

          await dbConnection()("users")
            .where("email", input.foreignUser.email)
            .update({
              wallet: extractedUser.wallet + input.fund,
            });
          //updating transfers table
          const extractedTransfer = await transferDAO.findTransfer({
            foreignId: extractedUser.id,
          });

          if (!extractedTransfer) {
            await transferDAO.createTransfer({
              amount: input.fund,
              foreignUserId: extractedUser.id,
              userId: input.user.id,
            });

            //updating audit table
            return await auditDAO.debit({
              amount: input.fund,
              userId: input.user.id,
            });
          }

          await transferDAO.updateTransfer({
            transfer: extractedTransfer,
            fund: input.fund,
            foreignId: extractedUser.id,
          });

          //updating audit table
          return await auditDAO.debit({
            amount: input.fund,
            userId: input.user.id,
          });
        }
        // Handle the case when input.foreignUserEmail is not provided.
        throw new Error("Missing foreignUserEmail");
      case "withdraw":
        let withdrawOpResult: number;
        if (input.user && input.user.id && env) {
          extractedUser = await dbConnection(env)("users")
            .where("id", input.user.id)
            .first();

          withdrawOpResult = extractedUser.wallet - input.fund;
          if (withdrawOpResult < 0) {
            throw new Error(
              `You cannot put your account in the red. choose a lower amount`
            );
          }

          await dbConnection(env)("users").where("id", input.user.id).update({
            wallet: withdrawOpResult,
          });

          //updating audit table
          return await auditDAO.debit(
            {
              amount: input.fund,
              userId: input.user.id,
            },
            env
          );
        }
        if (input.user && input.user.id) {
          extractedUser = await dbConnection()("users")
            .where("id", input.user.id)
            .first();

          withdrawOpResult = extractedUser.wallet - input.fund;
          if (withdrawOpResult < 0) {
            throw new Error(
              `You cannot put your account in the red. choose a lower amount`
            );
          }

          await dbConnection()("users")
            .where("id", input.user.id)
            .update({
              wallet: withdrawOpResult,
            });

          //updating audit table
          return await auditDAO.debit({
            amount: input.fund,
            userId: input.user.id,
          });
        }
        // Handle the case when input.user or input.user.id is not provided.
        throw new Error("Missing user or user.id");
      default:
        if (input.user && input.user.id && env) {
          extractedUser = await dbConnection(env)("users")
            .where("id", input.user.id)
            .first();
          await dbConnection(env)("users")
            .where("id", input.user.id)
            .update({
              wallet: extractedUser.wallet + input.fund,
            });

          //updating audit table
          return await auditDAO.credit(
            {
              amount: input.fund,
              userId: input.user.id,
            },
            env
          );
        }
        if (input.user && input.user.id) {
          extractedUser = await dbConnection()("users")
            .where("id", input.user.id)
            .first();
          await dbConnection()("users")
            .where("id", input.user.id)
            .update({
              wallet: extractedUser.wallet + input.fund,
            });

          //updating audit table
          return await auditDAO.credit({
            amount: input.fund,
            userId: input.user.id,
          });
        }
        // Handle the case when input.user or input.user.id is not provided.
        throw new Error("Missing user or user.id");
    }
  };
}

export default new UserDAO();
