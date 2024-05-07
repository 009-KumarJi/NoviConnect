
// This file contains the configuration options for the server

const corsOptions = {
  origin: ["http://localhost:5173"], // Allow the client to make requests to this server
  credentials: true, // Allow the session cookie to be sent to and from the client
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
}
const NC_TOKEN = "nc-token";

export {corsOptions, NC_TOKEN};