import {envMode} from "../server.js";

class ErrorHandler extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

const sout = (...text) => envMode === "DEVELOPMENT" && console.log(...text);

export {ErrorHandler, sout};

// Path: server/utils/utility.js