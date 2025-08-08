export interface User {
    id: string;
    full_name: string;
    email: string;
    role: 'applicant' | 'reviewer' | 'admin' | 'manager';
    profile_picture: string,
    is_active: string
}