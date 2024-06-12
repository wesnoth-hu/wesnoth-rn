export type User = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  emailVerified: boolean;
  race: string;
  level: number;
  money: number | null;
  status: string;
  lockedAt: Date | null;
  mfaEnabled: boolean;
  mfaComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
} | null;
