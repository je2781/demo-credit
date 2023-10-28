export type User = Record<
  "image_url" | "full_name" | "email" | "wallet" | "password" | "id" | "image_name",
  any
>;

export interface createUserProps {
    fullName: string;
    email: string;
    wallet: number;
    password: string;
    imageUrl: string;
    imageName: string;
  }
