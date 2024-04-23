export const getOtherMember = (members, userId) => {
  return members.find(member => member._id.toString() !== userId.toString());
}

// Path: server/lib/chat.helper.js