import {activeUserSocketIds} from "../server.js";

export const getSockets = (users=[]) => users.map(user => activeUserSocketIds.get(user.toString())); // sockets array

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