import axios  from "axios";
import IEmployee from "../models/Employee";
const BASE_URL = 'http://localhost:5000/employees';
export const getEmployees = async (page: number, limit: number, searchQuery?:string) =>{
    const params:any = {page,limit};
    if(searchQuery?.trim()){
        params.search = searchQuery.trim();
    }
    return await axios.get(`${BASE_URL}/allemployees`, {
        params,
        withCredentials: true
    })
};

export const deleteEmployee =  async(id:string) => {
    return await axios.delete(`${BASE_URL}/delete/${id}`, {
        withCredentials: true
    });
}

export const addEmployee =  async(employee: IEmployee) => {
    return await axios.post(`${BASE_URL}/add-emp/`, employee, {
        withCredentials: true
    });
}

export const getEmployeeById =  async(id: string) => {
    return await axios.get(`${BASE_URL}/employee/${id}`,  {
        withCredentials: true
    });
}

export const updateEmployee =  async(id: string, employee: IEmployee) => {
    return await axios.put(`${BASE_URL}/update/${id}`, employee, {
        withCredentials: true
    });
}