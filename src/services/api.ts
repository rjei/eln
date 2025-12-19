const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper to get auth token
const getToken = (): string | null => localStorage.getItem('token');

async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    // Memastikan endpoint diawali dengan /
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    try {
        const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
            ...options,
            headers,
        });

        // Tangani jika respon kosong atau bukan JSON (sering terjadi pada error 500)
        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = { message: await response.text() };
        }

        if (!response.ok) {
            // Jika token kadaluarsa (401), bisa tambahkan logika logout otomatis di sini
            if (response.status === 401) {
                localStorage.removeItem('token');
            }
            throw new Error(data.message || data.payload?.error || 'Something went wrong');
        }

        return data;
    } catch (error: any) {
        console.error(`API Error [${endpoint}]:`, error.message);
        throw error;
    }
}

// ============ Interfaces ============

interface ApiResponse<T> {
    status: number;
    payload: T;
}

export interface AuthPayload {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        xp?: number; // Tambahan XP jika ada di backend
        level?: number;
    };
}

export interface Course {
    id: number;
    title: string;
    description: string;
    level: string;
    duration: string;
    students: number;
    rating: number;
    lessons: number;
    image: string;
    category: string;
    Lessons?: Lesson[];
}

export interface Lesson {
    id: number;
    courseId: number;
    title: string;
    content: string;
    order: number;
    duration: number;
    videoUrl?: string;
    thumbnail?: string;
    transcript?: TranscriptSegment[];
}

export interface TranscriptSegment {
    id: number;
    startTime: number;
    endTime: number;
    text: string;
    speaker: string;
}

export interface UserProgress {
    id: number;
    lessonId: number;
    courseId: number;
    progress: number;
    completed: boolean;
    timeSpent: number;
    completedAt: string | null;
}

// ============ Auth API ============

export const login = async (email: string, password: string): Promise<AuthPayload> => {
    const response = await apiRequest<ApiResponse<AuthPayload>>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

    const { token, user } = response.payload;
    if (token) localStorage.setItem('token', token);
    return { token, user };
};

export const register = async (
    name: string,
    email: string,
    password: string
): Promise<AuthPayload> => {
    const response = await apiRequest<ApiResponse<AuthPayload>>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
    });

    const { token, user } = response.payload;
    if (token) localStorage.setItem('token', token);
    return { token, user };
};

export const logout = (): void => {
    localStorage.removeItem('token');
};

// ============ Courses API ============

export const getCourses = async (): Promise<Course[]> => {
    const response = await apiRequest<ApiResponse<Course[]>>('/courses');
    return response.payload || [];
};

export const getCourseById = async (id: number): Promise<Course> => {
    const response = await apiRequest<ApiResponse<Course>>(`/courses/${id}`);
    return response.payload;
};

export const getLessonById = async (id: number): Promise<Lesson> => {
    const response = await apiRequest<ApiResponse<Lesson>>(`/lessons/${id}`);
    return response.payload;
};

export const getLessonsByCourse = async (courseId: number): Promise<Lesson[]> => {
    const response = await apiRequest<ApiResponse<Lesson[]>>(`/lessons/course/${courseId}`);
    return response.payload || [];
};

// ============ Progress API ============

export interface ProgressData {
    lessonId: number;
    progress: number;
    completed: boolean;
    timeSpent: number;
}

export const updateProgress = async (data: ProgressData): Promise<void> => {
    await apiRequest('/progress', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const getProgressByCourse = async (courseId: number): Promise<UserProgress[]> => {
    try {
        const response = await apiRequest<ApiResponse<UserProgress[]>>(`/progress/course/${courseId}`);
        return response.payload || [];
    } catch (error) {
        return [];
    }
};

// ============ Helpers ============

export const isAuthenticated = (): boolean => {
    return !!getToken();
};
