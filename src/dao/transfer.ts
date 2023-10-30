import { dbConnection } from "../db/db";
import { v4 as idGenerator } from "uuid";
import { transferProps, Transfer } from "../types";

class TransferDAO {

  deleteTransfer = async (userId: string, env?: string) => {
    if (env) {
      await dbConnection(env)("transfers").where("user_id", userId).del();
    } else {
      await dbConnection()("transfers").where("user_id", userId).del();
    }
  };
  
  updateTransfer = async (
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
  
  findTransfer = async (
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
  
  createTransfer = async (
    data: transferProps,
    env?: string
  ) => {
    if (env) {
      await dbConnection(env)("transfers").insert({
        id: idGenerator(),
        amount: data.amount,
        foreign_user_id: data.foreignUserId,
        user_id: data.userId,
      });
    } else {
      await dbConnection()("transfers").insert({
        id: idGenerator(),
        amount: data.amount,
        foreign_user_id: data.foreignUserId,
        user_id: data.userId,
      });
    }
  };
}

export default new TransferDAO();
