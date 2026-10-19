
import LandingPage from "../src/components/page/LandingPage"
import { Register } from './components/page/RegisterForm';
import { Route, Routes } from 'react-router-dom';
import { LoginForm } from "./components/page/LoginForm";
// import {GuestPage } from "./components/page/GuestPage"
import { AdminPage } from "./components/page/AdminPage";

const App = () => {
  return (
    <Routes>
      <Route path='/' element= {<LandingPage/>}/>  
      <Route path='/register' element= {<Register/>} />
      <Route path='/login' element= {<LoginForm/>}/>
      {/* <Route path='/guest' element= {<GuestPage/>}/> */}
      <Route path='/admin' element= {<AdminPage/>}/>
    </Routes>
  )
};

export default App
