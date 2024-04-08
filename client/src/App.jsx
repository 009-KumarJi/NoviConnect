import React, {lazy, Suspense} from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute.jsx";
import LayoutLoader from "./components/layout/Loaders.jsx";


const Login = lazy(() => import("./pages/Login.jsx"));
const SignUpForm = lazy(() => import("./pages/SignUp.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Chat = lazy(() => import("./pages/Chat.jsx"));
const Groups = lazy(() => import("./pages/Groups.jsx"));
const AdminLogin = lazy(() => import("./pages/KrishnaDen/KrishnaDenLogin.jsx"));
const Dashboard = lazy(() => import("./pages/KrishnaDen/Dashboard.jsx"));

// Just a dummy user for testing purposes.
let user = true;

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader/>}>
        <Routes>
          <Route element={<ProtectRoute user={user}/>}>
            <Route path="/" element={<Home/>}/>
            <Route path="/chat/:chatID" element={<Chat/>}/>
            <Route path="/groups" element={<Groups/>}/>
          </Route>
          <Route element={<ProtectRoute user={!user}/>}>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<SignUpForm/>}/>
          </Route>
          <Route path="/krishnaden" element={<AdminLogin/>}/>
          <Route path="/krishnaden/dashboard" element={<Dashboard/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App;


// Path: client/App.jsx