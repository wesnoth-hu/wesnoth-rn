export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  emailVerified: boolean;
  race: string;
  money: number | null;
  createdAt: Date;
  updatedAt: Date;
} | null;
