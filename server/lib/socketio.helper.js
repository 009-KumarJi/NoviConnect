import {activeUserSocketIds} from "../server.js";
import {sout} from "../utils/utility.js";

export const getSockets = (users=[]) => {
  sout("Getting sockets for users: ", users);
  sout("Active User Socket Ids: ", activeUserSocketIds);
  return users.map(user => activeUserSocketIds.get(user.toString()))
}; // sockets array

export const createRoom = async (sockets, roomId, io) => {
  const room = `Room_${roomId}`;
  for (const socketId of sockets) {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      await new Promise((resolve) => socket.join(room, resolve));
    }
  }
  return room;
}