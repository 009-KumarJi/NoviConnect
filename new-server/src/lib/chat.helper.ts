// This function is used to get the other member in a chat.
// It takes two parameters: 'members' which is an array of members in a chat, and 'userId' which is the ID of the current user.
// The function uses the 'find' method on the 'members' array to find the first member whose ID does not match the 'userId'.
// The function returns the member found, or 'undefined' if no such member exists.
export const getOtherMember = (members, userId) => {
  return members.find(member => member._id.toString() !== userId.toString());
}

// Path: server/lib/chat.helper.js