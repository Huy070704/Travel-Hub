export type AuthUser = {
  userID?: string | number;
  username?: string;
  email?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  userID?: string | number;
  username?: string;
};
