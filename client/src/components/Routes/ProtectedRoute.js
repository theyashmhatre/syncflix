import React, { useEffect } from 'react'
import { useAuth } from '../../context/auth'
import { Navigate, Outlet, Route } from 'react-router-dom';
import { auth } from "../../firebase";

export default function ProtectedRoute({children}) {

  const {user} = useAuth();

  return typeof user === 'undefined' ? (
    <h1>Loading.....</h1>
  ) : user ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );

}
