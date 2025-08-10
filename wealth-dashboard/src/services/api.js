import axios from 'axios';

const api = axios.create({
    baseURL: 'https://wealth-manager-q43n.onrender.com/api', // update with your Django backend URL
});

export default api;
