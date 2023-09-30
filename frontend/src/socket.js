import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = import.meta.env.VITE_APP_BACKEND_SERVER_BASE_URL;

export const socket = io(URL);
