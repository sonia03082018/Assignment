import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from '../main/frontend/login/login';
import Register from '../main/frontend/login/register';
import MainPage from '../pages/MainPage';
import CreateEmployee from "./CreateEmployee";
import UpdateEmployee from "./UpdateEmployee";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/main' element={<MainPage/>} />
        <Route path='/add' element={<CreateEmployee/>} />
        <Route path="/edit/:id" element= {<UpdateEmployee />} />
      </Routes>
    </BrowserRouter> 
  );  
}

export default App;