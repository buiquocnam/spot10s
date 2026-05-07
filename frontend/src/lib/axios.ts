import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Bạn có thể thêm interceptors ở đây nếu cần (ví dụ xử lý lỗi 401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi tập trung
    if (error.response?.status === 401) {
      const is_admin_api = error.config?.url?.includes("/admin");
      const is_login_page = window.location.pathname.includes("/admin/login");
      
      if (is_admin_api && !is_login_page) {
        window.location.href = "/admin/login";
      }
    }
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
