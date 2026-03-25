import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('navhub-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

instance.interceptors.response.use(
  <T>(response: AxiosResponse<ApiResponse<T>>) => {
    const payload = response.data;

    if (payload && typeof payload === 'object' && 'code' in payload && 'data' in payload) {
      if (payload.code !== 0) {
        return Promise.reject(new Error(payload.message || '请求失败'));
      }
      return payload.data;
    }

    return response.data as T;
  },
  (error: AxiosError<{ message?: string; data?: { message?: string } }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('navhub-token');
      localStorage.removeItem('navhub-user');
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.data?.message ||
      error.message ||
      '网络异常，请稍后重试';

    return Promise.reject(new Error(message));
  }
);

const request = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.get<ApiResponse<T>, T>(url, config);
  },

  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return instance.post<ApiResponse<T>, T>(url, data, config);
  },

  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return instance.put<ApiResponse<T>, T>(url, data, config);
  },

  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete<ApiResponse<T>, T>(url, config);
  },
};

export default request;
