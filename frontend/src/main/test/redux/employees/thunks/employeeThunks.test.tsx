import * as employeeApi from "main/api/employeeApi";
import { createEmployee, editEmployee, fetchAllEmployees, fetchEmployeeById, removeEmployee } from "main/redux/employees";


jest.mock('main/api/employeeApi', () => ({
    getEmployees: jest.fn(),
    addEmployee: jest.fn(),
    updateEmployee: jest.fn(),
    deleteEmployee: jest.fn(),
    getEmployeeById: jest.fn()
}));

const mockedGetEmployees = employeeApi.getEmployees as jest.Mock;
const mockedAddEmployee = employeeApi.addEmployee as jest.Mock;
const mockedUpdateEmployee = employeeApi.updateEmployee as jest.Mock;
const mockedGetEmployeeById = employeeApi.getEmployeeById as jest.Mock;
const mockedRemoveEmployee = employeeApi.deleteEmployee as jest.Mock;

describe('EmployeeThunks', () => {

    const dispatch = jest.fn();
    const getState = jest.fn();
    const extra = undefined;

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should fetch all employees', async () => {
        const employees = [{ id: '1', name: 'test', email: 'test@gmail.com', designation: 'QA', salary: 12000 }];
        mockedGetEmployees.mockResolvedValueOnce({ data: employees })

        const result = await fetchAllEmployees({ page: 1, limit: 10, searchQuery: '' })(dispatch, getState, {})
        expect(mockedGetEmployees).toHaveBeenCalledWith(1, 10, "");
        expect(result.payload).toEqual(employees);
        expect(result.type).toBe('employees/fetchAll/fulfilled');
    });

    it('should create an employee', async () => {
        const newEmployee = { _id: '1', name: 'test', email: 'test@gmail.com', designation: 'QA', salary: 12000 };

        mockedAddEmployee.mockResolvedValueOnce({ data: newEmployee })
        const result = await createEmployee(newEmployee)(dispatch, getState, {})
        expect(mockedAddEmployee).toHaveBeenCalledWith(newEmployee);
        expect(result.payload).toEqual(newEmployee);
        expect(result.type).toBe('employees/create/fulfilled');
    });
    it('should delete an employee', async () => {

        mockedRemoveEmployee.mockResolvedValueOnce({ data: { success: true } })
        const result = await removeEmployee('2')(dispatch, getState, {})
        expect(mockedRemoveEmployee).toHaveBeenCalledWith('2');
        expect(result.payload).toEqual({ success: true });
        expect(result.type).toBe('employees/delete/fulfilled');
    });
    it('should fetch employee by id', async () => {
        const employee = { _id: '4', name: 'testing', email: 'testing@gmail.com', designation: 'QA', salary: 12000 };

        mockedGetEmployeeById.mockResolvedValueOnce({ data: employee })
        const result = await fetchEmployeeById('4')(dispatch, getState, {})
        expect(mockedGetEmployeeById).toHaveBeenCalledWith('4');
        expect(result.payload).toEqual(employee);
        expect(result.type).toBe('employees/employee/fulfilled');
    });

    it('should update employee', async () => {
        const id: any = 3;
        const update: any = { name: 'testing', email: 'testing@gmail.com', designation: 'QA', salary: 12000 };
        const updateEmployee = { id, ...update }

        mockedUpdateEmployee.mockResolvedValueOnce({ data: updateEmployee })
        const result = await editEmployee({ id, employee: updateEmployee })(dispatch, getState, {})
        expect(mockedUpdateEmployee).toHaveBeenCalledWith(id, updateEmployee);
        expect(result.payload).toEqual(updateEmployee);
        expect(result.type).toBe('employees/update/fulfilled');
    });

});