import { LendingServiceImpl, Transfer, User, createUserProps, transferProps } from "../types";
import UserDAO from '../dao/user';
import TransferDAO from "../dao/transfer";

class LendingService implements LendingServiceImpl{
    async createUser (
        data: createUserProps,
        testObj: { env: string; id: string }
      ){
        await UserDAO.createUser(data, testObj);
      }
    
      async deleteUser (email: string, env?: string){
        await UserDAO.deleteUser(email, env);
      }
    
      async updateUser (input: { email: string; assetId: string }) {
        await UserDAO.updateUser(input);
      }
    
      async findUser(input: { email: string }, env?: string) {
        const user =  await UserDAO.findUser(input, env);
        return user;
      }
    
      async manageFund(
        input: {
          foreignUser?: { name: string; email: string };
          user?: User;
          fund: number;
          mode: string;
        },
        env?: string
      ) {
        await UserDAO.manageFund(input, env);
      }
    
      async deleteTransfer(userId: string, env?: string){
        await TransferDAO.deleteTransfer(userId, env);
      }
    
      async updateTransfer (
        input: { transfer: Transfer; fund: number; foreignId: string },
        env?: string
      ) {
       await  TransferDAO.updateTransfer(input, env);
      }
    
      async findTransfer(
        input: { foreignId: string },
        env?: string
      ) {
        const transfer = await TransferDAO.findTransfer(input, env);
        return transfer;
      }
    
      async createTransfer(data: transferProps, env?: string) {
        await TransferDAO.createTransfer(data, env);
      }
}

export default new LendingService();