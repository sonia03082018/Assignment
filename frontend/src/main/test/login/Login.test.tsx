
import { BrowserRouter, useNavigate } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { configureStore } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Iuser, UserState } from "main/redux/users/userTypes";
import Login from "main/components/login/Login";
import {  UserReducer } from "main/redux/users";
import IUser from "main/models/User";
import * as thunks from 'main/redux/users/thunks/userThunks';

//Mock react-router-dom
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUseNavigate,
}));

jest.mock('main/redux/users/thunks/userThunks');

const mockedUserLogin = thunks.userLogin as unknown as jest.Mock;
const mockUser: IUser = {
    username: 'John',
    password: '123457',
    email: 'test@gmail.com'
}

describe('Login Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const renderComponent = (initialState: { user: UserState } = {
        user: {
            user: mockUser,
            loading: false,
            error: null,
            success: null,
        },

    }) => {
        const store = configureStore({
            reducer: {
                user: UserReducer,
            },
            preloadedState: {...initialState},
            middleware: (getDefaultMiddleware: any) =>
                getDefaultMiddleware({ thunk: true, serializableCheck: false }),
        });

        //console.log(initialState);
        return render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        )
    }
    beforeEach(() => {
      mockedUserLogin.mockReset();
      mockedUseNavigate.mockReset();
    })
    afterEach(() => {
        jest.clearAllMocks();
    })



    it('should render login form', () => {
        renderComponent();
        //  screen.debug();
        expect(screen.getByText(/email address/i)).toBeInTheDocument();
        expect(screen.getByText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('should submit form and dispatch login', async () => {
          mockedUserLogin.mockImplementation((user: Iuser) => async (dispatch: any) => {
            dispatch({ type: 'users/userLogin/fulfilled', payload: {token:'abc', email:'test@gmail.com'} });
            return { type: 'users/userLogin/fulfilled', payload: {token:'abc', email:'test@gmail.com'} } 
        });
        renderComponent();


        const emailInput = screen.getByLabelText(/email/i);
        const password = screen.getByLabelText(/password/i);

        fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
        fireEvent.change(password, { target: { value: '123457' } });


        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(mockedUserLogin).toHaveBeenCalledWith({
                email: 'test@gmail.com',
                password: btoa('123457')
            });
           // expect(mockedUseNavigate).toHaveBeenCalledWith('main')
        })

    });

    it("Log error if login fails", async () => {
        mockedUserLogin.mockImplementation((user: Iuser) => async (dispatch: any) => {
            dispatch({ type: 'users/userLogin/rejected', error: {message:'Invalid password'} });
            return { type: 'users/userLogin/rejected', error: {message:'Invalid password'} } 
        });

        renderComponent();

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
              expect(mockedUserLogin).toHaveBeenCalledWith({
                email: 'test@gmail.com',
                password: btoa('wrongpass')
            });
           // expect(screen.getByText(/Invalid password/i)).toBeInTheDocument();
        });
    })

});