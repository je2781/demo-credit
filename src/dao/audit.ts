import { dbConnection } from "../db/db";
import { v4 as idGenerator } from "uuid";
import { auditProps } from "../types";

class AuditDAO {
  debit = async (data: auditProps, env?: string) => {
    if (env) {
      await dbConnection(env)("audit").insert({
        id: idGenerator(),
        debit: data.amount,
        credit: 0,
        user_id: data.userId,
      });
    } else {
      await dbConnection()("audit").insert({
        id: idGenerator(),
        debit: data.amount,
        credit: 0,
        user_id: data.userId,
      });
    }
  };

  credit = async (data: auditProps, env?: string) => {
    if (env) {
      await dbConnection(env)("audit").insert({
        id: idGenerator(),
        credit: data.amount,
        debit: 0,
        user_id: data.userId,
      });
    } else {
      await dbConnection()("audit").insert({
        id: idGenerator(),
        credit: data.amount,
        debit: 0,
        user_id: data.userId,
      });
    }
  };

  deleteAudit= async (userId: string, env?: string) => {
    if (env) {
      await dbConnection(env)("audit").where("user_id", userId).del();
    } else {
      await dbConnection()("audit").where("user_id", userId).del();
    }
  };
}

export default new AuditDAO();
