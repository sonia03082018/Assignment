import axios  from "axios";
import Iuser from "../models/User";
const BASE_URL = 'http://localhost:5000/users';

export const addUser =  async(user: Iuser) => {
    return await axios.post(`${BASE_URL}/add-user/`, user, {
        withCredentials: true
    });
}

export const login =  async(user: Iuser) => {
    return await axios.post(`${BASE_URL}/login/`, user, {
        withCredentials: true
    });
}

export const logout =  async() => {
    return await axios.post(`${BASE_URL}/logout/`, {}, {
        withCredentials: true
    });
}