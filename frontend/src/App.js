import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages & components
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Register />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
