import { createAsyncThunk } from "@reduxjs/toolkit";
import { Iuser } from "../userTypes";
import { addUser, login, logout } from "../../../api/userApi";


export const userLogin = createAsyncThunk('users/login',
    async (user: Iuser, thunkAPI) => {
        console.log("called login API");
        try {
            const response = await login(user);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.respons?.data || 'Invalid credentials');
        }
    }
)

export const registerUser = createAsyncThunk('users/add-user',
    async (user: Iuser, thunkAPI) => {
        try {
            const response = await addUser(user);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.respons?.data || 'User exists');
        }
    }
)


export const userLogout = createAsyncThunk('users/logout',
    async () => {
        const response = await logout();
        return response.data;
    }
)