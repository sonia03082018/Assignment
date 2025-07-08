import { createAsyncThunk } from "@reduxjs/toolkit";
import { addEmployee, deleteEmployee, getEmployeeById, getEmployees, updateEmployee } from "../../../api/employeeApi";
import { FetchAllEmployeesParams, IEmployee } from "../employeeTypes";

export const fetchAllEmployees = createAsyncThunk('employees/fetchAll',
    async ({ page, limit, searchQuery }: FetchAllEmployeesParams, thunkAPI) => {
        try {
            const response = await getEmployees(page, limit, searchQuery);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data.message || 'Failed to fetchAll employees');
        }
    }
)

export const createEmployee = createAsyncThunk('employees/create',
    async (employee: IEmployee, thunkAPI) => {
        try {
            const response = await addEmployee(employee);     
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data.message || 'Failed to create employee');
        }
    }
)

export const removeEmployee = createAsyncThunk('employees/delete',
    async (id: string, thunkAPI) => {
        try {
            const response = await deleteEmployee(id);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data.message || 'Failed to delete employee');
        }
    }
)

export const editEmployee = createAsyncThunk('employees/update',
    async ({ id, employee }: { id: string; employee: IEmployee }, thunkAPI) => {
        try {
            const response = await updateEmployee(id, employee);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data.message || 'Failed to update employee');
        }
    }
)

export const fetchEmployeeById = createAsyncThunk('employees/employee',
    async (id: string, thunkAPI) => {
        try {
            const response = await getEmployeeById(id);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data.message || 'Failed to fetch employeeById');
        }
    }
)