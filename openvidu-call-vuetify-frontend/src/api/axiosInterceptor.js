import axios from 'axios';
const AUTH_DATA_NAME = "callAuthData";

axios.interceptors.request.use(function(config) {
    const authToken = localStorage.getItem(AUTH_DATA_NAME);
    if(authToken) {
      config.headers.Authorization = `Basic ${authToken}`;
      config.headers['Content-Type'] = "application/json";
    }
    return config;
}, function(err) {
    return Promise.reject(err);
});