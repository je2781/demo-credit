export type User = Record<
  "image_url" | "full_name" | "email" | "wallet" | "password" | "id" | "cloudinary_asset_id" ,
  any
>

export type Transfer = Record<
  "foreign_user_id" | "user_id" | "id"  | "amount",
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
  }
