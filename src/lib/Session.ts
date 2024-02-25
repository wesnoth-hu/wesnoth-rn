export type Session = {
  id: string;
  userID: string;
  sessiondata: string;
  loginAt: Date;
  logoutAt: Date | null;
  status: string;
} | null;
