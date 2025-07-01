
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { AppDispatch, RootState } from "main/redux/store";
import { resetUserStatus } from "main/redux/users/reducers/userSlice";
import { userLogin } from "main/redux/users";
import IUser from "main/models/User";

const CreateLogin = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IUser>()

    const navigate = useNavigate();

    const dispatch = useDispatch<AppDispatch>();
    const { loading,  error, success } = useSelector((state: RootState) => state.user)

    useEffect(() => {
        dispatch(resetUserStatus());
    }, [dispatch])

    const handleSubmitCall = async (user: IUser) => {
        const encodedPassword = btoa(user.password);
        const Userpayload = {
            ...user,
            password: encodedPassword
        }

        try {
            const response = await dispatch(userLogin(Userpayload))
            if (userLogin.fulfilled.match(response)) {
                navigate("/main")
            }
        } catch (error) {
            console.log(error, `Server Error`)
        }
    }


    { loading && <Loader /> }
    return (
        <>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>

                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div>
                        {error && (
                            <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 p-4 bg-green-100 text-green-700 border border-red-300 rounded">
                                {success}
                            </div>
                        )}
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit(handleSubmitCall)}>
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
                            <div className="mt-2">
                                <input type="email"
                                    id="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Invalid email address",
                                        }
                                    })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                {errors.email && (
                                    <div className="text-red-500 text-xs italic">{errors.email.message?.toString()}</div>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>

                            </div>
                            <div className="mt-2">
                                <input type="password"
                                    id="password"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be atleast 6 characters"
                                        },
                                    })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                {errors.password && (
                                    <div className="text-red-500 text-xs italic">{errors?.password.message?.toString()}</div>
                                )}
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create Account</button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Not a member?
                        <Link to={`/register`} className="font-semibold text-indigo-600 hover:text-indigo-500">Sign up </Link>
                    </p>
                </div>
            </div>

        </>
    )
}
export default CreateLogin