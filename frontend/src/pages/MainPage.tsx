import EmployeeList from "main/components/employees/EmployeeList"
import Header from "main/components/header/Header"

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