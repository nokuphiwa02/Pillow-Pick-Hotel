import LandingPage from "../src/components/page/LandingPage";
import { Register } from './components/page/RegisterForm';
import { Route, Routes } from 'react-router-dom';
import { LoginForm } from "./components/page/LoginForm";
import { Accommodation } from "./components/page/AccommodationsView";
import AdminDashboard from "./components/page/AdminDashboard";
import RoomsView from "./components/page/RoomsView";

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />  
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<LoginForm />} />
      <Route path='/admin' element={<AdminDashboard />} />
      <Route path='/admin/accommodation' element={<Accommodation />} />
      <Route path="/admin/rooms" element={< RoomsView/>} />
    </Routes>
  );
};

export default App;