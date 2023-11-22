import type { AppProps } from "next/app";
import { io, Socket } from "socket.io-client";
import "@/styles/globals.css"

const socket: Socket = io("http://localhost:3002");

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Component {...pageProps} socket={socket} />
);

export default MyApp;
