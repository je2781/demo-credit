import { dbConnection } from "../db/db";
import { v4 as idGenerator } from "uuid";
import { User, createUserProps } from "../types";

export const createUser = async (
  data: createUserProps,
  testObj?: { env: string; id: string }
) => {
  if (testObj && testObj.env === "testing") {
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

export const deleteUser = async (email: string, env?: string) => {
  if (env) {
    await dbConnection(env)("users").where("email", email).del();
  } else {
    await dbConnection()("users").where("email", email).del();
  }
};

export const deleteTransfer = async (userId: string, env?: string) => {
  if (env) {
    await dbConnection(env)("transfers").where("user_id", userId).del();
  } else {
    await dbConnection()("transfers").where("user_id", userId).del();
  }
};

export const updateUser = async (input: { email: string; assetId: string }) => {
  await dbConnection()("users").where("email", input.email).update({
    cloudinary_asset_id: input.assetId,
  });
};

export const findUser = async (
  input: { email: string },
  env?: string
): Promise<User> => {
  let user: any;
  if (env) {
    user = await dbConnection(env)("users").where("email", input.email).first();
  } else {
    user = await dbConnection()("users").where("email", input.email).first();
  }

  return user;
};

export const manageFund = async (
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
        const extractedTransfer = await dbConnection(env)("transfers")
          .where("foreign_user_id", extractedUser.id)
          .first();

        if (!extractedTransfer) {
          return await dbConnection(env)("transfers").insert({
            id: idGenerator(),
            amount: input.fund,
            foreign_user_id: extractedUser.id,
            user_id: input.user.id,
          });
        }
        
        return await dbConnection(env)("transfers")
          .where("foreign_user_id", extractedUser.id)
          .update({
            amount: extractedTransfer.amount + input.fund,
          });
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
        const extractedTransfer = await dbConnection()("transfers")
          .where("foreign_user_id", extractedUser.id)
          .first();

        if (!extractedTransfer) {
          return await dbConnection()("transfers").insert({
            id: idGenerator(),
            amount: input.fund,
            foreign_user_id: extractedUser.id,
            user_id: input.user.id,
          });
        }

        return await dbConnection()("transfers")
          .where("foreign_user_id", extractedUser.id)
          .update({
            amount: extractedTransfer.amount + input.fund,
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

        return await dbConnection(env)("users")
          .where("id", input.user.id)
          .update({
            wallet: withdrawOpResult,
          });
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

        return await dbConnection()("users")
          .where("id", input.user.id)
          .update({
            wallet: extractedUser.wallet - input.fund,
          });
      }
      // Handle the case when input.user or input.user.id is not provided.
      throw new Error("Missing user or user.id");
    default:
      if (input.user && input.user.id && env) {
        extractedUser = await dbConnection(env)("users")
          .where("id", input.user.id)
          .first();
        return await dbConnection(env)("users")
          .where("id", input.user.id)
          .update({
            wallet: extractedUser.wallet + input.fund,
          });
      }
      if (input.user && input.user.id) {
        extractedUser = await dbConnection()("users")
          .where("id", input.user.id)
          .first();
        return await dbConnection()("users")
          .where("id", input.user.id)
          .update({
            wallet: extractedUser.wallet + input.fund,
          });
      }
      // Handle the case when input.user or input.user.id is not provided.
      throw new Error("Missing user or user.id");
  }
};
