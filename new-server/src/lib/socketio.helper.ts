export const getSockets = (users = []) => {
  return users.map(user => {
    if (typeof user === "object" && user !== null && user._id) {
      return user._id.toString();
    }
    return user.toString();
  });
};

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