import { Provider } from 'react-redux';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as thunks from 'main/redux/employees/thunks/employeeThunks';
import { employeeReducer } from 'main/redux/employees';
import { configureStore } from '@reduxjs/toolkit';
import EditEmployee from 'main/components/employees/EditEmployee';

jest.mock('main/redux/employees/thunks/employeeThunks');

const mockedFetchEmployeeById = thunks.fetchEmployeeById as unknown as jest.Mock;
const mockedEditEmployee = thunks.editEmployee as unknown as jest.Mock;

const mockEmployee = {
    id: '1',
    name: 'John',
    designation: 'QA',
    email: 'test@gmail.com',
    salary: 10000
}

describe('Edit Employee Component', () => {

    const renderComponent = (initialState: {} = {
        employees: {
            employees: [],
            loading: false,
            error: null,
            success: '',
            selectedEmployee: mockEmployee,
        },

    }) => {
        const store = configureStore({
            reducer: {
                employees: employeeReducer,
            },
            preloadedState: { ...initialState },
            middleware: (getDefaultMiddleware: any) =>
                getDefaultMiddleware({ thunk: true, serializableCheck: false }),
        });

        //console.log(initialState);
        return render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/edit/1']}>
                    <Routes>
                        <Route path="/edit/:id/" element={<EditEmployee />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        )
    }
    describe('Edit employee component', () => {
        beforeEach(() => {
            mockedFetchEmployeeById.mockImplementation((id: string) => async (dispatch: any) => {
                dispatch({ type: 'employees/fetchEmployeeById/fulfilled', payload: mockEmployee });
            });
            mockedEditEmployee.mockImplementation((id: string, employee: any) => async (dispatch: any) => {
                dispatch({ type: 'employees/editEmployee/fulfilled', payload: employee });
                return { type: 'employees/editEmployee/fulfilled', payload: employee };
            })
        })
        afterEach(() => {
            jest.clearAllMocks();
        });
        it('renders all form input fields and the button', () => {
            renderComponent();
            expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/designation/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/salary/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
        });

        it('renders employee data and updates it on submit', async () => {
            renderComponent({
                employees: {
                    employees: [],
                    loading: false,
                    error: null,
                    success: '',
                    selectedEmployee: mockEmployee,
                }
            });
            await waitFor(() => {
                expect(screen.getByLabelText(/name/i)).toHaveValue(mockEmployee.name);
                expect(screen.getByLabelText(/designation/i)).toHaveValue(mockEmployee.designation);
            });

            const nameInput = screen.getByLabelText(/name/i);
            const salaryInput = screen.getByLabelText(/salary/i);

            fireEvent.change(nameInput, { target: { value: 'updated name' } });
            fireEvent.change(salaryInput, { target: { value: '12000' } });

            const submitButton = screen.getByRole('button', { name: /Save/i });
            fireEvent.click(submitButton);


            await waitFor(() => {
                expect(mockedEditEmployee).toHaveBeenCalledWith({
                    employee: {
                        id: '1',
                        name: 'updated name',
                        email: 'test@gmail.com',
                        designation: 'QA',
                        salary: '12000'
                    },
                    id: '1'
                })

                expect(mockedEditEmployee).toHaveBeenCalledTimes(1);
            })
        })
    });
    it("Log error if edit employee fails", async () => {
        const formData = {
            name: 'Test',
            email: 'test@example.com',
            designation: 'QA',
            salary: 50000
        };
        mockedEditEmployee.mockImplementation((id: string) => async (dispatch: any) => {
            dispatch({ type: 'users/editEmployee/rejected', error: { message: 'Server error' } });
            return { type: 'users/editEmployee/rejected', error: { message: 'Server error' } }
        });

        renderComponent();

        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: formData.name } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: formData.email } });
        fireEvent.change(screen.getByLabelText(/designation/i), { target: { value: formData.designation } });
        fireEvent.change(screen.getByLabelText(/salary/i), { target: { value: formData.salary } });

        const submitButton = screen.getByRole('button', { name: /save/i });

        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(mockedEditEmployee).toHaveBeenCalledWith({
                employee: {
                    name: 'Test',
                    email: 'test@example.com',
                    designation: 'QA',
                    salary: "50000",
                    id: '1'
                },
                id: '1'
            });
            expect(mockedEditEmployee).toHaveBeenCalledTimes(1);
        });
    })


})






