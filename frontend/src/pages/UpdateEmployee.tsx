import EditEmployee from "main/components/employees/EditEmployee";
import Header from "main/components/header/Header";

const UpdateEmployee = () => { 
    return (
        <>
            <div className="flex min-h-full flex-col justify-center ">
                <Header/>
                <EditEmployee/>
            </div>
        </>

    )
}
export default UpdateEmployee;