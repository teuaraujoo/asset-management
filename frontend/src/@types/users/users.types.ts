export interface UserProfile {
    id: string;
    name: string;
    email: string;
    is_active: boolean | null;
    created_at: string;
    updated_at: string;
};

export interface UpdateUserBody {
    name?: string;
    email?: string;
};
