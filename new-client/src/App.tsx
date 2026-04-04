import React, {lazy, Suspense, useEffect} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";
import {LayoutLoader} from "./components/layout/Loaders";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {server} from "./constants/config.constant";
import {userDoesNotExist, userExists} from "./redux/reducers/authSlice";
import {Toaster} from "react-hot-toast";
import {SocketProvider} from "./socket";

const Login = lazy(() => import("./pages/Login"));
const SignUpForm = lazy(() => import("./pages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Home = lazy(() => import("./pages/Home"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const AdminLogin = lazy(() => import("./pages/KrishnaDen/KrishnaDenLogin"));
const Dashboard = lazy(() => import("./pages/KrishnaDen/Dashboard"));
const UserManagement = lazy(() => import("./pages/KrishnaDen/UserManagement"));
const MessageManagement = lazy(() => import("./pages/KrishnaDen/MessageManagement"));
const ChatManagement = lazy(() => import("./pages/KrishnaDen/ChatManagement"));

const App = () => {

  const {user, isLoading, isAdmin} = useSelector((state: any) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/profile`, {withCredentials: true})
      .then(({data}) => dispatch(userExists(data.user)))
      .catch((err) => dispatch(userDoesNotExist()));
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
          <Route element={<ProtectRoute user={!user} redirect={"/"}/>}>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<SignUpForm/>}/>
            <Route path="/forgot-password" element={<ForgotPassword/>}/>
          </Route>

          <Route path="/krishnaden" element={<AdminLogin/>}/>

          <Route element={<ProtectRoute user={isAdmin} redirect="/krishnaden"/>}>
            <Route path="/krishnaden/dashboard" element={<Dashboard/>}/>
            <Route path="/krishnaden/user-management" element={<UserManagement/>}/>
            <Route path="/krishnaden/message-management" element={<MessageManagement/>}/>
            <Route path="/krishnaden/chat-management" element={<ChatManagement/>}/>
          </Route>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </Suspense>
      <Toaster position={"bottom-right"}/>
    </BrowserRouter>
  )
}

export default App;
