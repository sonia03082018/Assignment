import { Provider } from 'react-redux';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {  MemoryRouter, Route, Routes } from 'react-router-dom';
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
            preloadedState: {...initialState},
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
        })
        it('renders employee data and updates it on submit', async () => {
            renderComponent({  employees: {
            employees: [],
            loading: false,
            error: null,
            success: '',
            selectedEmployee: mockEmployee,
        }});
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
                // expect(mockedEditEmployee).toHaveBeenCalledWith({
                //     id: '1', 
                //     employee: {
                //     name: 'updated name',
                //     email: 'test@gmail.com',
                //     designation: 'QA',
                //     salary: '12000'
                // }
                expect(mockedEditEmployee).toHaveBeenCalledTimes(1);
                })
            })
        })

        // it('shows success message when  update is successful', () =>{
        //     renderComponent({success: 'Employee updated successfully'});
        //     expect(screen.getByText(/employee updated successfully/i)).toBeInTheDocument();
        // })

        // it('shows error message when  error is preseend', () =>{
        //     renderComponent({eror: 'something went wrong'});
        //     expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
        // })


    })






