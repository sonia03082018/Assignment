import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../loader/Loader";
import { AppDispatch, RootState } from "main/redux/store";
import useDebounce from "main/utils/searchQuery";
import { fetchAllEmployees, removeEmployee } from "main/redux/employees";
import { resetEmployeeStatus } from "main/redux/employees/reducers/employeeSlice";
import IEmployee from "main/models/Employee";


const EmployeeList = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { employees, loading, error, totalPages } = useSelector((state: RootState) => state.employees)

    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearchQuery = useDebounce(searchQuery, 500)
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(5)

  

    useEffect(() => {
        dispatch(resetEmployeeStatus());
        dispatch(fetchAllEmployees({ page: currentPage, limit: employeesPerPage, searchQuery }))
    }, [dispatch, currentPage, debouncedSearchQuery]);


    const handleDelete = async (id: string) => {
        try {
            await dispatch(removeEmployee(id));
            console.log("Employee deleted successfully");
            dispatch(fetchAllEmployees({page: currentPage, limit:employeesPerPage, searchQuery:debouncedSearchQuery}))
        } catch (error) {
            console.log("Server error", error)
        }
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    { loading && <Loader /> }
    return (
        <>
                
                <div className="flex min-h-full flex-col justify-center px-6 lg:px-8 ">        
                <div className="flex items-center gap-4 ml-auto">
                    <Link to="/add" className="  mt-7  text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add Employee</Link>
                </div>
                <div>
                    {error && (
                        <div className="mb-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded">
                            {error}
                        </div>
                    )}
                </div>
                <table className=" mt-7 table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <caption className="caption-top text-3xl font-bold dark:text-white mb-6">
                        List of Employees
                        <input type="text"
                            placeholder="Search by name or designation"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1)
                            }}
                            className="w-70 mb-4 float-right border border-gray-300 px-4 py-2 rounded text-sm"
                        />
                    </caption>

                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Designation</th>
                            <th scope="col" className="px-6 py-3">Salary</th>
                            <th scope="col" className="px-6 py-3" colSpan={2}></th>
                        </tr>
                    </thead>

                    <tbody>
                        {employees.map((employee: IEmployee) => (
                            <tr key={employee._id}>
                                <td  className="px-6 py-3">{employee.name}</td>
                                <td className="px-6 py-3">{employee.email}</td>
                                <td className="px-6 py-3">{employee.designation}</td>
                                <td className="px-6 py-3">{employee.salary}</td>
                                <td className="px-6 py-3">
                                    <Link to={`/edit/${employee._id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline"> Edit </Link>
                                </td>
                                <td className="px-6 py-3">
                                    <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => handleDelete(employee._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>



                <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({ length: totalPages }, (_, index) =>
                        <button className={`px-3 py-1 rounded border ${currentPage === index + 1 ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover: bg-gray-100'
                            }`}
                            key={index}
                            onClick={() => paginate(index + 1)}>
                            {index + 1}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default EmployeeList;



