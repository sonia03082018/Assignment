import axios from "axios";
import { addUser, login, logout } from "main/api/userApi";
import IUser from "main/models/User";

jest.mock('axios');
const mockedAxios = axios as unknown as jest.Mocked<typeof axios>;

describe('User Api', () => {
    it('should login', async () => {
        const loggedUser:IUser = { username: 'testuser',  email: 'test@gmail.com',  password: '123456' };
        mockedAxios.post.mockResolvedValueOnce(loggedUser);

        const result = await login(loggedUser);

        expect(mockedAxios.post).toHaveBeenCalledWith(
            'http://localhost:5000/users/login/', loggedUser, {
                withCredentials: true,
            });
        expect(result).toEqual(loggedUser);
    });

     it('should register', async () => {
        const registeredUser:IUser = { username: 'testuser',  email: 'test@gmail.com',  password: '123456' };
        mockedAxios.post.mockResolvedValueOnce(registeredUser);

        const result = await addUser(registeredUser);

        expect(mockedAxios.post).toHaveBeenCalledWith(
            'http://localhost:5000/users/add-user/', registeredUser, {
                withCredentials: true,
            });
        expect(result).toEqual(registeredUser);
    });

     it('should logout', async () => {
        const loggedOut = { };
        mockedAxios.post.mockResolvedValueOnce(loggedOut);

        const result = await logout();

        expect(mockedAxios.post).toHaveBeenCalledWith(
            'http://localhost:5000/users/logout/', loggedOut, {
                withCredentials: true,
            });
        expect(result).toEqual(loggedOut);
    });
});