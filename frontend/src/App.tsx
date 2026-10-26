
import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/page/LandingPage";
import { Register } from "./components/page/RegisterForm";
import { LoginForm } from "./components/page/LoginForm";
import { Accommodation } from "./components/page/AccommodationsView";
import AdminDashboard from "./components/page/AdminDashboard";
import RoomsView from "./components/page/RoomsView";
import HotelDetailCard from "./components/HotelDetailCard/HotelDetailCard";
import GuestDashboard from "./components/page/GuestDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { BookingModal } from "./components/page/BookingModal";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/hotels/:id" element={<HotelDetailCard />} />
      <Route element={<ProtectedRoute allowedRole="admin" />}>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/accommodation" element={<Accommodation />} />
      <Route path="/admin/rooms" element={<RoomsView />} />
    </Route>
      <Route element={<ProtectedRoute allowedRole="guest" />}>
      <Route path="/Guestdashboard" element={<GuestDashboard />} />
       <Route path="/guest/hotel/bookings" element={<HotelDetailCard />} />
      </Route>
    </Routes>
  );
};

export default App;
