export type User = Record<
  | "image_url"
  | "full_name"
  | "email"
  | "wallet"
  | "password"
  | "id"
  | "cloudinary_asset_id",
  any
>;

export type Transfer = Record<
  "foreign_user_id" | "user_id" | "id" | "amount",
  any
>;

export interface createUserProps {
  fullName: string;
  email: string;
  wallet: number;
  password: string;
  imageUrl: string;
  cloudinaryAssetId?: string;
}

export interface transferProps {
  foreignUserId: string;
  userId: string;
  amount: number;
}

export interface auditProps {
  userId: string;
  amount: number;
}

export interface WalletServiceImpl {
  createUser: (
    data: createUserProps,
    testObj: { env: string; id: string }
  ) => Promise<void>;

  deleteUser: (email: string, env?: string) => Promise<void>;

  updateUser: (input: { email: string; assetId: string }) => Promise<void>;

  findUser: (input: { email: string }, env?: string) => Promise<User>;

  manageFund: (
    input: {
      foreignUser?: { name: string; email: string };
      user?: User;
      fund: number;
      mode: string;
    },
    env?: string
  ) => Promise<any>;

  deleteTransfer: (userId: string, env?: string) => Promise<void>;

  updateTransfer: (
    input: { transfer: Transfer; fund: number; foreignId: string },
    env?: string
  ) => Promise<void>;

  findTransfer: (
    input: { foreignId: string },
    env?: string
  ) => Promise<Transfer>;

  createTransfer: (data: transferProps, env?: string) => Promise<void>;

  deleteAudit: (userId: string, env?: string) => Promise<void>;

  debit: (data: auditProps, env?: string) => Promise<void>;

  credit: (data: auditProps, env?: string) => Promise<void>;
}
