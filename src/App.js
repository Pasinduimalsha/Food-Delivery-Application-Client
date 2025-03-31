import logo from "./logo.svg";
import "./App.css";
import Home from "./Pages/Home/Home";
import Restaurant from "./Pages/Restaurant/Restaurant";
import Menu from './Pages/Menu/Menu'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/menu/:restaurantId" element={<Menu />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
