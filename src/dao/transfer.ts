import { dbConnection } from "../db/db";
import { v4 as idGenerator } from "uuid";
import { transferProps, Transfer } from "../types";

export const deleteTransfer = async (userId: string, env?: string) => {
  if (env) {
    await dbConnection(env)("transfers").where("user_id", userId).del();
  } else {
    await dbConnection()("transfers").where("user_id", userId).del();
  }
};

export const updateTransfer = async (
  input: { transfer: Transfer; fund: number; foreignId: string },
  env?: string
) => {
  if (env) {
    await dbConnection(env)("transfers")
      .where("foreign_user_id", input.foreignId)
      .update({
        amount: input.transfer.amount + input.fund,
      });
  } else {
    await dbConnection(env)("transfers")
      .where("foreign_user_id", input.foreignId)
      .update({
        amount: input.transfer.amount + input.fund,
      });
  }
};

export const findTransfer = async (
  input: { foreignId: string },
  env?: string
): Promise<Transfer> => {
  let transfer: any;
  if (env) {
    transfer = await dbConnection(env)("transfers")
      .where("foreign_user_id", input.foreignId)
      .first();
  } else {
    transfer = await dbConnection()("transfers")
      .where("foreign_user_id", input.foreignId)
      .first();
  }

  return transfer;
};

export const createTransfer = async (
  data: { amount: number; foreignId: string; userId: string },
  env?: string
) => {
  if (env) {
    await dbConnection(env)("transfers").insert({
      id: idGenerator(),
      amount: data.amount,
      foreign_user_id: data.foreignId,
      user_id: data.userId,
    });
  } else {
    await dbConnection()("transfers").insert({
      id: idGenerator(),
      amount: data.amount,
      foreign_user_id: data.foreignId,
      user_id: data.userId,
    });
  }
};
