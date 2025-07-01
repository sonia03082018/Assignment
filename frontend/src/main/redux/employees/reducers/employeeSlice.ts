import { createSlice } from "@reduxjs/toolkit";
import { EmployeeState, IEmployee } from "../employeeTypes";
import { createEmployee, editEmployee,  fetchAllEmployees, fetchEmployeeById, removeEmployee } from "../thunks/employeeThunks";

const initialState: EmployeeState ={
    employees: [],
    loading: false,
    error: null,
    success: null,
    selectedEmployee: null,
    totalPages: 0
}

const employeeSlice = createSlice({
    name:'employees',
    initialState,
    reducers: {
        resetEmployeeStatus: (state) => {
            state.success = null;
            state.error = null;
        }
    },
    extraReducers: (builder) =>{
        builder
        .addCase(fetchAllEmployees.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllEmployees.fulfilled, (state, action) => {
            state.loading = false;
            state.employees = action.payload.employees;
            state.totalPages = action.payload.totalPages;
        })
        .addCase(fetchAllEmployees.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch Employee';
        })
        .addCase(removeEmployee.fulfilled, (state, action) => {
            state.employees = state.employees.filter((emp:IEmployee) => emp._id !== action.payload)
        })
         .addCase(createEmployee.pending, (state) => {
           state.loading = true;
           state.error = null;
        })
         .addCase(createEmployee.fulfilled, (state, action) => {
            state.loading = false;
            state.employees.push(action.payload)
            state.success = 'Employee created successfully'
        })
        .addCase(createEmployee.rejected, (state, action) => {
            state.loading = false;
            state.error= action.payload as string || 'Employee creation Failed';
        })
        .addCase(editEmployee.pending, (state) => {
           state.loading = true;
           state.error = null;
           state.success = null;
        })
         .addCase(editEmployee.fulfilled, (state, action) => {
            const index = state.employees.findIndex((emp:IEmployee) => emp._id === action.payload._id);
            if(index !== -1) state.employees[index] = action.payload
            state.success = 'Employee updated successfully'
        })
         .addCase(editEmployee.rejected, (state, action) => {
            state.loading = false;
            state.error= action.payload as string || 'Failed to update the employee';
        })
        .addCase(fetchEmployeeById.pending, (state) => {
           state.loading = true;
           state.error = null;
           state.success = null;
        })
         .addCase(fetchEmployeeById.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedEmployee = action.payload;
        })
         .addCase(fetchEmployeeById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string || 'Employee failed to update';
        })
    }
});

export const {resetEmployeeStatus} = employeeSlice.actions

export default employeeSlice.reducer;