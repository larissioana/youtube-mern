import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "https://youtube-mern-1-server.onrender.com/api",
    withCredentials: true
});
