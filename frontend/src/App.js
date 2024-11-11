import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages & components
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import PayMent from "./pages/Payment";
import PaymentPortal from "./pages/PaymentPortal";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/payment" element={<PayMent />} />
            <Route path="paymentPortal" element={<PaymentPortal />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
