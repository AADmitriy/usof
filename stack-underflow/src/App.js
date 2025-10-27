import './styles/global.css';
import Logo from './stackunderflow-logo.png';

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import LogoutPage from './pages/LogoutPage'
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import UserPage from './pages/UserPage'
import PostPage from './pages/PostPage'
import PostCreationPage from './pages/PostCreationPage';
import AdminPanelPage from './pages/AdminPanelPage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./slices/userSlice"
import { persistor } from "./store";
import { get_self } from "./api/users";
import { ReactComponent as Menu } from "./svgs/Menu.svg";



function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    get_self()
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((json) => {
            console.log(json)
            dispatch(login({
              id: json.user_data.id,
              name: json.user_data.username,
              role: json.user_data.role
            }))
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            dispatch(logout())
            persistor.purge()
        });
  }, [dispatch])

  const user = useSelector((state) => state.user.value);
  
  let user_related_links = null

  if (user) {
      user_related_links = (
      <div className="userRelatedLinks">
        <div className="desktop_links">
            {user.role === "admin" ? <Link to="/admin">Admin Panel</Link> : "" }
            <Link to="/self">My account</Link>
            <Link to="/logout">Logout</Link>
        </div>
        <div className="menu_wrapper">
            <div className="menu_icon_wrapper"><Menu/></div>
            <div className="menu_links">
                {user.role === "admin" ? <Link to="/admin">Admin Panel</Link> : "" }
                <Link to="/self">My account</Link>
                <Link to="/logout">Logout</Link>
            </div>
        </div>
      </div>
      )
  }
  else {
      user_related_links = (
        <div className="userRelatedLinks">
          <div className="desktop_links">
              <Link to="/login">Log In</Link>
              <Link to="/signup">Sign Up</Link>
          </div>
          <div className="menu_wrapper">
            <div className="menu_icon_wrapper"><Menu/></div>
            <div className="menu_links">
              <Link to="/login">Log In</Link>
              <Link to="/signup">Sign Up</Link>
            </div>
          </div>
        </div>
      )
  }

  return (
      <BrowserRouter>
          <nav>
            <div className="logo_container">
              <img className="logo" alt="" src={Logo}/>
              <Link to="/" className="logo_link">Stack Underflow</Link> 
            </div>
           {user_related_links}
          </nav>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/admin" element={<AdminPanelPage />} />
            <Route path="/confirm_email" element={<ConfirmEmailPage />} />
            <Route path="/self" element={<UserPage />} />
            <Route path="/posts/:id" element={<PostPage />} />
            <Route path="/create_post" element={<PostCreationPage />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App;
