import React, {lazy, Suspense, useEffect} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute.jsx";
import {LayoutLoader} from "./components/layout/Loaders.jsx";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {server} from "./constants/config.constant.js";
import {userDoesNotExist, userExists} from "./redux/reducers/authSlice.js";
import {Toaster} from "react-hot-toast";
import {SocketProvider} from "./socket.jsx";


const Login = lazy(() => import("./pages/Login.jsx"));
const SignUpForm = lazy(() => import("./pages/SignUp.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Chat = lazy(() => import("./pages/Chat.jsx"));
const Groups = lazy(() => import("./pages/Groups.jsx"));
const AdminLogin = lazy(() => import("./pages/KrishnaDen/KrishnaDenLogin.jsx"));
const Dashboard = lazy(() => import("./pages/KrishnaDen/Dashboard.jsx"));
const UserManagement = lazy(() => import("./pages/KrishnaDen/UserManagement.jsx"));
const MessageManagement = lazy(() => import("./pages/KrishnaDen/MessageManagement.jsx"));
const ChatManagement = lazy(() => import("./pages/KrishnaDen/ChatManagement.jsx"));


const App = () => {

  const {user, isLoading} = useSelector(state => state.auth);

  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/profile`, {withCredentials: true})
      .then(({data}) => dispatch(userExists(data.user)))
      .catch(err => dispatch(userDoesNotExist()));
  }, [dispatch]);

  return isLoading ? <LayoutLoader/> : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader/>}>
        <Routes>
          <Route element={<SocketProvider><ProtectRoute user={user}/></SocketProvider>}>
            <Route path="/" element={<Home/>}/>
            <Route path="/chat/:ChatId" element={<Chat/>}/>
            <Route path="/groups" element={<Groups/>}/>
          </Route>
          <Route element={<ProtectRoute user={true}/>}>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<SignUpForm/>}/>
          </Route>
          <Route path="/krishnaden" element={<AdminLogin/>}/>
          <Route path="/krishnaden/dashboard" element={<Dashboard/>}/>
          <Route path="/krishnaden/user-management" element={<UserManagement/>}/>
          <Route path="/krishnaden/message-management" element={<MessageManagement/>}/>
          <Route path="/krishnaden/chat-management" element={<ChatManagement/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </Suspense>
      <Toaster position={"bottom-right"}/>
    </BrowserRouter>
  )
}

export default App;


// Path: client/App.jsx