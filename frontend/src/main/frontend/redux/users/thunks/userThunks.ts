import { createAsyncThunk } from "@reduxjs/toolkit";
import { Iuser } from "../userTypes";
import { addUser, login, logout } from "main/frontend/api/userApi";


export const userLogin = createAsyncThunk('users/login',
    async (user: Iuser) => {
        const response = await login(user);
        return response.data;
    }
)

export const registerUser = createAsyncThunk('users/add-user',
    async (user: Iuser) => {
        const response = await addUser(user);
        return response.data;
    }
)


export const userLogout = createAsyncThunk('users/logout',
    async () => {
        const response = await logout();
        return response.data;
    }
)