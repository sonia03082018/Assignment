import Header from 'main/frontend/header/header';
import EmployeeList from '../main/frontend/employees/Employees';
const MainPage = () => { 
    return (
        <>
            <div className="flex min-h-full flex-col justify-center ">
                <Header/>
                <EmployeeList />
            </div>
        </>

    )
}
export default MainPage