import Header from 'main/frontend/header/header';
import EditEmployee from 'main/frontend/editEmployee/EditEmployee';
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