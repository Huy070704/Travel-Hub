import axiosInstance from "./axiosInstance";
import type { 
  LoginCredentials, 
  LoginResponse,
  RegisterRequest,
  TokenRequest,
  AuthResponse,
  ForgotPasswordRequest,
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

export async function changePasswordRequest(data: ChangePasswordRequest) {
  const response = await axiosInstance.post<{ message: string }>("/Auth/change-password", data);
  return response.data;
}
