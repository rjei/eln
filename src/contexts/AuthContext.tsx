import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User, token: string) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    showLoginModal: boolean;
    setShowLoginModal: (show: boolean) => void;
    requireAuth: (callback: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

    // Check for existing token on mount and restore session
    useEffect(() => {
        const restoreSession = async () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            console.log('[AuthContext] Restoring session, token:', !!token, 'savedUser:', !!savedUser);

            // First, try to restore from localStorage immediately
            if (savedUser) {
                try {
                    const parsedUser = JSON.parse(savedUser);
                    setUser(parsedUser);
                } catch (e) {
                    console.error('[AuthContext] Error parsing saved user:', e);
                }
            } else if (!token) {
                // No cached user and no token, stay logged out
                setIsLoading(false);
                return;
            }

            // Background validation - NEVER LOGOUT AUTOMATICALLY ON INIT
            // This prevents session loss on refresh if server is flaky or slow
            if (token) {
                fetch('http://localhost:5000/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(async (response) => {
                    if (response.ok) {
                        const data = await response.json();
                        if (data.status === 200 && data.payload) {
                            const freshUser = { ...data.payload };
                            setUser(freshUser);
                            localStorage.setItem('user', JSON.stringify(freshUser));
                            console.log('[AuthContext] Session validated & updated');
                        }
                    }
                }).catch(err => {
                    console.log('[AuthContext] Validation skipped (network/offline):', err);
                });
            }

            setIsLoading(false);
        };

        restoreSession();
    }, []);

    const login = (userData: User, token: string) => {
        console.log('[AuthContext] Login called', userData.name);
        setUser(userData);
        if (token) {
            localStorage.setItem('token', token);
        }
        localStorage.setItem('user', JSON.stringify(userData));
        setShowLoginModal(false);

        // Execute pending action after login
        if (pendingAction) {
            setTimeout(() => {
                pendingAction();
                setPendingAction(null);
            }, 100);
        }
    };

    const logout = () => {
        console.log('[AuthContext] Logout called');
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('enrolledCourses');
    };

    const updateUser = (userData: Partial<User>) => {
        setUser(prev => {
            const updated = { ...(prev ?? {}), ...userData };
            localStorage.setItem('user', JSON.stringify(updated));
            return updated;
        });
    };

    const requireAuth = (callback: () => void) => {
        if (user) {
            callback();
        } else {
            setPendingAction(() => callback);
            setShowLoginModal(true);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                updateUser,
                showLoginModal,
                setShowLoginModal,
                requireAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
