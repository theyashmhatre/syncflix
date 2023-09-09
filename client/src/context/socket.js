import socketio from "socket.io-client";
import React, { createContext} from "react"
// import { SOCKET_URL } from "config";

const SOCKET_URL = 'http://localhost:4000'

export const socket = socketio.connect(SOCKET_URL);
export const SocketContext = createContext();