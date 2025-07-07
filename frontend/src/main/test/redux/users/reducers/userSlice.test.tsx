import { registerUser, userLogin, UserReducer } from "main/redux/users";
import { Iuser, UserState } from "main/redux/users/userTypes";



describe('userSlice reducers', () => {
    const initialState:  UserState = {
        user: null,
        loading: false,
        error: null,
        success: null
    }


     it('should return with initial state', () => {
        expect(UserReducer(undefined, { type: '' })).toEqual(initialState);
    });

    it('should handle userLogin pending', () => {
        const action = { type: userLogin.pending.type };
        const state = UserReducer(initialState, action);
        expect(state).toEqual({
            ...initialState,
            loading: true,
            error: null
        })
    });

    it('should handle userLogin fulfilled', () => {
        const payload:Iuser = {  username: 'testUser',    email: 'test@gmail.com',     password: '123456'};
        const action = { type: userLogin.fulfilled.type, payload };
        const state = UserReducer(initialState, action);
        expect(state).toEqual({
            ...initialState,
            loading: false,
            user: payload,

        })
    });

    it('should handle userLogin rejected', () => {
        const action = { type: userLogin.rejected.type, error: { message: 'Login failed' } };
        const state = UserReducer(initialState, action);
        expect(state).toEqual({
            ...initialState,
            loading: false,
            error: 'Login failed'
        })
    });

    it('should handle registerUser pending', () => {
        const action = { type: registerUser.pending.type };
        const state = UserReducer(initialState, action);
        expect(state).toEqual({
            ...initialState,
            loading: true,
            error: null
        })
    });

    it('should handle registerUser fulfilled', () => {
        const payload:Iuser = {  username: 'testUser',    email: 'test@gmail.com',     password: '123456'};
        const action = { type: registerUser.fulfilled.type, payload };
        const state = UserReducer(initialState, action);
        expect(state).toEqual({
            ...initialState,
            loading: false,
            user: payload,
            success:'Registered Successfully'

        })
    });

    it('should handle registerUser rejected', () => {
        const action = { type: registerUser.rejected.type, error: { message: 'Registered failed' } };
        const state = UserReducer(initialState, action);
        expect(state).toEqual({
            ...initialState,
            loading: false,
            error: 'Registered failed'
        })
    });

});