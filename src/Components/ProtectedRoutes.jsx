import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoutes = () => {
const location = useLocation();

// login ke baad localStorage me user save hota hai
const savedUser = localStorage.getItem("petilio_user");
let user = null;

try {
user = savedUser ? JSON.parse(savedUser) : null;
} catch (error) {
user = null;
}

// token nahi hai to login page par bhejo
// state me purana page bhej rahe hain, taaki login ke baad wapas aa sake
if (!user || !user.token) {
return <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

// token hai to andar ke pages dikhao
return <Outlet />;
}

export default ProtectedRoutes
