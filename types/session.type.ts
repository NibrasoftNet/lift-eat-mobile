export type SessionProps = {
  token: string | null;
  tokenExpire: number | null;
  user: UserSessionProps | null;
};

export type UserSessionProps = {
  id: number;
  email: string;
};
