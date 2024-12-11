export type Role = 'Superadmin' | 'Admin' | 'Staff' | 'User';

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    token: string;
    user: User;
    message: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}
