import axiosInstance from "./axiosInstance";
import type { LoginCredentials, LoginResponse } from "@/types/auth";

export async function loginRequest(credentials: LoginCredentials) {
  const response = await axiosInstance.post<LoginResponse>("/Auth/login", {
    username: credentials.email,
    password: credentials.password,
  });

  return response.data;
}
