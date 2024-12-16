import React from "react"
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile"
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import { AuthContext } from "./context/AuthContext";
import {
  BrowserRouter as Router,
  Routes, /*Updated version of react-router-dom uses 'Switch' instead of 'Routes' */
  Route,
  Navigate,
} from "react-router-dom";

function App() {

  const {user} = React.useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route exact path='/' element={user ? <Home />: <Register />}/>
        <Route path='/login' element={user ? <Navigate to="/"/> : <Login />} />
        <Route path='/register' element={user ? <Navigate to="/"/> : <Register />} />
        <Route path='/profile/:username' element={<Profile />}/>
      </Routes>
    </Router>
  );
}

export default App;
