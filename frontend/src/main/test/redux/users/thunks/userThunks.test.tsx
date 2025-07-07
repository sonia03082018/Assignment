import * as userApi from "main/api/userApi";
import IUser from "main/models/User";
import { registerUser, userLogin, userLogout } from "main/redux/users/thunks/userThunks";


jest.mock('main/api/userApi', () => ({
    login: jest.fn(),
    addUser: jest.fn(),
    logout: jest.fn()
}));

describe('userThunks', () => {
    const mockUser: IUser = {
        username: 'test',
        email: 'test@gmail.com',
        password: 'YW1pdDEyMw=='
    };
    const dispatch = jest.fn();
    const getState = jest.fn();
    const extra = undefined;

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should login user successfully', async () => {
        (userApi.login as jest.Mock).mockImplementation(async (user) => {
            return { data: { token: 'abcd123' } }
        })

        const result = await userLogin(mockUser)(dispatch, getState, {})
        expect(userApi.login).toHaveBeenCalled();
        expect(userApi.login).toHaveBeenCalledWith(mockUser);
        expect(result.payload).toEqual({ token: 'abcd123' });
        expect(result.type).toBe('users/login/fulfilled')
    });

    it('should handle login failure', async () => {
        (userApi.login as jest.Mock).mockImplementation(() => {
            throw { response: { data: 'Invalid password' } }
        });

        const result = await userLogin(mockUser)(dispatch, getState, {});
        expect(result.type).toBe('users/login/rejected');
        expect(result.payload).toBe('Invalid password')
    });
    it('should register user successfully', async () => {
        (userApi.addUser as jest.Mock).mockImplementation(async (user) => {
            return { data: { id: '1', ...mockUser } }
        })

        const result = await registerUser(mockUser)(dispatch, getState, {})
        expect(userApi.addUser).toHaveBeenCalled();
        expect(userApi.addUser).toHaveBeenCalledWith(mockUser);
        expect(result.payload).toEqual({ id: '1', ...mockUser });
        expect(result.type).toBe('users/add-user/fulfilled')
    });

    it('should handle registration failure', async () => {
        (userApi.addUser as jest.Mock).mockImplementation(() => {
            throw { response: { data: 'Email already registered' } }
        });

        const result = await registerUser(mockUser)(dispatch, getState, {});
        expect(result.type).toBe('users/add-user/rejected');
        expect(result.payload).toBe('Email already registered')
    });

    it('should logout user successfully', async () => {
        (userApi.logout as jest.Mock).mockImplementation(async (user) => {
            return { data: 'logged out' }
        })

        const result = await userLogout()(dispatch, getState, {})
        expect(userApi.logout).toHaveBeenCalled();
        expect(result.type).toBe('users/logout/fulfilled')
    });
})