//Mock useForm from react-hook-form
jest.mock('react-hook-form', () => ({
    useForm: jest.fn()
}));

//Mock react-reux hooks
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn()
}));


import { Provider, useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { resetEmployeeStatus } from 'main/redux/employees/reducers/employeeSlice';
import { BrowserRouter } from 'react-router-dom';
import * as thunks from 'main/redux/employees/thunks/employeeThunks';
import { employeeReducer } from 'main/redux/employees';
import { configureStore } from '@reduxjs/toolkit';
import IEmployee from 'main/models/Employee';
import AddEmployee from 'main/components/employees/AddEmployee';

jest.mock('main/redux/employees/thunks/employeeThunks');

const mockedAddEmployee = thunks.createEmployee as unknown as jest.Mock;

describe('AddEmployee Component', () => {

    const store = configureStore({
        reducer: {
            employees: employeeReducer,
        },
        middleware: (getDefaultMiddleware: any) =>
            getDefaultMiddleware({ thunk: true, serializableCheck: false }),
    });


    const mockDispatch = jest.fn();
    const mockReset = jest.fn();

    beforeEach(() => {

        jest.clearAllMocks();

        (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
        (useSelector as unknown as jest.Mock).mockImplementation((selectorFn: any) =>
            selectorFn({
                employees: {
                    loading: false,
                    error: null,
                    success: false,
                    employees: []
                }
            })
        );

        (useForm as jest.Mock).mockReturnValue({
            register: jest.fn(),
            handleSubmit: (cb: any) => (e: any) => {
                e.preventDefault();
                cb({
                    name: 'Test',
                    email: 'test@example.com',
                    designation: 'QA',
                    salary: 50000
                });
            },
            formState: {
                errors: {},
            },
            reset: mockReset,
        });


    });

    const renderComponent = () => {
        return render(
            <Provider store={store}>
                <BrowserRouter>
                    <AddEmployee />
                </BrowserRouter>
            </Provider>
        )
    }

    describe('Add Employee test cases', () => {

        afterEach(() => {
            jest.clearAllMocks();
        })

        it('renders all form input fields and the button', () => {
            renderComponent();
            expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/designation/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/salary/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Create An Employee/i })).toBeInTheDocument();
        });

        it('it calls createEmployee on form submit', async () => {
            const formData = {
                name: 'Test',
                email: 'test@example.com',
                designation: 'QA',
                salary: 50000
            };
            mockedAddEmployee.mockImplementation((employee: IEmployee) => async (dispatch: any) => {
                dispatch({ type: 'employees/createEmployee/fulfilled', payload: employee });
                return { type: 'employees/createEmployee/fulfilled', payload: employee }
            });

            renderComponent();

            fireEvent.change(screen.getByLabelText(/name/i), { target: { value: formData.name } });
            fireEvent.change(screen.getByLabelText(/email/i), { target: { value: formData.email } });
            fireEvent.change(screen.getByLabelText(/designation/i), { target: { value: formData.designation } });
            fireEvent.change(screen.getByLabelText(/salary/i), { target: { value: formData.salary } });


            const submitButton = screen.getByRole('button', { name: /create an employee/i });

            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(mockedAddEmployee).toHaveBeenCalledWith({
                    name: 'Test',
                    email: 'test@example.com',
                    designation: 'QA',
                    salary: 50000
                });
                expect(mockedAddEmployee).toHaveBeenCalledTimes(1);
            });

        });

        it("Log error if registration fails", async () => {
            const formData = {
                name: 'Test',
                email: 'test@example.com',
                designation: 'QA',
                salary: 50000
            };
            mockedAddEmployee.mockImplementation((employee: IEmployee) => async (dispatch: any) => {
                dispatch({ type: 'users/createEmployee/rejected', error: { message: 'Server error' } });
                return { type: 'users/createEmployee/rejected', error: { message: 'Server error' } }
            });

            renderComponent();

            fireEvent.change(screen.getByLabelText(/name/i), { target: { value: formData.name } });
            fireEvent.change(screen.getByLabelText(/email/i), { target: { value: formData.email } });
            fireEvent.change(screen.getByLabelText(/designation/i), { target: { value: formData.designation } });
            fireEvent.change(screen.getByLabelText(/salary/i), { target: { value: formData.salary } });

            const submitButton = screen.getByRole('button', { name: /create an employee/i });

            fireEvent.click(submitButton);
            await waitFor(() => {
                expect(mockedAddEmployee).toHaveBeenCalledWith({
                    name: 'Test',
                    email: 'test@example.com',
                    designation: 'QA',
                    salary: 50000
                });
                expect(mockedAddEmployee).toHaveBeenCalledTimes(1);
            });
        })



        it('displays success message when success is true', () => {
            (useSelector as unknown as jest.Mock).mockImplementation((selector: any) =>
                selector({
                    employees: {
                        loading: false,
                        error: null,
                        success: 'employee created successfully',
                    }
                })
            );

            renderComponent();
            expect(screen.getByText(/employee created successfully/i)).toBeInTheDocument();
        });

        it('displays error message when error exist', () => {
            (useSelector as unknown as jest.Mock).mockImplementation((selectorFn: any) =>
                selectorFn({
                    employees: {
                        loading: false,
                        error: 'Server error',
                        success: false,
                    }
                })
            );

            renderComponent();
            expect(screen.getByText(/Server error/i)).toBeInTheDocument();
        });

        it('it calls resetEmployeeStatus on mount', () => {
            renderComponent();
            expect(mockDispatch).toHaveBeenCalledWith(resetEmployeeStatus());
        });

        it('it shows validateion error if name is missing ', async () => {
            renderComponent();
            (useForm as jest.Mock).mockReturnValue({
                register: jest.fn(),
                handleSubmit: (cb: any) => () =>
                    cb({}),
                formState: {
                    errors: {
                        name: { message: 'Name is required' },
                        designation: { message: 'Designation is required' },
                        email: { message: 'Email is required' }
                    },
                },
                reset: mockReset,
            });
            renderComponent();
            expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Designation is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
        })

    })



})
