import React, {lazy} from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import SignUpForm from "./pages/SignUp.jsx";

// The lazy function is used to dynamically import the components only when it is needed.
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        // This is the parent component that will render the child components based on the URL.
        // Only one child component will be rendered at a time.
        <Route path="/" element={<Home/>}/>
        <Route path="/chat/:chatID" element={<Chat/>}/>
        <Route path="/groups" element={<Login/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<SignUpForm/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;