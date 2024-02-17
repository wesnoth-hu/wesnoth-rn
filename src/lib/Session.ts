export type Session = {
  id: string;
  userID: string;
  sessionData: string;
  loginAt: Date;
  logoutAt: Date | null;
  status: string;
} | null;
