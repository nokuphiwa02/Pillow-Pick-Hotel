
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
import { Profile } from "./components/page/Profile";
import Checkout from "./components/page/Checkout";
import PaymentSuccess from "./components/page/PaymentSuccess";
import UsersView from "./components/page/UserView";

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
        <Route path="/admin/users" element={<UsersView />} />
      </Route>

      <Route element={<ProtectedRoute allowedRole="guest" />}>
        <Route path="/Guestdashboard" element={<GuestDashboard />} />
        <Route path="/guest/hotel/bookings" element={<HotelDetailCard />}/>
        <Route path="/guest/hotel/:id/checkout" element={<Checkout />}/>
      </Route>

      <Route path="/profile" element={<Profile />} />
      {/* Paystack returns the guest here after checkout */}
      <Route path="/payment-callback" element={<PaymentSuccess />}/>
    </Routes>
  );
};

export default App;
