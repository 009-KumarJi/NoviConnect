import {envMode} from "../server.js";

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

const sout = (...text) => envMode === "DEVELOPMENT" && console.log(...text);

export {ErrorHandler, sout};

// Path: server/utils/utility.js