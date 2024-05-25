export const usernameValidator = (username) => {
  if (!username) return "Username is required.";
  if (username.match(/\s/)) return "Username cannot contain spaces.";
  if (username.length < 6) return "Username must be at least 6 characters.";
  if (username.length > 20) return "Username must be at most 20 characters.";
  if (!username.match(/^[a-zA-Z0-9_.]+$/)) return "Username can only contain letters, numbers, points, and underscores.";
  if (username.match(/^[0-9.]/)) return "Username cannot start with a number or point.";
  if (username.match(/[.]$/)) return "Username cannot end with a point.";
}
