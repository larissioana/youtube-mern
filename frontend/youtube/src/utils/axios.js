import axios from 'axios';
// https://youtube-mern-1-server.onrender.com/api
export const axiosInstance = axios.create({
    baseURL: "https://youtube-mern-1-server.onrender.com/api",
    withCredentials: true
});
