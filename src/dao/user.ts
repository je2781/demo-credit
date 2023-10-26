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

export const deleteUser = async (
  email: string,
  env?: string
) => {
  if (env) {
    await dbConnection(env)("users").where('email', email).del();
  } else {
    await dbConnection()("users").where('email', email).del();

  }
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
    foreignUserEmail?: string;
    user?: User;
    fund: number;
    mode: string;
  },
  env?: string
) => {
  let extractedUser: any;

  switch (input.mode) {
    case "transfer":
      if (input.foreignUserEmail && env) {
        extractedUser = await dbConnection(env)("users")
          .where("email", input.foreignUserEmail)
          .first();
        return await dbConnection(env)("users")
          .where("email", input.foreignUserEmail)
          .update({
            wallet: extractedUser.wallet + input.fund,
          });
      }
      if (input.foreignUserEmail) {
        extractedUser = await dbConnection()("users")
          .where("email", input.foreignUserEmail)
          .first();
        return await dbConnection()("users")
          .where("email", input.foreignUserEmail)
          .update({
            wallet: extractedUser.wallet + input.fund,
          });
      }
      // Handle the case when input.foreignUserEmail is not provided.
      throw new Error("Missing foreignUserEmail");
    case "withdraw":
      if (input.user && input.user.id && env) {
        extractedUser = await dbConnection(env)("users")
          .where("id", input.user.id)
          .first();
        return await dbConnection(env)("users")
          .where("id", input.user.id)
          .update({
            wallet: extractedUser.wallet - input.fund,
          });
      }
      if (input.user && input.user.id) {
        extractedUser = await dbConnection()("users")
          .where("id", input.user.id)
          .first();
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
