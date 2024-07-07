import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "https://youtube-mern-server.vercel.app",
    withCredentials: true
});
