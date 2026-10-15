
import LandingPage from "../src/components/page/LandingPage"
import { Register } from './components/page/RegisterForm';
import { Route, Routes } from 'react-router-dom';
import { LoginForm } from "./components/page/LoginForm";

const App = () => {
  return (
    <Routes>
      <Route path='/' element= {<LandingPage/>}/>  
      <Route path='/register' element= {<Register/>} />
      <Route path='/login' element= {<LoginForm/>}/>
      
    </Routes>
  )
};

export default App
