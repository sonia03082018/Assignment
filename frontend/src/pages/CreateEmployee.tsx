import AddEmployee from "main/components/employees/AddEmployee"
import Header from "main/components/header/Header"

const CreateEmployee = () => { 
    return (
        <>
            <div className="flex min-h-full flex-col justify-cente">
                <Header/>
                <AddEmployee/>
            </div>
        </>

    )
}
export default CreateEmployee