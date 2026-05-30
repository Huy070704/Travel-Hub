export type AuthUser = {
  userID?: string | number;
  username?: string;
  email?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  userID: number;
  username: string;
};

// Map LoginResponse to AuthResponse to maintain compatibility
export type LoginResponse = AuthResponse;

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  studentCode?: string;
};

export type RegisterOtpRequest = RegisterRequest;

export type VerifyRegisterOtpRequest = {
  email: string;
  otp: string;
};

export type TokenRequest = {
  accessToken: string;
  refreshToken: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type VerifyForgotPasswordOtpRequest = {
  email: string;
  otp: string;
  newPassword: string;
};

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};
