
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
import Register from "main/components/login/Register";

//Mock react-router-dom
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUseNavigate,
}));

jest.mock('main/redux/users/thunks/userThunks');

const mockedRegisterUserLogin = thunks.registerUser as unknown as jest.Mock;
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
                    <Register />
                </BrowserRouter>
            </Provider>
        )
    }
    beforeEach(() => {
      mockedRegisterUserLogin.mockReset();
      mockedUseNavigate.mockReset();
    })
    afterEach(() => {
        jest.clearAllMocks();
    })



    it('should render registration form', () => {
        renderComponent();
        //  screen.debug();
        expect(screen.getByText(/username/i)).toBeInTheDocument();
        expect(screen.getByText(/email address/i)).toBeInTheDocument();
        expect(screen.getByText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('should submit form and dispatch register', async () => {
  
          mockedRegisterUserLogin.mockImplementation((userData: Iuser) => async (dispatch: any) => {
            dispatch({ type: 'users/registerUser/fulfilled', payload: userData});
            return { type: 'users/registerUser/fulfilled', payload: userData} 
        });
        renderComponent();

        const nameInput = screen.getByLabelText(/username/i);
        const emailInput = screen.getByLabelText(/email/i);
        const password = screen.getByLabelText(/password/i);

        fireEvent.change(nameInput, { target: { value: 'test' } });
        fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
        fireEvent.change(password, { target: { value: '123457' } });


        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(mockedRegisterUserLogin).toHaveBeenCalledWith({
                email: 'test@gmail.com',
                username: 'test',
                password: btoa('123457')
            });
           // expect(mockedUseNavigate).toHaveBeenCalledWith('/')
        })

    });

    it("Log error if registration fails", async () => {
        mockedRegisterUserLogin.mockImplementation((user: Iuser) => async (dispatch: any) => {
            dispatch({ type: 'users/registerUser/rejected', error: {message:'Email already registered'} });
            return { type: 'users/registerUser/rejected', error: {message:'Email already registered'} } 
        });

        renderComponent();

        const nameInput = screen.getByLabelText(/username/i);
        const emailInput = screen.getByLabelText(/email/i);
        const password = screen.getByLabelText(/password/i);

        fireEvent.change(nameInput, { target: { value: 'testing' } });
        fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
        fireEvent.change(password, { target: { value: '123457' } });

        fireEvent.click(screen.getByRole('button', { name: /create account/i }));
        await waitFor(() => {
              expect(mockedRegisterUserLogin).toHaveBeenCalledWith({
                username: 'testing',
                email: 'test@gmail.com',
                password: btoa('123457')
            });
            //expect(screen.getByText(/Email already registered/i)).toBeInTheDocument();
        });
    })

});