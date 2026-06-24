import axios from 'axios';

// Lấy base URL từ biến môi trường
// Nếu không có, mặc định sẽ là localhost:8080 của backend .NET
// Đảm bảo baseURL kết thúc bằng /api
const rawBase = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// ĐỔI TÊN: Từ baseURL thành apiBaseUrl để tránh đụng độ khai báo trên Vercel
const apiBaseUrl = rawBase.endsWith('/api') ? rawBase : rawBase.replace(/\/$/, '') + '/api';

const axiosInstance = axios.create({
  baseURL: apiBaseUrl, // Truyền biến đã đổi tên vào đây
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
        // Xóa token và điều hướng về trang đăng nhập
        console.error('Unauthorized, please login again.');
        localStorage.removeItem('token');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;