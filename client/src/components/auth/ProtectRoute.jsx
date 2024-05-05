import React from 'react';
import {Navigate, Outlet} from "react-router-dom";

// This component will be used to protect the routes that require authentication.
const ProtectRoute = ({children, user, redirect="/login"}) => {

    // If the user is not logged in, redirect them to the login page.
    if (!user) return <Navigate to={redirect}/>;

    // If the user is logged in, render the child components.
    // Otherwise, render the Outlet component.
    return children ? children : <Outlet />;
}

export default ProtectRoute;


// Path: client/src/components/auth/ProtectRoute.jsx