import React, {lazy} from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute.jsx";
import Login from "./pages/Login.jsx";
import SignUpForm from "./pages/SignUp.jsx";
import NotFound from "./pages/NotFound.jsx";
import Home from "./pages/Home.jsx";
import Chat from "./pages/Chat.jsx";
import Groups from "./pages/Groups.jsx";


let user = true;

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        // This is the parent component that will render the child components based on the URL.
        // Only one child component will be rendered at a time.
        <Route element={<ProtectRoute user={user}/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/chat/:chatID" element={<Chat/>}/>
          <Route path="/groups" element={<Groups/>}/>
        </Route>
        <Route element={<ProtectRoute user={!user}/>}>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<SignUpForm/>}/>
        </Route>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;


// Path: client/App.jsx