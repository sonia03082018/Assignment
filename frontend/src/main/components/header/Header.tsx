
import { AppDispatch, RootState } from 'main/redux/store';
import { userLogout } from 'main/redux/users';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user.user)

    const handleLogout = async () => {
        try {
            const response = await dispatch(userLogout())
            if (userLogout.fulfilled.match(response)) {
                navigate("/")
            }
        } catch (error) {
            console.log(error, `Server Error`)
        }
    }

    return (
        <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
            <div className='flex items-center gap-4 ml-auto'>

                <>
                    {user && (<span className="text-sm">Welcome, <strong>{user.username}</strong></span>
                    )}
                    <button className="bg-white text-blue-600 px-3 py-1 rounded " onClick={handleLogout}> Logout</button>
                </>
            </div>
        </header>
    )
}

export default Header