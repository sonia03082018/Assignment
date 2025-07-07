import '@testing-library/jest-dom';
import axios from "axios";
import { addEmployee, deleteEmployee, getEmployeeById, getEmployees, updateEmployee } from "main/api/employeeApi";
import IEmployee from 'main/models/Employee';


jest.mock('axios');
const mockedAxios = axios as unknown as jest.Mocked<typeof axios>;

describe('Employee Api', () => {

    it('should fetch employees with page and limit', async () => {
        const mockEmployees ={employees: [{ _id:'123', name: 'test', email: 'test@gmail.com', designation: 'QA', salary: 12000 }, { _id:'123', name: 'test', email: 'test@gmail.com', designation: 'QA', salary: 12000 }]};
        mockedAxios.get.mockResolvedValueOnce(mockEmployees);
        const params = {page:1, limit:10}
        const result = await getEmployees(1, 5);
          expect(mockedAxios.get).toHaveBeenCalledWith(
            'http://localhost:5000/employees/allemployees',  {
                params:{page:1, limit:5}, 
                withCredentials: true,
            });
        expect(result).toEqual(mockEmployees);
    });

    it('should add a new employee', async () => {
        const newEmployee:IEmployee = { _id:'123', name: 'test', email: 'test@gmail.com', designation: 'QA', salary: 12000 };
        mockedAxios.post.mockResolvedValueOnce(newEmployee);

        const result = await addEmployee(newEmployee);

        expect(mockedAxios.post).toHaveBeenCalledWith(
            'http://localhost:5000/employees/add-emp/', newEmployee, {
                withCredentials: true,
            });
        expect(result).toEqual(newEmployee);
    });

    it('should fetch employee by ID', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: { id: '123', name: 'test' } });

        const result = await getEmployeeById('123');

        expect(mockedAxios.get).toHaveBeenCalledWith(
            'http://localhost:5000/employees/employee/123',
            {
                withCredentials: true,
            }
        );
        expect(result).toEqual({ data: { id: '123', name: 'test' } });
    });

    it('should update an employee', async () => {
        const updatedEmployee:IEmployee = { _id:'123', name: 'testing', email: 'testing@gmail.com',  designation: 'QA', salary: 12000};
        mockedAxios.put.mockResolvedValueOnce(updatedEmployee);

        const result = await updateEmployee('123', updatedEmployee);

        expect(mockedAxios.put).toHaveBeenCalledWith(
            'http://localhost:5000/employees/update/123',
           
                updatedEmployee, {
                withCredentials: true,
            }
        );
        expect(result).toEqual(updatedEmployee);
    });

    it('should delete an employee', async () => {
        mockedAxios.delete.mockResolvedValueOnce({ data: 'deleted' });

        const result = await deleteEmployee('123');

        expect(mockedAxios.delete).toHaveBeenCalledWith(
            'http://localhost:5000/employees/delete/123',
            {
                withCredentials: true,
            }
        );
        expect(result).toEqual({ data: 'deleted' });
    });




});