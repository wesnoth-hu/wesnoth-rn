export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  emailVerified: boolean;
  race: string;
  level: number;
  money: number | null;
  createdAt: Date;
  updatedAt: Date;
} | null;
