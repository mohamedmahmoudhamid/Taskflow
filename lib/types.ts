export type AuthUser = {
  _id: string;
  email: string;
  role: string;
};

export type AuthResponse = {
  message?: string;
  token?: string;
  user?: AuthUser & { password?: string };
};
