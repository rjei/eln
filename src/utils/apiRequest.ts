// API Request utility
const API_BASE_URL = "http://localhost:5000/api";

interface ApiResponse {
    status: number;
    payload?: any;
    message?: string;
}

const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
};

const apiRequest = {
    async get(endpoint: string): Promise<ApiResponse> {
        const token = getAuthToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers,
        });

        return response.json();
    },

    async post(endpoint: string, data: any): Promise<ApiResponse> {
        const token = getAuthToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });

        return response.json();
    },

    async put(endpoint: string, data: any): Promise<ApiResponse> {
        const token = getAuthToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });

        return response.json();
    },

    async delete(endpoint: string): Promise<ApiResponse> {
        const token = getAuthToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers,
        });

        return response.json();
    },
};

export default apiRequest;
