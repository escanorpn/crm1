import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import HomePage from '../components/Home';
import Dashboard  from '../components/DashBoard/Dashboard';
// import Dashboard  from '../components/Dashboard1';
import LoginPage from '../components/Signin';
import Landing from '../components/Landing/Landing';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../store/firebase';
import Validate from '../components/validate';
import Admin from '../components/admin/admin';
import Profile from '../components/Profile'

const AppRoutes = () => {
  const [user] = useAuthState(auth);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isEmailSent = queryParams.get("email") === "sent";
  return (
    <Routes basename={'home'}>
      <Route path="/" element={user ? <Landing /> : <Landing /> } />
      <Route path="/home" element={user ? <Landing /> : <Landing />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/signin" />} />
      <Route path="/dashboard/users" element={user ? <Dashboard /> : <Navigate to="/signin" />} />
      <Route path="/signin" element={!user ? <LoginPage /> : <LoginPage />} />
      <Route
        path="/signin"
        element={!user ? <LoginPage isEmailSent={isEmailSent} /> : <LoginPage />}
      />
      <Route path="/landing" element={!user ? <Landing /> : <Landing />} />
      <Route path="/validate" element={!user ? <Validate /> : <Validate />} />
      <Route path="/admin" element={!user ? <LoginPage /> : <Admin />} />
      <Route path="/profile1" element={!user ? <LoginPage /> : <Profile />} />
      {/* Add other protected routes here */}
    </Routes>
  );
};

export default AppRoutes;
