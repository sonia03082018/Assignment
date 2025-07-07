
//Mock react-router-dom
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUseNavigate,
}));

import { BrowserRouter, useNavigate } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { configureStore } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import { UserState } from "main/redux/users/userTypes";
import { registerUser, UserReducer } from "main/redux/users";
import Register from "main/components/login/Register";
import * as thunks from 'main/redux/users/thunks/userThunks';
import IUser from "main/models/User";

jest.mock('main/redux/users/thunks/userThunks');

const mockedRegister = thunks.registerUser as unknown as jest.Mock;
const mockUser: IUser = {
    username: 'John',
    password: '123457',
    email: 'test@gmail.com'
}

describe('Register Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const renderComponent = (initialState: { user: UserState } = {
        user: {
            user: null,
            loading: false,
            error: null,
            success: null
        },

    }) => {
        const store = configureStore({
            reducer: {
                user: UserReducer,
            },
            preloadedState: { ...initialState },
            middleware: (getDefaultMiddleware: any) =>
                getDefaultMiddleware({ thunk: true, serializableCheck: false }),
        });

        //console.log(initialState);
        return render(
            <Provider store={store}>
                <BrowserRouter>
                    <Register />
                </BrowserRouter>
            </Provider>
        )
    }


    it('should render login form', () => {
        renderComponent();
        //  screen.debug();
        expect(screen.getByText(/username/i)).toBeInTheDocument();
        expect(screen.getByText(/email address/i)).toBeInTheDocument();
        expect(screen.getByText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('should submit form and dispatch login', async () => {
        mockedRegister.mockImplementation((userData: IUser) => async (dispatch: any) => {
            dispatch({ type: 'users/registerUser/fulfilled', payload: userData });
            return { type: 'users/registerUser/fulfilled', payload: userData }
        })

        renderComponent();
        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const emailInput = screen.getByLabelText(/email/i);

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'test@gmail.com' } });
        fireEvent.change(emailInput, { target: { value: '1234' } });


        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        // await waitFor(() => {
        //     expect(mockedRegister).toHaveBeenCalledWith({
        //         name: 'testuser',
        //         email: 'test@gmail.com',
        //         password: '1234'
        //     });
        //     expect(mockedUseNavigate).toHaveBeenCalledWith('\main')
        // })

    });

    it("Log error if login fails", async () => {
        mockedRegister.mockImplementation(() => async (dispatch: any) => {
            dispatch({ type: 'users/registerUser/rejected', error: { message: 'email already exists' } });
            return { type: 'users/registerUser/rejected', error: { message: 'email already exists' } }
        })

        renderComponent();

        const passwordInput = screen.getByLabelText(/password/i);
        const emailInput = screen.getByLabelText(/email/i);

        fireEvent.change(passwordInput, { target: { value: 'duplicate@gmail.com' } });
        fireEvent.change(emailInput, { target: { value: 'testpass' } });

        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '124' } });
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            //expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error), 'Server Error')
        });
    })

});