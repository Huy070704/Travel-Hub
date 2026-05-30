import axios from 'axios';

// Chọn backend để test (đổi thành true nếu muốn test với backend localhost)
const isLocal = false; 

const LOCAL_URL = 'http://localhost:5190/api';
const RENDER_URL = 'https://travelhub-f3vu.onrender.com/api';

// Lấy base URL từ biến môi trường (khi deploy Vercel) hoặc dùng cấu hình test
const baseURL = (import.meta as any).env.VITE_API_BASE_URL || (isLocal ? LOCAL_URL : RENDER_URL);

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Cho phép gửi cookies nếu cần (VD: SignalR cần auth, hay cookie-based auth)
  withCredentials: true,
});

// Interceptor cho Request
axiosInstance.interceptors.request.use(
  (config) => {
    // Thêm token vào header nếu có
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho Response
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Xử lý các lỗi phổ biến (ví dụ 401 Unauthorized)
      if (error.response.status === 401) {
        // Tùy chọn: Xóa token và điều hướng về trang đăng nhập
        console.error('Unauthorized, please login again.');
        // localStorage.removeItem('token');
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;