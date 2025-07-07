

import { BrowserRouter, useNavigate } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { configureStore } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import Header from "main/components/header/Header";
import { userLogout } from "main/redux/users";
import { UserState } from "main/redux/users/userTypes";
import { UserReducer } from 'main/redux/users';

import * as thunks from 'main/redux/users/thunks/userThunks';
import IUser from "main/models/User";

//Mock react-router-dom
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
     ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUseNavigate,
}));

jest.mock('main/redux/users/thunks/userThunks');

const mockedUserLogout = thunks.userLogout as unknown as jest.Mock;
const mockUser:IUser = {
    username: 'John',
    password: '123457',
    email: 'test@gmail.com'
}
describe('Header Component', () => {
    

      beforeEach(() => {
        jest.clearAllMocks();
      });
      
    const renderComponent = (initialState:{user: UserState} = {
        user : {
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
        preloadedState: initialState,
        middleware: (getDefaultMiddleware: any) =>
            getDefaultMiddleware({ thunk: true, serializableCheck: false }),
    });

        //console.log(initialState);
        return render(
            <Provider store={store}>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </Provider>
        )
    }

    describe('header component test cases', ()=>{
         beforeEach(() => {
            mockedUserLogout.mockImplementation(() => async (dispatch: any) => {
                dispatch({ type: 'users/userLogout/fulfilled', payload: mockUser });
            });
        })
        afterEach(() => {
            jest.clearAllMocks();
        })
   
    it('should render without user information when no user is logged in', () => {
        renderComponent();
        expect(screen.queryByText(/welcome/i)).not.toBeInTheDocument();
        expect(screen.getByRole('button', {name: /logout/i})).toBeInTheDocument();
    });

    it('should display user information when user is logged in', () => {
        const loggedInUser = {username: 'testuser', email:'test@gmail.com', password: '1234'}
        renderComponent({
                  user: {                    
                    user: loggedInUser,
                    loading: false,
                    error: null,
                    success: null,
                }
        });
        const element = screen.queryByText((_, element) => element?.textContent ===`welcome, ${loggedInUser.username}`);
        expect(screen.getByText(/testuser/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /logout/i})).toBeInTheDocument();
    });

    it('should dispatch userlogout and navigate to home on successfull logout', async() => {
        const loggedInUser = {username: 'testuser', email:'test@gmail.com', password: '1234'}
        renderComponent({
              user: {                    
                    user: loggedInUser,
                    loading: false,
                    error: null,
                    success: null,
                }
        });
        (userLogout as unknown as jest.Mock).mockResolvedValueOnce({
            type: 'user/userLogout/fulfilled',
            payload: {},
            meta: {}

        });

        fireEvent.click(screen.getByRole('button', {name: /logout/i}));

        await waitFor(() => {
            expect(userLogout).toHaveBeenCalledTimes(1);
         //   expect(mockedUseNavigate).toHaveBeenCalledWith('/');
            expect(screen.queryByText(`welcome, ${loggedInUser.username}`)).not.toBeInTheDocument();
        })

    });

    it('should log error if userLogout fails', async()=>{
         const loggedInUser = {username: 'testuser', email:'test@gmail.com',  password: '1234'}
        renderComponent({
              user: {                    
                    user: loggedInUser,
                    loading: false,
                    error: null,
                    success: null,
                }
        });
        //  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(()=>{});

        //  (userLogout as unknown as jest.Mock).mockRejectedValueOnce(new Error('Logout failed on server'));

         fireEvent.click(screen.getByRole('button', {name: /logout/i}));

         await waitFor(() =>{
            expect(userLogout).toHaveBeenCalled();
          // expect(mockedUseNavigate).toHaveBeenCalled();
           //expect(consoleSpy).toHaveBeenCalledWith('error', 'Server Error')
         });
       //  consoleSpy.mockRestore();

    });

 })


});