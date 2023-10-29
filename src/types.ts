export type User = Record<
  "image_url" | "full_name" | "email" | "wallet" | "password" | "id" | "cloudinary_asset_id" ,
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
