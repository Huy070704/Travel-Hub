import axiosInstance from "./axiosInstance";
import type { 
  LoginCredentials, 
  LoginResponse,
  RegisterRequest,
  RegisterOtpRequest,
  TokenRequest,
  AuthResponse,
  ForgotPasswordRequest,
  VerifyForgotPasswordOtpRequest,
  VerifyRegisterOtpRequest,
  ChangePasswordRequest
} from "@/types/auth";

export async function loginRequest(credentials: LoginCredentials) {
  const response = await axiosInstance.post<LoginResponse>("/Auth/login", {
    email: credentials.email,
    password: credentials.password,
  });

  return response.data;
}

export async function googleLoginRequest(idToken: string) {
  const response = await axiosInstance.post<LoginResponse>("/Auth/google-login", {
    idToken: idToken,
  });

  return response.data;
}

export async function registerRequest(data: RegisterRequest) {
  const response = await axiosInstance.post<{ message: string }>("/Auth/register", data);
  return response.data;
}

export async function requestRegisterOtp(data: RegisterOtpRequest) {
  const response = await axiosInstance.post<{ message: string }>("/Auth/register/send-otp", data);
  return response.data;
}

export async function verifyRegisterOtp(data: VerifyRegisterOtpRequest) {
  const response = await axiosInstance.post<{ message: string }>("/Auth/register/verify-otp", data);
  return response.data;
}

export async function refreshTokenRequest(data: TokenRequest) {
  const response = await axiosInstance.post<AuthResponse>("/Auth/refresh-token", data);
  return response.data;
}

export async function logoutRequest() {
  const response = await axiosInstance.post<{ message: string }>("/Auth/logout");
  return response.data;
}

export async function forgotPasswordRequest(data: ForgotPasswordRequest) {
  const response = await axiosInstance.post<{ message: string }>("/Auth/forgot-password", data);
  return response.data;
}

export async function requestForgotPasswordOtp(data: ForgotPasswordRequest) {
  const response = await axiosInstance.post<{ message: string }>("/Auth/forgot-password/send-otp", data);
  return response.data;
}

export async function verifyForgotPasswordOtp(data: VerifyForgotPasswordOtpRequest) {
  const response = await axiosInstance.post<{ message: string }>("/Auth/forgot-password/verify-otp", data);
  return response.data;
}

export async function changePasswordRequest(data: ChangePasswordRequest) {
  const response = await axiosInstance.post<{ message: string }>("/Auth/change-password", data);
  return response.data;
}
