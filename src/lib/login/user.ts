export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  emailVerified: boolean;
  race: string;
  money: number | null;
  createdAt: Date;
  updatedAt: Date;
}
