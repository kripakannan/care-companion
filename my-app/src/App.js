import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login/Login";
import Resource from "./pages/Resource/Resource";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/resource" element={<Resource />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;