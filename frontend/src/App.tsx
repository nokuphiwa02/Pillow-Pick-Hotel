
import LandingPage from "../src/components/page/LandingPage"
import { Register } from './components/page/RegisterForm';
import { Route, Routes } from 'react-router-dom';
import { LoginForm } from "./components/page/LoginForm";
// import {GuestPage } from "./components/page/GuestPage"
// import { AccommodationsView } from "./components/page/AccommodationsView";
import { AdminDashboard } from "./components/page/AdminDashboard"

const App = () => {
  return (
    <Routes>
      <Route path='/' element= {<LandingPage/>}/>  
      <Route path='/register' element= {<Register/>} />
      <Route path='/login' element= {<LoginForm/>}/>
      <Route path='/admin' element= {<AdminDashboard/>}/>
    </Routes>
  )
};

export default App
