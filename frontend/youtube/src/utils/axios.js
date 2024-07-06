import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "https://youtube-mern-brown.vercel.app",
    withCredentials: true
});