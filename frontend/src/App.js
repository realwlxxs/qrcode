import {
  BrowserRouter as Router,
  Routes, Route, Link
} from "react-router-dom";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

const App = () => {
  const handleLogout = () => {
    localStorage.setItem("login", false)
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={
          <div>
            <Header header={"首页"} />
            <a href="#" onClick={handleLogout}>注销帐号</a>
            <Link to="/profile" >个人资料</Link>
          </div>} />
      </Routes>
    </Router>
  );
};

export default App;
