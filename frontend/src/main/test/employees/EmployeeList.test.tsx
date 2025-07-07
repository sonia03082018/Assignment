
import { BrowserRouter, useNavigate } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { configureStore } from "@reduxjs/toolkit";
import { employeeReducer } from "main/redux/employees";
import { EmployeeState } from "main/redux/employees/employeeTypes";
import { Provider } from "react-redux";
import EmployeeList from "main/components/employees/EmployeeList";
import * as thunks from 'main/redux/employees/thunks/employeeThunks';

jest.mock('main/redux/employees/thunks/employeeThunks');

const mockedFetchAllEmployees = thunks.fetchAllEmployees as unknown as jest.Mock;

const mockEmployees = [{ _id: '1', name: 'John', email: 'john@gmail.com', designation: 'QA', salary: 12000 }, { _id: '2', name: 'test', email: 'test@gmail.com', designation: 'QA', salary: 22000 }];

describe('Employees list Component', () => {


    const renderComponent = (initialState: { employees: EmployeeState } = {
        employees: {
            employees: mockEmployees,
            loading: false,
            error: null,
            success: null,
            selectedEmployee: null,
            totalPages: 1
        },

    }) => {
        const store = configureStore({
            reducer: {
                employees: employeeReducer,
            },
            preloadedState: initialState,
            middleware: (getDefaultMiddleware: any) =>
                getDefaultMiddleware({ thunk: true, serializableCheck: false }),
        });

        //console.log(initialState);
        return render(
            <Provider store={store}>
                <BrowserRouter>
                    <EmployeeList />
                </BrowserRouter>
            </Provider>
        )
    }

    describe('Employe list component', () => {
        beforeEach(() => {
            mockedFetchAllEmployees.mockImplementation(() => async (dispatch: any) => {
                dispatch({
                    type: 'employees/getEmployees/fulfilled',
                    payload: { employees: mockEmployees, total: 1 },
                })
            })
        });
        afterEach(() => {
            jest.clearAllMocks();
        })
        it("renders employee rows in the table", async () => {
            renderComponent();

            await waitFor(() => {
                expect(screen.getByText('John')).toBeInTheDocument();
                expect(screen.getByText('test@gmail.com')).toBeInTheDocument();
            });
            const rows = screen.getAllByRole('row');
            expect(rows.length).toBe(mockEmployees.length + 1);
        });
        it("it dispatches fetchAllemployees on mount", async () => {
            renderComponent();
            await waitFor(() => {
                expect(screen.getByText('John')).toBeInTheDocument();
            })
            expect(mockedFetchAllEmployees).toHaveBeenCalled();

        });
        it('filters employee using the search input fields', async () => {
            renderComponent();

            const searchInput = screen.getByPlaceholderText(/Search by name or designation/i);
            fireEvent.change(searchInput, { target: { value: 'test' } });

            await waitFor(() => {
                expect(screen.getByText('John')).toBeInTheDocument();
            })

        });
        // it('shows error message if error exist', () =>{
        //     renderComponent({
        //         employees: {
        //             employees:[],
        //             loading: false,
        //             error:'failed to load employees',
        //             totalPages: 1
        //         }
        //     })
        //     expect(screen.getByText(/failed to load employees/i)).toBeInTheDocument();
        // })

    });



});    