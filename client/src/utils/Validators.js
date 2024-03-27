import {isValidUsername} from "6pp";

export const usernameValidator = (username) => {
  if(username.length === 0){
    return;
  }
  if (!isValidUsername(username)) {
    return {
      isValid: true,
      errorMessage: "Invalid username"
    }
  }
}
