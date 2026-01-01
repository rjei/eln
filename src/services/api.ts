const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper to get auth token
const getToken = (): string | null => localStorage.getItem('token');

// Generic fetch wrapper with auth
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

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

// ============ Auth API ============

interface AuthPayload {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface ApiResponse<T> {
    status: number;
    payload: T;
}

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiRequest<ApiResponse<AuthPayload>>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

    const { token, user } = response.payload;

    // Store token
    if (token) {
        localStorage.setItem('token', token);
    }

    return { token, user };
};

export const register = async (
    name: string,
    email: string,
    password: string
): Promise<LoginResponse> => {
    const response = await apiRequest<ApiResponse<AuthPayload>>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
    });

    const { token, user } = response.payload;

    // Store token
    if (token) {
        localStorage.setItem('token', token);
    }

    return { token, user };
};

export const logout = (): void => {
    localStorage.removeItem('token');
};

// ============ Courses API ============

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

interface CoursesResponse {
    status: number;
    payload: Course[];
}

interface CourseResponse {
    status: number;
    payload: Course;
}

interface LessonResponse {
    status: number;
    payload: Lesson;
}

export const getCourses = async (): Promise<Course[]> => {
    const response = await apiRequest<CoursesResponse>('/courses');
    return response.payload || [];
};

export const getCourseById = async (id: number): Promise<Course> => {
    const response = await apiRequest<CourseResponse>(`/courses/${id}`);
    return response.payload;
};

export const getLessonById = async (id: number): Promise<Lesson> => {
    const response = await apiRequest<LessonResponse>(`/lessons/${id}`);
    return response.payload;
};

export const getLessonsByCourse = async (courseId: number): Promise<Lesson[]> => {
    const response = await apiRequest<{ status: number; payload: Lesson[] }>(
        `/lessons/course/${courseId}`
    );
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

// Get user's progress for a specific course
export interface UserProgress {
    id: number;
    lessonId: number;
    courseId: number;
    progress: number;
    completed: boolean;
    timeSpent: number;
    completedAt: string | null;
}

export const getProgressByCourse = async (courseId: number): Promise<UserProgress[]> => {
    try {
        const response = await apiRequest<{ status: number; payload: UserProgress[] }>(
            `/progress/course/${courseId}`
        );
        return response.payload || [];
    } catch {
        // Return empty array if not authenticated or error
        return [];
    }
};

// ============ User Stats API ============

export interface UserStats {
    points: number;
    level: number;
    lessonsCompleted: number;
    coursesCompleted: number;
    streak: number;
    totalTimeSpent: number;
}

export const getUserStats = async (): Promise<UserStats | null> => {
    try {
        const response = await apiRequest<{ status: number; payload: { Stats: UserStats } }>('/auth/me');
        if (response.status === 200 && response.payload?.Stats) {
            return response.payload.Stats;
        }
        return null;
    } catch {
        return null;
    }
};

// Alternative: Get stats from progress endpoint (if backend supports it)
export const getProgressStats = async (): Promise<UserStats | null> => {
    try {
        const response = await apiRequest<{ status: number; payload: UserStats }>('/progress/stats');
        if (response.status === 200 && response.payload) {
            return response.payload;
        }
        return null;
    } catch {
        return null;
    }
};

// ============ Error Handler ============

export const isAuthenticated = (): boolean => {
    return !!getToken();
};
