export interface IEmployee {
    _id: string;
    name: string;
    email: string;
    designation: string;
    salary: number;
}

export interface EmployeeState {
    employees: IEmployee[];
    loading: boolean;
    error: string | null;
    success?: string | null;
    selectedEmployee?:  null;
    totalPages: number;
}