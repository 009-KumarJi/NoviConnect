import {io} from 'socket.io-client';
import {server} from "./constants/config.constant.js";
import {createContext, useContext, useMemo} from "react";


const socketContext = createContext();
const getSocket = () => useContext(socketContext);
const SocketProvider = ({children}) => {
  const socket = useMemo(
    () => io(server, {withCredentials: true,}),
    []
  );
    return (
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
    );
}
export {SocketProvider, getSocket};