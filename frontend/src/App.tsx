import React from 'react';
import styles from "../src/components/page/LandingPage.module.css"
import LandingPage from "../src/components/page/LandingPage"
import { Register } from './components/page/RegisterForm';
import { Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Routes>
      <Route path='/' element= {<LandingPage/>}/>  
      <Route path='/register' element= {<Register/>} />
      
    </Routes>
  )
};

export default App
