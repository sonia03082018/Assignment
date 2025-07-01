import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import AddEmployee  from '../../frontend/addEmployee/AddEmployee';
import { addEmployee } from '../../frontend/api/employeeApi';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Link: ({children}: any) => <div>{children}</div>
}))

jest.mock('../../frontend/api/employeeApi', () => {
    addEmployee: jest.fn();
})

describe('AddEmployee Component', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    });

    test('renders all form input fields ', () =>{

        render (<AddEmployee />)

        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Designation/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Salary/i)).toBeInTheDocument();
    })

    test('displays validation error for empty required fields on submit', async() => {

        render (<AddEmployee />)
        fireEvent.click(screen.getByText(/submit/i))

       expect(await screen.findByText(/name is required/i)).toBeInTheDocument()

    })

    test('displays  validation  error for invalid email format', async ()=>{
         render (<AddEmployee/>)
        fireEvent.click(screen.getByText(/submit/i))

       expect(await screen.findByText(/email is required/i)).toBeInTheDocument()

    })

    test('displays  validation  error for negative salary', async ()=>{
         render (<AddEmployee/>)
        fireEvent.click(screen.getByText(/submit/i))

        expect(await screen.findByText(/Salary cannot be negative/i)).toBeInTheDocument();

    })

    test('handle successfull creation and displays successfull message', async ()=>{
        (addEmployee as jest.Mock).mockResolvedValue({status: 201});

         render (<AddEmployee/>)
         fireEvent.input(screen.getByLabelText(/name/i),{
            target: {value: 'test'}
         });
         fireEvent.input(screen.getByLabelText(/email/i),{
            target: {value: 'test@gmail.com'}
         });
         fireEvent.input(screen.getByLabelText(/designation/i),{
            target: {value: 'QA'}
         });
         fireEvent.input(screen.getByLabelText(/salary/i),{
            target: {value: '5000'}
         })

        fireEvent.click(screen.getByText(/submit/i))


        await waitFor(()=>{
            expect(screen.getByText(/Employee created successfully/i)).toBeInTheDocument();
        })

        expect(addEmployee).toHaveBeenCalledWith({
            name: 'test',
            email: 'test@gmail.com',
            designation: 'QA',
            salary: 5000
        })

        
    });

        test('shows error message on failed api', async ()=>{
        (addEmployee as jest.Mock).mockRejectedValue({ response : {status: 400 }});

         render (<AddEmployee/>)
         fireEvent.input(screen.getByLabelText(/name/i),{
            target: {value: 'test1'}
         });
         fireEvent.input(screen.getByLabelText(/email/i),{
            target: {value: 'test1@gmail.com'}
         });
         fireEvent.input(screen.getByLabelText(/designation/i),{
            target: {value: 'QA'}
         });
         fireEvent.input(screen.getByLabelText(/salary/i),{
            target: {value: '4000'}
         })

        fireEvent.click(screen.getByText(/submit/i))


        await waitFor(()=>{
            expect(screen.getByText(/server error/i)).toBeInTheDocument();
        })

        expect(addEmployee).toHaveBeenCalledWith({
            name: 'test1',
            email: 'test1@gmail.com',
            designation: 'QA',
            salary: 4000
        })

        
    });



})