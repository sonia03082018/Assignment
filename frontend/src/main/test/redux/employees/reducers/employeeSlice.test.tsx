import { createEmployee, editEmployee, employeeReducer, fetchAllEmployees, fetchEmployeeById, removeEmployee } from "main/redux/employees";
import { EmployeeState } from "main/redux/employees/employeeTypes";
import IEmployee from "main/models/Employee";


describe('employeeSlice reducers', () => {
    const initialState: EmployeeState = {
        employees: [],
        loading: false,
        error: null,
        success: null,
        selectedEmployee: null,
        totalPages: 0
    }

    it('should return with initial state', () => {
        expect(employeeReducer(undefined, { type: '' })).toEqual(initialState);
    });

    it('should handle getEmployees pending', () => {
        const action = { type: fetchAllEmployees.pending.type };
        const state = employeeReducer(initialState, action);
        expect(state).toEqual({
            ...initialState,
            loading: true,
            error: null
        })
    });

    it('should handle getEmployees fulfilled', () => {
        const payload = {
            employees: [{ _id: '1', name: 'test', email: 'test@gmail.com', designation: 'QA', salary: 12000 }, { _id: '12', name: 'testuser', email: 'testing@gmail.com', designation: 'QA', salary: 12000 }], totalPages: 0,
            currentPage: 1,
            total: 1
        };
        const action = { type: fetchAllEmployees.fulfilled.type, payload };
        const state = employeeReducer(initialState, action);
        expect(state).toEqual({
            ...initialState,
            loading: false,
            employees: payload.employees,

        })
    });

    it('should handle getEmployees rejected', () => {
        const action = { type: fetchAllEmployees.rejected.type, error: { message: 'something went wrong' } };
        const state = employeeReducer(initialState, action);
        expect(state).toEqual({
            ...initialState,
            loading: false,
            error: 'something went wrong'
        })
    });


    it('should handle create Employee pending', () => {
        const action = { type: createEmployee.pending.type };
        const state = employeeReducer(initialState, action);
        expect(state).toEqual({
            ...initialState,
            loading: true,
            error: null
        })
    });

    it('should handle create Employee fulfilled', () => {
        const payload: IEmployee = { _id: '1', name: 'test', email: 'test@gmail.com', designation: 'QA', salary: 12000 };
        const action = { type: createEmployee.fulfilled.type, payload };
        const state = employeeReducer(initialState, action);
        expect(state.employees).toEqual([payload])
    });


    it('should handle create employee rejected', () => {
        const action = { type: createEmployee.rejected.type, error: { message: 'Employee creation Failed' } };
        const state = employeeReducer(initialState, action);
        expect(state).toEqual({
            ...initialState,
            loading: false,
            error: 'Employee creation Failed'
        })
    });

    it('should handle edit Employee pending', () => {
        const action = { type: editEmployee.pending.type };
        const state = employeeReducer(initialState, action);
        expect(state).toEqual({
            ...initialState,
            loading: true,
            error: null,
            success: null
        })
    });

    it('should handle edit Employee fulfilled', () => {
        const initialState: EmployeeState = {
            employees: [{ _id: '1', name: 'test', email: 'test@gmail.com', designation: 'QA', salary: 12000 }, { _id: '2', name: 'test user', email: 'tesingt@gmail.com', designation: 'QA', salary: 12000 }],
            loading: false,
            error: null,
            success: null,
            selectedEmployee: null,
            totalPages: 0
        }
        const payload: IEmployee = { _id: '1', name: 'test updated', email: 'test@gmail.com', designation: 'QA', salary: 12000 };
        const action = { type: editEmployee.fulfilled.type, payload };
        const state = employeeReducer(initialState, action);
        expect(state.employees).toContainEqual(payload);
        expect(state.employees.find(emp => emp._id === '1')?.name).toBe('test updated');
    });

    it('should handle edit employee rejected', () => {
        const action = { type: createEmployee.rejected.type, error: { message: 'Employee creation Failed' } };
        const state = employeeReducer(initialState, action);
        expect(state).toEqual({
            ...initialState,
            loading: false,
            error: 'Employee creation Failed'
        })
    });


    it('should handle fetch EmployeeById  pending', () => {
        const action = { type: fetchEmployeeById.pending.type };
        const state = employeeReducer(initialState, action);
        expect(state).toEqual({
            ...initialState,
            loading: true,
            error: null,
            success: null
        })
    });


    it('should handle fetch EmployeeById fulfilled', () => {
        const payload: IEmployee = { _id: '1', name: 'test', email: 'test@gmail.com', designation: 'QA', salary: 12000 };
        const action = { type: fetchEmployeeById.fulfilled.type, payload };
        const state = employeeReducer(initialState, action);
        expect(state.selectedEmployee).toEqual(payload);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
    });

    it('should handle fetch EmployeeById rejected', () => {
        const action = { type: fetchEmployeeById.rejected.type, error: { message: 'Employee failed to update' } };
        const state = employeeReducer(initialState, action);
        expect(state).toEqual({
            ...initialState,
            loading: false,
            error: 'Employee failed to update'
        })
    });

    it('should handle remove employee fulfilled', () => {
        const initialState: EmployeeState = {
            employees: [
                { _id: '1', name: 'test', email: 'test@gmail.com', designation: 'QA', salary: 12000 },
                { _id: '2', name: 'test user', email: 'tesingt@gmail.com', designation: 'QA', salary: 12000 }],
            loading: false,
            error: null,
            success: null,
            selectedEmployee: null,
            totalPages: 1
        };
        const action = { type: removeEmployee.fulfilled.type, payload: '1' };
        const state = employeeReducer(initialState, action);
        expect(state.employees).toEqual([{ _id: '2', name: 'test user', email: 'tesingt@gmail.com', designation: 'QA', salary: 12000 }]);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
    });


});
