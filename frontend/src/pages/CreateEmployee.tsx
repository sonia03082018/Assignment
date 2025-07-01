import Header from 'main/frontend/header/header';
import AddEmployee from 'main/frontend/addEmployee/AddEmployee';
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