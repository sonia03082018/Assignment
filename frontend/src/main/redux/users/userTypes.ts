export interface Iuser {
    username: string;
    email: string;
    password: string;
}

export interface UserState {
    user: Iuser | null;
    loading: boolean;
    error: string | null;
    success: string | null;
}
