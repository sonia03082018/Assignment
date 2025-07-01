import  { useEffect } from "react";
import {  Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Loader from "../loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { resetEmployeeStatus } from "main/redux/employees/reducers/employeeSlice";
import { AppDispatch, RootState } from "main/redux/store";
import { editEmployee, fetchEmployeeById } from "main/redux/employees";
import IEmployee from "main/models/Employee";


const EditEmployee = () => {
    const { id } = useParams<{id: string}>();
    const {
            register,
            handleSubmit,
            reset,
            formState: { errors },
        } = useForm<IEmployee>({
            defaultValues:{
                name: '',
                email: '',
                designation: '',
                salary: 0
            }
        })
    
    const designations = ['Developer', 'Manager', 'Designer', 'QA'];

    const dispatch = useDispatch<AppDispatch>();
    const {loading, error, success, selectedEmployee} = useSelector((state: RootState) => state.employees)
    
    useEffect(() => {
            dispatch(resetEmployeeStatus());
        }, [dispatch])
         

    useEffect(() => {
       if(id) {
        dispatch (fetchEmployeeById(id))
       }
    },[id, dispatch]);

     useEffect(() => {
       if(selectedEmployee) {
        reset(selectedEmployee)
       }
    },[selectedEmployee, reset]);
   

    const handleSubmitCall = async( employee: IEmployee) => {
        try {            
            if(!id) throw new Error("Invalid id")
           const response = await dispatch(editEmployee({id, employee}));
            if(editEmployee.fulfilled.match(response)) {
               console.log("Employee updated successfully")
           }
        }catch(error){
            console.log(error, `Server Error`)   
        } 
    }
    

    {loading && <Loader/>}
    return (
        <>
            <div className="flex min-h-full flex-col justify-center px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Edit Employee</h2>
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit(handleSubmitCall)}>
                           <div>
                            {error && (
                            <div className={`mb-4 rounded p-4  bg-red-100 text-red-700 border border-red-300 `}>
                                {error}
                            </div>
                            )}
                            {success && (
                            <div className={`mb-4 rounded p-4  bg-green-100 text-green-700 border border-green-300 `}>
                                {success}
                            </div>
                            )}
                            </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Name">
                                Name
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="name"
                                type="text"
                                placeholder="Name"
                                {...register("name", {
                                    required: "Name is required",
                                    minLength: {
                                        value: 3,
                                        message: "Name must be atleast 3 characters",
                                    },
                                })} />
                            {errors.name && (
                                <div className="text-red-500 text-xs italic">{errors.name.message?.toString()}</div>
                            )}
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Email
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                placeholder="Email"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Invalid email address",
                                    }
                                })} />
                             {errors.email && (
                                <div className="text-red-500 text-xs italic">{errors.email.message?.toString()}</div>
                            )}
                        </div>

                        <div className="w-full  mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="designation">
                                Designation
                            </label>
                            <div className="relative">
                                <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" 
                                
                                 {...register("designation", {
                                        required: "Designation is required"
                                    })}>
                                    <option value="">--Select--</option>
                                    {designations.map((designation: string, i: number) => (
                                        <option key={i} value={designation}>{designation}</option>
                                    ))}

                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                                 {errors.designation && <div className="text-red-500 text-xs italic">{errors.designation.message?.toString()}</div>}
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Salary
                            </label>
                            <input className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="salary"
                                placeholder="salary"
                                type="text"
                                {...register("salary", {
                                    required: "Salary is required",
                                    min: {
                                        value: 10000,
                                        message: "Minimum salary is 10000"
                                    },
                                    max: {
                                        value: 100000,
                                        message: "Maximum salary is 100000"
                                    },
                                    validate: (value: number) => value > 0 || `Salary must be greater than zero `
                                })}/>
                            {errors.salary && (
                                <div className="text-red-500 text-xs italic">{errors.salary.message?.toString()}</div>)
                            }
                        </div>
                        <div className="flex items-center justify-between">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                Save
                            </button>
                               <Link to="/main" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                              Back 
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>

    )

}
export default EditEmployee;