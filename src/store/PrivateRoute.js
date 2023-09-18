import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../store/firebase';

const PrivateRoute = ({ path, ...props }) => {
  const [user] = useAuthState(auth);
  console.log('path')
  if (user) {
    console.log(path)
    return <Route path={path} {...props} />;
  } else {
    return <Navigate to="/signin" />;
  }
};

export default PrivateRoute;
