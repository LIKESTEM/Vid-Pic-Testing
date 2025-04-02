import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadFiles from './components/UploadFiles';
import FetchFiles from './components/FetchFiles';
import NavBar from './components/NavBar';
import Home from './components/Home';

import Login from "./security/Login";
import Register from "./security/Register";
import ForgotPassword from "./security/ForgotPassword";
import ResetPassword from "./security/ResetPassword";
import VerifyMfa from './security/VerifyMfa';
import Logout from './security/Logout';
import GoogleLogin from './security/GoogleLogin';
import UnauthErrorPage from './errors/unauth-access';
import OAuthSuccess from './security/OAuthSuccess';

function App() {
  return (
    <Router>
      <div>
        <NavBar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/upload-files' element={<UploadFiles/>}/>
          <Route path='/get-files' element={<FetchFiles/>}/>
          
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-mfa" element={<VerifyMfa />} />
          <Route path="/google-user-data" element={<GoogleLogin />} />
          <Route path="/unauth-redirect-url" element={<UnauthErrorPage />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
