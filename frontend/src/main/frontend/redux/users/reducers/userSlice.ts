import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "../userTypes";
import { registerUser, userLogin, userLogout } from "../thunks/userThunks";

const initialState : UserState = {
    user: null,
    loading: false,
    error: null,
    success: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.user = null;
        },
        resetUserStatus: (state) =>{
            state.error = null;
            state.success = null;
        }
    },
    extraReducers: (builder) =>{
        builder
        .addCase(userLogin.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        })
        .addCase(userLogin.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            console.log(state.user, action.payload)
        })
        .addCase(userLogin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string || 'Login failed'
        })
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.success = 'Registered Successfully'
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string || 'Registered failed'
        })
    }
})
export const {resetUserStatus} = userSlice.actions
export default userSlice.reducer;
