import { createAsyncThunk } from "@reduxjs/toolkit";
import { addEmployee, deleteEmployee, getEmployeeById, getEmployees, updateEmployee } from "../../../api/employeeApi";
import { IEmployee } from "../employeeTypes";

export const fetchAllEmployees = createAsyncThunk('employees/fetchAll',
    async ({ page, limit, searchQuery}: {page: number, limit: number; searchQuery: string}) => {
        const response = await getEmployees(page, limit, searchQuery);
        return response.data;
    }
)

export const createEmployee = createAsyncThunk('employees/create',
    async (employee: IEmployee) => {
        const response = await addEmployee(employee);
        return response.data;
    }
)

export const removeEmployee = createAsyncThunk('employees/delete',
    async (id: string) => {
        const response = await deleteEmployee(id);
        return response.data;
    }
)

export const editEmployee = createAsyncThunk('employees/update',
    async ({id, employee}: {id:string; employee: IEmployee}) => {
        const response = await updateEmployee(id, employee);
        return response.data;
    }
)

export const fetchEmployeeById = createAsyncThunk('employees/employee',
    async (id:string) => {
        const response = await getEmployeeById(id);
        return response.data;
    }
)